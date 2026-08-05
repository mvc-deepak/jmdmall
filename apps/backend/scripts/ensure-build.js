const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const medusaDir = path.join(__dirname, '..', '.medusa');
const adminIndexPath = path.join(medusaDir, 'server', 'public', 'admin', 'index.html');
const isProduction = process.env.NODE_ENV === 'production' || !process.env.NODE_ENV;

// Check various possible admin paths for debugging
const possiblePaths = [
  '.medusa/server/public/admin/index.html',
  '.medusa/admin/index.html',
  '.medusa/admin-build/index.html',
  'dist/admin/index.html',
];

console.log('[Startup] Environment: ' + (isProduction ? 'production' : 'development'));
console.log('[Startup] Checking for admin build...');

// Check if the expected path exists
let expectedPathExists = false;
let expectedPathSize = 0;
try {
  if (fs.existsSync(adminIndexPath)) {
    const stats = fs.statSync(adminIndexPath);
    expectedPathSize = stats.size;
    expectedPathExists = stats.size > 100; // index.html should be > 100 bytes
  }
} catch (e) {
  // ignore
}

// Always rebuild in production to ensure fresh build
if (isProduction) {
  console.log('[Startup] Production mode detected. Rebuilding admin to ensure fresh build...');
  try {
    if (fs.existsSync(medusaDir)) {
      fs.rmSync(medusaDir, { recursive: true, force: true });
      console.log('[Startup] Cleaned up .medusa directory.');
    }

    console.log('[Startup] Running medusa build...');
    execSync('medusa build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('[Startup] Build completed successfully.');
  } catch (error) {
    console.error('[Startup] Build failed:', error.message);
    process.exit(1);
  }
} else if (!expectedPathExists) {
  console.log('[Startup] Admin build missing or incomplete (size: ' + expectedPathSize + ' bytes). Rebuilding...');
  try {
    if (fs.existsSync(medusaDir)) {
      fs.rmSync(medusaDir, { recursive: true, force: true });
      console.log('[Startup] Cleaned up .medusa directory.');
    }

    console.log('[Startup] Running medusa build...');
    execSync('medusa build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('[Startup] Build completed successfully.');
  } catch (error) {
    console.error('[Startup] Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('[Startup] Admin build valid (' + expectedPathSize + ' bytes). Starting server...');
}
