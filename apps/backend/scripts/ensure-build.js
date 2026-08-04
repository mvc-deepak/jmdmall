const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const medusaDir = path.join(__dirname, '..', '.medusa');

if (!fs.existsSync(medusaDir)) {
  console.log('[Startup] .medusa directory not found. Running medusa build...');
  try {
    execSync('medusa build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('[Startup] Build completed successfully.');
  } catch (error) {
    console.error('[Startup] Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('[Startup] .medusa directory found. Skipping build.');
}
