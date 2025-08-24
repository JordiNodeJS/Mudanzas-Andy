// contact-form.js — handles sticky and inline contact forms
(function () {
  "use strict";

  function openWhatsAppWith(details) {
    var message = "¡Hola! Solicito presupuesto de mudanza.";
    if (details && details.name) message += " Nombre: " + details.name + ".";
    if (details && details.email) message += " Email: " + details.email + ".";
    if (details && details.phone)
      message += " Teléfono: " + details.phone + ".";
    if (details && details.service)
      message += " Servicio: " + details.service + ".";
    if (details && details.message)
      message += " Comentarios: " + details.message + ".";

    var url = "https://wa.me/34640506084?text=" + encodeURIComponent(message);
    window.open(url, "_blank");
  }

  // Sticky variant
  var budgetForm = document.getElementById("budgetForm");
  if (budgetForm) {
    budgetForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var emailEl = document.getElementById("email");
      var phoneEl = document.getElementById("phone");
      var email = "";
      var phone = "";
      if (emailEl && typeof emailEl.value === "string")
        email = emailEl.value.trim();
      if (phoneEl && typeof phoneEl.value === "string")
        phone = phoneEl.value.trim();
      if (!email) {
        window.alert(
          "Por favor, ingresa tu email para que podamos enviarte el presupuesto."
        );
        return;
      }

      var formContainer = document.getElementById("contactForm");
      if (formContainer) {
        formContainer.innerHTML =
          '\n          <div class="container mx-auto px-4 py-4 text-center">\n            <div class="bg-success text-white p-4 rounded-lg">\n              <p class="font-bold">¡Listo! Te contactaremos en menos de 10 minutos por WhatsApp.</p>\n              <p class="text-sm mt-2">¿Necesitas ayuda URGENTE? <a href="tel:+34933539792" class="underline font-bold">Llama ahora al 933 53 97 92</a></p>\n              <a id="open-wsp-after" href="#" class="inline-block mt-3 bg-highlight text-primary px-4 py-2 rounded-lg font-bold">Abrir WhatsApp 💬</a>\n            </div>\n          </div>\n        ';
        var openBtn = document.getElementById("open-wsp-after");
        if (openBtn)
          openBtn.addEventListener("click", function () {
            openWhatsAppWith({ email: email, phone: phone });
          });
      }

      openWhatsAppWith({ email: email, phone: phone });
    });

    var toggle = document.getElementById("toggleForm");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var form = document.getElementById("contactForm");
        if (!form) return;

        // Usar transform style en lugar de clases
        var currentTransform = form.style.transform;
        if (currentTransform === "translateY(0%)" || currentTransform === "") {
          // Banner visible -> ocultarlo
          form.style.transform = "translateY(100%)";
          // show up-arrow to indicate it can be opened again
          toggle.textContent = "↑";
          toggle.title = "Mostrar formulario de presupuesto gratis";
        } else {
          // Banner oculto -> mostrarlo
          form.style.transform = "translateY(0%)";
          toggle.textContent = "✕";
          toggle.title = "Cerrar formulario de presupuesto gratis";
        }
      });
    }
  }

  // Inline variant
  var inlineForm = document.getElementById("inlineBudgetForm");
  if (inlineForm) {
    inlineForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {};
      var nameEl = document.getElementById("name-inline");
      var emailEl = document.getElementById("email-inline");
      var phoneEl = document.getElementById("phone-inline");
      var serviceEl = document.getElementById("service-inline");
      var messageEl = document.getElementById("message-inline");

      if (nameEl && typeof nameEl.value === "string")
        data.name = nameEl.value.trim();
      if (emailEl && typeof emailEl.value === "string")
        data.email = emailEl.value.trim();
      if (phoneEl && typeof phoneEl.value === "string")
        data.phone = phoneEl.value.trim();
      if (serviceEl && typeof serviceEl.value === "string")
        data.service = serviceEl.value;
      if (messageEl && typeof messageEl.value === "string")
        data.message = messageEl.value.trim();

      if (!data.email) {
        window.alert("Por favor, indica tu email para recibir el presupuesto.");
        return;
      }

      openWhatsAppWith(data);

      var parent = inlineForm.parentElement;
      if (parent) {
        parent.innerHTML = `
          <div class="p-4 bg-success/10 rounded-md border border-success/20 text-success">
            <strong>¡Enviado!</strong> Te contactaremos por WhatsApp en menos de 10 minutos.
          </div>
        `;
      }
    });
  }
})();
