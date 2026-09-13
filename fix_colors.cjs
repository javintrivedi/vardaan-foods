const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'style.css');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/rgba\(0, 0, 0, 0\.8\)/g, 'rgba(0, 0, 0, 0.2)');
content = content.replace(/#181410/g, 'var(--vf-bg-card)');
content = content.replace(/rgba\(0, 0, 0, 0\.5\)/g, 'rgba(0, 0, 0, 0.05)');
content = content.replace(/background: #1c1813;/g, 'background: var(--vf-bg-card);');
content = content.replace(/background: #090806;/g, 'background: var(--vf-bg-dark);');
content = content.replace(/#6b6354/g, 'var(--vf-ink-muted)');
content = content.replace(/#8f8675/g, 'var(--vf-ink-muted)');
content = content.replace(/color: #1c1813;/g, 'color: var(--vf-paper);');

fs.writeFileSync(file, content);
console.log('Fixed missed colors in style.css');
