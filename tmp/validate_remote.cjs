const fs = require('fs');
const htmlPath = 'g:/DEV/PROJECTS/mudanzas-astro/tmp/mudanzasandy.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
let m;
const blocks = [];
while ((m = regex.exec(html)) !== null) blocks.push(m[1]);
if (blocks.length === 0) {
  console.error('No JSON-LD blocks found');
  process.exit(1);
}
blocks.forEach((raw, i) => {
  try {
    const json = JSON.parse(raw);
    console.log('\n-- Block #' + i + ' -- Type:', Array.isArray(json) ? json.map(x => x['@type']).join(',') : json['@type']);
    const issues = [];
    const checkObj = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      if (obj['@context'] && obj['@context'] !== 'https://schema.org') issues.push('@context not https://schema.org');
      if (!obj['@type']) issues.push('@type missing');
      if (obj['@type'] === 'MovingCompany') {
        ['name','url','telephone','address'].forEach(k => { if (!obj[k]) issues.push('Missing '+k); });
        if (obj.address) {
          ['streetAddress','addressLocality','addressRegion','postalCode','addressCountry'].forEach(k => { if (!obj.address[k]) issues.push('PostalAddress missing '+k); });
        }
        if (obj.aggregateRating) {
          if (typeof obj.aggregateRating.ratingValue === 'string') issues.push('aggregateRating.ratingValue is string');
          if (typeof obj.aggregateRating.reviewCount === 'string') issues.push('aggregateRating.reviewCount is string');
        }
        if (Array.isArray(obj.review)) obj.review.forEach((r,ri)=>{ if (typeof r?.reviewRating?.ratingValue === 'string') issues.push('review['+ri+'].ratingValue is string'); });
      }
      if (obj['@type'] === 'WebSite') { if (!obj.name) issues.push('WebSite.name missing'); if (!obj.url) issues.push('WebSite.url missing'); }
      if (obj['@type'] === 'BreadcrumbList') { if (!Array.isArray(obj.itemListElement) || obj.itemListElement.length===0) issues.push('BreadcrumbList.itemListElement missing or empty'); }
    };
    if (Array.isArray(json)) json.forEach(checkObj); else checkObj(json);
    if (issues.length) { console.log('Issues:'); issues.forEach(x=>console.log(' -',x)); } else console.log('OK — no issues found');
  } catch(e) { console.error('Parse error block', i, e.message); }
});
