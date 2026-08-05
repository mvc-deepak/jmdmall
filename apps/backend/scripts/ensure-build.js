const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const medusaDir = path.join(__dirname, '..', '.medusa');
const adminIndexPath = path.join(medusaDir, 'server', 'public', 'admin', 'index.html');

// Check if admin build is complete and has content
let isBuildComplete = false;
try {
  if (fs.existsSync(adminIndexPath)) {
    const stats = fs.statSync(adminIndexPath);
    isBuildComplete = stats.size > 0;
  }
} catch (e) {
  isBuildComplete = false;
}

if (!isBuildComplete) {
  console.log('[Startup] Admin build missing or incomplete. Rebuilding...');

  try {
    // Always clean up and rebuild to ensure fresh build
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
  console.log('[Startup] Admin build valid. Starting server...');
}
