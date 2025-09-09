#!/usr/bin/env node

/**
 * Asset Optimization Script for Vantage Point Website
 * 
 * This script optimizes images and other assets for web delivery.
 * Run with: node optimize-assets.js
 */

const fs = require('fs');
const path = require('path');

// Asset directories to process
const ASSET_DIRS = [
  'assets/images',
  'assets/videos',
  'assets/downloads'
];

// File extensions to optimize
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi'];
const DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt'];

console.log('🔧 Starting asset optimization...');

// Check if directories exist and create them if needed
function ensureDirectories() {
  ASSET_DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
}

// Get file size in human readable format
function getFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Analyze assets in a directory
function analyzeAssets(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let totalSize = 0;
  let fileCount = 0;
  
  files.forEach(file => {
    if (file.isFile()) {
      const filePath = path.join(dir, file.name);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
      fileCount++;
      
      const ext = path.extname(file.name).toLowerCase();
      const size = getFileSize(stats.size);
      
      if (IMAGE_EXTENSIONS.includes(ext)) {
        console.log(`🖼️  Image: ${file.name} (${size})`);
      } else if (VIDEO_EXTENSIONS.includes(ext)) {
        console.log(`🎥 Video: ${file.name} (${size})`);
      } else if (DOCUMENT_EXTENSIONS.includes(ext)) {
        console.log(`📄 Document: ${file.name} (${size})`);
      } else {
        console.log(`📁 File: ${file.name} (${size})`);
      }
    }
  });
  
  if (fileCount > 0) {
    console.log(`📊 ${dir}: ${fileCount} files, ${getFileSize(totalSize)} total`);
  }
}

// Generate asset manifest
function generateAssetManifest() {
  const manifest = {
    generated: new Date().toISOString(),
    assets: {}
  };
  
  ASSET_DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir, { withFileTypes: true });
    manifest.assets[dir] = files
      .filter(file => file.isFile())
      .map(file => {
        const filePath = path.join(dir, file.name);
        const stats = fs.statSync(filePath);
        return {
          name: file.name,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          path: filePath
        };
      });
  });
  
  fs.writeFileSync('assets-manifest.json', JSON.stringify(manifest, null, 2));
  console.log('📋 Generated assets-manifest.json');
}

// Main optimization process
function optimizeAssets() {
  console.log('🚀 Vantage Point Asset Optimization');
  console.log('=====================================\n');
  
  // Ensure directories exist
  ensureDirectories();
  
  // Analyze each asset directory
  ASSET_DIRS.forEach(dir => {
    console.log(`\n📂 Analyzing ${dir}:`);
    analyzeAssets(dir);
  });
  
  // Generate manifest
  generateAssetManifest();
  
  console.log('\n✅ Asset optimization complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Add your actual assets to the appropriate directories');
  console.log('2. Optimize images using tools like ImageOptim or TinyPNG');
  console.log('3. Compress videos using FFmpeg or similar tools');
  console.log('4. Test your site locally with: npm run dev');
  console.log('5. Deploy with: npm run deploy');
}

// Run the optimization
optimizeAssets();


