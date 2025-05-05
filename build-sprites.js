#!/usr/bin/env node

// Load .env into process.env
require('dotenv').config();   // npm install dotenv

const spritezero = require('@jutaz/spritezero');
const fs        = require('fs');
const glob      = require('glob');
const path      = require('path');

// Promisify spritezero callbacks
function generateLayout(imgs, pixelRatio, format) {
  return new Promise((resolve, reject) => {
    spritezero.generateLayout({ imgs, pixelRatio, format }, (err, layout) => {
      if (err) reject(err);
      else resolve(layout);
    });
  });
}
function generateImage(layout) {
  return new Promise((resolve, reject) => {
    spritezero.generateImage(layout, (err, image) => {
      if (err) reject(err);
      else resolve(image);
    });
  });
}

async function main() {
  // 1) CONFIG
  const UPLOAD_DIR = process.env.SHARE_NAME;
  if (!UPLOAD_DIR) {
    throw new Error('Please set SHARE_NAME in your .env to your mount path');
  }
  // **Do not create** if missing — error out instead
  if (!fs.existsSync(UPLOAD_DIR) || !fs.statSync(UPLOAD_DIR).isDirectory()) {
    throw new Error(`Upload directory does not exist: ${UPLOAD_DIR}`);
  }

  const inputDir  = path.resolve(__dirname, 'input');
  const outputDir = path.resolve(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 2) LOAD SVGs
  const svgFiles = glob.sync(path.join(inputDir, '*.svg'));
  const svgs = svgFiles.map(file => ({
    svg: fs.readFileSync(file),
    id:  path.basename(file, '.svg'),
  }));

  // 3) GENERATE + COPY
  for (const pxRatio of [1, 2, 4]) {
    const spriteId = pxRatio > 1 ? `sprite@${pxRatio}x` : 'sprite';
    const jsonPath = path.join(outputDir, `${spriteId}.json`);
    const pngPath  = path.join(outputDir, `${spriteId}.png`);

    // a) JSON manifest
    const dataLayout = await generateLayout(svgs, pxRatio, true);
    fs.writeFileSync(jsonPath, JSON.stringify(dataLayout, null, 2));
    console.log(`✎ Wrote ${jsonPath}`);

    // b) PNG image
    const imageLayout  = await generateLayout(svgs, pxRatio, false);
    const imageBuffer  = await generateImage(imageLayout);
    fs.writeFileSync(pngPath, imageBuffer);
    console.log(`✎ Wrote ${pngPath}`);

    const destJson = path.join(UPLOAD_DIR, path.basename(jsonPath));
    const destPng  = path.join(UPLOAD_DIR, path.basename(pngPath));

    fs.copyFileSync(jsonPath, destJson);
    console.log(`✔ Copied ${path.basename(jsonPath)} → ${UPLOAD_DIR}`);

    fs.copyFileSync(pngPath, destPng);
    console.log(`✔ Copied ${path.basename(pngPath)} → ${UPLOAD_DIR}`);
  }

  console.log('✅ All sprites generated and deployed locally!');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
