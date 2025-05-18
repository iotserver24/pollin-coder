const fs = require('fs');
const path = require('path');

// This script helps identify the largest dependencies in your Edge Function bundles
function analyzeEdgeBundle() {
  const edgeBundlePath = path.join(__dirname, '.next/server/edge-chunks');
  
  if (!fs.existsSync(edgeBundlePath)) {
    console.log('Edge bundle directory not found. Run `npm run build` first.');
    return;
  }
  
  const files = fs.readdirSync(edgeBundlePath);
  
  const fileSizes = files
    .map(file => {
      const filePath = path.join(edgeBundlePath, file);
      const stats = fs.statSync(filePath);
      return {
        file,
        size: stats.size,
        sizeInMB: (stats.size / (1024 * 1024)).toFixed(2) + ' MB'
      };
    })
    .sort((a, b) => b.size - a.size);
  
  console.log('Edge bundle size analysis:');
  fileSizes.forEach(item => {
    console.log(`${item.file}: ${item.sizeInMB}`);
  });
  
  const totalSize = fileSizes.reduce((acc, item) => acc + item.size, 0);
  console.log(`\nTotal Edge bundle size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
}

// Run the analysis
analyzeEdgeBundle(); 