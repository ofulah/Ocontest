const fs = require('fs');
const path = require('path');

// Create a simple 1x1 transparent PNG as a placeholder
const placeholderImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

// List of files to create
const files = [
  'public/images/homepage-images/video-holder.png',
  'public/images/homepage-images/icons/1.png',
  'public/images/homepage-images/icons/2.png',
  'public/images/homepage-images/home-banners/what-is.png',
  'public/images/homepage-images/home-banners/application.png',
  'public/images/homepage-images/home-banners/review.png',
  'public/images/homepage-images/home-banners/tt.png',
  'public/images/homepage-images/home-banners/community.png',
  'public/images/homepage-images/overlay/paint-black.png',
  'public/images/homepage-images/overlay/paint-white.png',
  'public/videos/homepage-banner-video.mp4'
];

// Create each file
files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write the file
  fs.writeFileSync(fullPath, filePath.endsWith('.mp4') ? 'PLACEHOLDER_VIDEO' : placeholderImage);
  console.log(`Created: ${filePath}`);
});

console.log('\nAll placeholder files have been created successfully.');
