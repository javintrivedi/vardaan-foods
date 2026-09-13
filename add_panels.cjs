const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'index.html');
let content = fs.readFileSync(file, 'utf8');

// Add panel class to all main sections
content = content.replace(/id="hero" class="hero-section"/, 'id="hero" class="hero-section panel"');
content = content.replace(/id="shop" class="section"/, 'id="shop" class="section panel"');
content = content.replace(/id="comparison" class="section section-alt"/, 'id="comparison" class="section section-alt panel"');
content = content.replace(/id="process" class="section"/, 'id="process" class="section panel"');
content = content.replace(/id="quiz-banner" class="section section-alt"/, 'id="quiz-banner" class="section section-alt panel"');
content = content.replace(/id="faq" class="section"/, 'id="faq" class="section panel"');

fs.writeFileSync(file, content);
console.log('Added panel class to sections in index.html');
