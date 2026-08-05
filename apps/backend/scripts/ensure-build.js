const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const medusaDir = path.join(__dirname, '..', '.medusa');
const adminIndexPath = path.join(medusaDir, 'server', 'public', 'admin', 'index.html');

// Check if admin build is complete (index.html must exist)
const isBuildComplete = fs.existsSync(adminIndexPath);

if (!isBuildComplete) {
  const debugInfo = [];
  if (fs.existsSync(medusaDir)) {
    debugInfo.push(`.medusa exists: ${fs.readdirSync(medusaDir).join(', ')}`);
    const serverDir = path.join(medusaDir, 'server');
    if (fs.existsSync(serverDir)) {
      const publicDir = path.join(serverDir, 'public');
      if (fs.existsSync(publicDir)) {
        const adminDir = path.join(publicDir, 'admin');
        if (fs.existsSync(adminDir)) {
          debugInfo.push(`.medusa/server/public/admin exists with: ${fs.readdirSync(adminDir).slice(0, 5).join(', ')}`);
        } else {
          debugInfo.push('.medusa/server/public/admin does NOT exist');
        }
      } else {
        debugInfo.push('.medusa/server/public does NOT exist');
      }
    } else {
      debugInfo.push('.medusa/server does NOT exist');
    }
  } else {
    debugInfo.push('.medusa directory does NOT exist');
  }
  console.log('[Startup] Admin build incomplete or missing.');
  console.log('[Startup] Debug: ' + debugInfo.join(' | '));
  console.log('[Startup] Running full medusa build...');

  try {
    // Clean up incomplete build
    if (fs.existsSync(medusaDir)) {
      fs.rmSync(medusaDir, { recursive: true, force: true });
      console.log('[Startup] Cleaned up incomplete .medusa directory.');
    }

    execSync('medusa build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('[Startup] Build completed successfully.');
  } catch (error) {
    console.error('[Startup] Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('[Startup] Admin build complete. Starting server...');
}
