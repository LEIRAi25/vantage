const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const terser = require('terser');
const CleanCSS = require('clean-css');

const ASSETS_DIR = path.join(__dirname, 'assets');
const IMAGES_DIR = path.join(ASSETS_DIR, 'images');
const CSS_FILE = path.join(__dirname, 'new-styles.css');
const JS_FILE = path.join(__dirname, 'scripts.js');

async function optimizeImages() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log(`Image directory not found: ${IMAGES_DIR}`);
    return;
  }

  console.log('Optimizing images...');
  const files = fs.readdirSync(IMAGES_DIR);

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    const fileExt = path.extname(file).toLowerCase();

    if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
      try {
        const optimizedImage = await sharp(filePath)
          .jpeg({ quality: 80 })
          .png({ quality: 80 })
          .toBuffer();

        fs.writeFileSync(filePath, optimizedImage);
        console.log(`Optimized: ${file}`);
      } catch (error) {
        console.error(`Could not optimize ${file}:`, error);
      }
    }
  }
}

async function minifyCss() {
  if (!fs.existsSync(CSS_FILE)) {
    console.log(`CSS file not found: ${CSS_FILE}`);
    return;
  }

  console.log('Minifying CSS...');
  const css = fs.readFileSync(CSS_FILE, 'utf8');
  const output = new CleanCSS({}).minify(css);
  fs.writeFileSync(CSS_FILE, output.styles, 'utf8');
  console.log('CSS minified.');
}

async function minifyJs() {
  if (!fs.existsSync(JS_FILE)) {
    console.log(`JavaScript file not found: ${JS_FILE}`);
    return;
  }

  console.log('Minifying JavaScript...');
  const js = fs.readFileSync(JS_FILE, 'utf8');
  const result = await terser.minify(js);
  if (result.error) {
    console.error('Terser error:', result.error);
    return;
  }
  fs.writeFileSync(JS_FILE, result.code, 'utf8');
  console.log('JavaScript minified.');
}

async function build() {
  console.log('Starting production build...');
  console.warn('WARNING: This script performs in-place optimizations, which will overwrite your original files.');

  await optimizeImages();
  await minifyCss();
  await minifyJs();

  console.log('Build complete.');
}

build();
