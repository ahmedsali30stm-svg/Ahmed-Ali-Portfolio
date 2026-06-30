const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgPath = path.join(__dirname, '..', 'public', 'og-image.svg');
const pngPath = path.join(__dirname, '..', 'public', 'og-image.png');

const svg = fs.readFileSync(svgPath);

sharp(svg)
  .resize(1200, 630)
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('OG image generated: public/og-image.png (1200x630)');
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
