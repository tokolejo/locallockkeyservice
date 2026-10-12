const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createOgImage() {
  const width = 1200;
  const height = 630;

  // 1. Resize hero banner to cover 1200x630
  const bg = await sharp('public/gallery/hero-banner.png')
    .resize(width, height, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.75 })
    .toBuffer();

  // 2. Resize logo
  const logo = await sharp('public/gallery/logo.png')
    .resize({ width: 500 })
    .toBuffer();

  // 3. Create SVG overlay with brand elements, text, and emergency dispatch badge
  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617" stop-opacity="0.90" />
          <stop offset="50%" stop-color="#0f172a" stop-opacity="0.84" />
          <stop offset="100%" stop-color="#020617" stop-opacity="0.94" />
        </linearGradient>
      </defs>
      
      <!-- Dark contrast backdrop with subtle border -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#grad)" />
      <rect x="25" y="25" width="${width - 50}" height="${height - 50}" rx="24" fill="none" stroke="#334155" stroke-width="2" />

      <!-- Top Badge -->
      <g transform="translate(70, 60)">
        <rect x="0" y="0" width="350" height="42" rx="21" fill="#059669" fill-opacity="0.3" stroke="#10b981" stroke-width="1.5" />
        <circle cx="22" cy="21" r="7" fill="#10b981" />
        <text x="40" y="27" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#34d399" letter-spacing="1">
          24/7 MOBILE DISPATCH IN NH
        </text>
      </g>

      <!-- White Logo Container Card -->
      <rect x="70" y="125" width="560" height="225" rx="20" fill="#ffffff" />

      <!-- Subtitle / Highlights -->
      <text x="70" y="405" font-family="Arial, sans-serif" font-size="36" font-weight="800" fill="#ffffff" letter-spacing="-0.5">
        Car Lockout • Door Rekey • Smart Keys
      </text>
      
      <text x="70" y="450" font-family="Arial, sans-serif" font-size="21" font-weight="500" fill="#94a3b8">
        Manchester, NH • Bedford • Nashua • Concord &amp; Surrounding
      </text>

      <!-- Bottom Phone CTA Pill -->
      <g transform="translate(70, 490)">
        <rect x="0" y="0" width="460" height="60" rx="16" fill="#10b981" />
        <text x="32" y="39" font-family="Arial, sans-serif" font-size="25" font-weight="900" fill="#ffffff" letter-spacing="0.5">
          CALL 24/7: +1 (603) 290-5554
        </text>
      </g>

      <!-- Trust Badges on the right -->
      <g transform="translate(800, 140)">
        <rect x="0" y="0" width="330" height="100" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <text x="24" y="45" font-family="Arial, sans-serif" font-size="24" font-weight="800" fill="#f59e0b">★ 5.0 Google Rating</text>
        <text x="24" y="76" font-family="Arial, sans-serif" font-size="15" font-weight="500" fill="#cbd5e1">100% Verified Customer Reviews</text>
      </g>

      <g transform="translate(800, 260)">
        <rect x="0" y="0" width="330" height="100" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <text x="24" y="45" font-family="Arial, sans-serif" font-size="24" font-weight="800" fill="#38bdf8">15–20 Min ETA</text>
        <text x="24" y="76" font-family="Arial, sans-serif" font-size="15" font-weight="500" fill="#cbd5e1">Rapid Mobile Locksmith Fleet</text>
      </g>

      <g transform="translate(800, 380)">
        <rect x="0" y="0" width="330" height="100" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <text x="24" y="45" font-family="Arial, sans-serif" font-size="24" font-weight="800" fill="#34d399">100% Damage-Free</text>
        <text x="24" y="76" font-family="Arial, sans-serif" font-size="15" font-weight="500" fill="#cbd5e1">Fully Insured &amp; Registered in NH</text>
      </g>
    </svg>
  `);

  // Composite everything
  await sharp(bg)
    .composite([
      { input: svgOverlay, top: 0, left: 0 },
      { input: logo, top: 140, left: 100 }
    ])
    .jpeg({ quality: 92 })
    .toFile('public/og-image.jpg');

  // Also save PNG copies
  await sharp('public/og-image.jpg')
    .png()
    .toFile('public/og-image.png');

  await sharp('public/og-image.jpg')
    .png()
    .toFile('src/app/opengraph-image.png');

  console.log('og-image generated successfully in public and src/app!');
}

createOgImage().catch(console.error);
