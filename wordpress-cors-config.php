<?php
/**
 * Configuración CORS para WordPress REST API
 * 
 * Este código debe añadirse al archivo functions.php de tu tema de WordPress
 * o crear un plugin personalizado.
 * 
 * IMPORTANTE: Esto permite que tu sitio Astro (mudanzasandy.es) acceda a la API
 * de WordPress desde el navegador del cliente.
 * 
 * Ubicación: wp-content/themes/TU-TEMA/functions.php
 * o crear: wp-content/plugins/mudanzas-andy-cors/mudanzas-andy-cors.php
 */

/**
 * Habilitar CORS para API REST de WordPress
 * 
 * Permite peticiones desde dominios específicos a la API REST de WordPress
 */
add_action('rest_api_init', function() {
    // Remover headers CORS por defecto
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    
    // Añadir headers CORS personalizados
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        
        // Lista de dominios permitidos
        $allowed_origins = [
            'https://mudanzasandy.es',           // Producción
            'https://www.mudanzasandy.es',       // Producción con www
            'http://localhost:4321',              // Desarrollo local
            'http://localhost:3000',              // Desarrollo alternativo
        ];
        
        // Verificar si el origen está en la lista permitida
        if (in_array($origin, $allowed_origins)) {
            // Permitir peticiones desde este origen
            header('Access-Control-Allow-Origin: ' . $origin);
            
            // Métodos HTTP permitidos
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT');
            
            // Permitir credenciales (cookies, auth headers)
            header('Access-Control-Allow-Credentials: true');
            
            // Headers que el cliente puede enviar
            header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, X-Requested-With, Accept');
            
            // Headers que el cliente puede leer
            header('Access-Control-Expose-Headers: X-WP-Total, X-WP-TotalPages');
            
            // Cache de preflight request (24 horas)
            header('Access-Control-Max-Age: 86400');
        }
        
        return $value;
    });
}, 15);

/**
 * Manejar peticiones OPTIONS (preflight)
 * 
 * Los navegadores envían peticiones OPTIONS antes de la petición real
 * para verificar permisos CORS
 */
add_action('rest_api_init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        // Headers para preflight request
        $origin = get_http_origin();
        $allowed_origins = [
            'https://mudanzasandy.es',
            'https://www.mudanzasandy.es',
            'http://localhost:4321',
            'http://localhost:3000',
        ];
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, X-Requested-With, Accept');
            header('Access-Control-Max-Age: 86400');
            
            // Terminar ejecución para peticiones OPTIONS
            status_header(200);
            exit();
        }
    }
}, 10);

/**
 * Añadir datos adicionales a la respuesta de la API
 * 
 * Esto asegura que los datos embebidos (_embed) estén disponibles
 * para el cliente sin peticiones adicionales
 */
add_filter('rest_prepare_post', function($response, $post, $request) {
    // Verificar si se solicitó _embed
    if ($request->get_param('_embed') === 'true' || $request->get_param('_embed') === '1') {
        $data = $response->get_data();
        
        // Asegurar que _embedded esté presente
        if (!isset($data['_embedded'])) {
            $embedded = [];
            
            // Añadir autor
            if (isset($post->post_author)) {
                $author = get_user_by('id', $post->post_author);
                if ($author) {
                    $embedded['author'] = [[
                        'id' => $author->ID,
                        'name' => $author->display_name,
                        'url' => get_author_posts_url($author->ID),
                    ]];
                }
            }
            
            // Añadir imagen destacada
            $thumbnail_id = get_post_thumbnail_id($post->ID);
            if ($thumbnail_id) {
                $image_url = wp_get_attachment_image_src($thumbnail_id, 'large');
                if ($image_url) {
                    $embedded['wp:featuredmedia'] = [[
                        'id' => $thumbnail_id,
                        'source_url' => $image_url[0],
                        'alt_text' => get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true),
                        'media_details' => [
                            'width' => $image_url[1],
                            'height' => $image_url[2],
                        ]
                    ]];
                }
            }
            
            $data['_embedded'] = $embedded;
            $response->set_data($data);
        }
    }
    
    return $response;
}, 10, 3);

/**
 * Optimizar respuesta de la API para mejor performance
 * 
 * Reduce el tamaño de la respuesta eliminando campos innecesarios
 */
add_filter('rest_prepare_post', function($response, $post, $request) {
    $data = $response->get_data();
    
    // Remover campos innecesarios si no se solicitan explícitamente
    $fields_to_remove = ['guid', 'link', 'ping_status', 'comment_status'];
    
    foreach ($fields_to_remove as $field) {
        if (isset($data[$field]) && !$request->get_param($field)) {
            unset($data[$field]);
        }
    }
    
    $response->set_data($data);
    return $response;
}, 11, 3);

/**
 * Logging de peticiones para debugging (SOLO DESARROLLO)
 * 
 * Descomenta esto solo si necesitas debuggear problemas de CORS
 */
/*
add_action('rest_api_init', function() {
    error_log('REST API Request: ' . $_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI']);
    error_log('Origin: ' . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'No origin'));
});
*/

/**
 * NOTAS IMPORTANTES:
 * 
 * 1. SEGURIDAD: Solo añade dominios de confianza a $allowed_origins
 * 2. TESTING: Usa las herramientas de desarrollo del navegador (F12) para ver los headers CORS
 * 3. CACHE: Si usas un plugin de cache, asegúrate de excluir /wp-json/ del cache
 * 4. CDN: Si usas Cloudflare u otro CDN, configura que pase los headers CORS
 * 5. PLUGINS: Si usas un plugin de seguridad, asegúrate de que no bloquee la API REST
 * 
 * Para verificar que CORS funciona, ejecuta en tu terminal:
 * curl -I -H "Origin: https://mudanzasandy.es" https://barcelona.mudanzasandy.es/wp-json/wp/v2/posts
 * 
 * Deberías ver: Access-Control-Allow-Origin: https://mudanzasandy.es
 */
