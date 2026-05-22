const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'downloaded');
const destDir = 'C:\\Users\\RK COMPUTERS\\.gemini\\antigravity\\brain\\e62b8597-2ee3-49fa-8945-8d55c75a501f';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy downloaded files
const files = fs.readdirSync(srcDir);
files.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${file} to ${destPath}`);
});

// Also copy local original files for comparison
const localSrcDir = path.join(__dirname, '../public/images/products');
const localFiles = ['lunch-box.jpg', 'mist-fan.jpg', 'portable-ac.jpg'];
localFiles.forEach(file => {
  const srcPath = path.join(localSrcDir, file);
  const destPath = path.join(destDir, 'original-' + file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied original-${file} to ${destPath}`);
  }
});
