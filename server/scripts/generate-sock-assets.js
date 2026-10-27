const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, '../../client/public/images/socks');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to create high-fashion editorial sock SVG
function createSockSvg({
  themeName,
  primaryColor,
  accentColor,
  heelToeColor,
  cuffStripeColor,
  sockStyle = 'crew', // 'crew', 'ankle', 'calf'
  badgeText,
  iconSvg
}) {
  const isAnkle = sockStyle === 'ankle';
  const isCalf = sockStyle === 'calf';
  const legHeight = isAnkle ? 120 : isCalf ? 280 : 220;
  const cuffY = 400 - legHeight;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="100%" height="100%">
  <defs>
    <!-- Background studio vignette -->
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#24211D"/>
      <stop offset="60%" stop-color="#141311"/>
      <stop offset="100%" stop-color="#0A0A09"/>
    </radialGradient>

    <!-- Luxury shadow under socks -->
    <filter id="sockShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000000" flood-opacity="0.7"/>
    </filter>

    <!-- Ribbed knit texture overlay -->
    <pattern id="knitRib" width="6" height="6" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.05)" stroke-width="1.5"/>
      <line x1="3" y1="0" x2="3" y2="6" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
    </pattern>

    <!-- Sock body gradients -->
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="35%" stop-color="${accentColor}"/>
      <stop offset="70%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="#0A0A09"/>
    </linearGradient>

    <linearGradient id="heelToeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${heelToeColor}"/>
      <stop offset="100%" stop-color="#181512"/>
    </linearGradient>
  </defs>

  <!-- Studio Background -->
  <rect width="400" height="520" fill="url(#bgGlow)"/>

  <!-- Subtle Studio Spotlight Grid / Floor Line -->
  <ellipse cx="200" cy="460" rx="140" ry="24" fill="rgba(0,0,0,0.6)" filter="blur(8px)"/>

  <!-- Main Sock Group (Left Pair angled editorial view) -->
  <g filter="url(#sockShadow)" transform="translate(18, 10)">
    <!-- Sock Body Path: Classic Leg & Foot Silhouette -->
    <!-- Leg section -->
    <path d="
      M 160 ${cuffY}
      L 225 ${cuffY}
      Q 230 ${cuffY + 40} 228 ${cuffY + legHeight - 20}
      C 230 ${cuffY + legHeight + 30} 280 380 295 400
      C 305 415 300 440 270 448
      C 220 460 180 435 155 385
      L 155 ${cuffY + 30}
      Z
    " fill="url(#bodyGrad)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

    <!-- Knit Rib texture fill -->
    <path d="
      M 160 ${cuffY}
      L 225 ${cuffY}
      Q 230 ${cuffY + 40} 228 ${cuffY + legHeight - 20}
      C 230 ${cuffY + legHeight + 30} 280 380 295 400
      C 305 415 300 440 270 448
      C 220 460 180 435 155 385
      L 155 ${cuffY + 30}
      Z
    " fill="url(#knitRib)"/>

    <!-- Ribbed Elastic Cuff -->
    <rect x="159" y="${cuffY}" width="67" height="24" rx="3" fill="${cuffStripeColor || heelToeColor}"/>
    <!-- Cuff Stripe lines -->
    <line x1="159" y1="${cuffY + 6}" x2="226" y2="${cuffY + 6}" stroke="${accentColor}" stroke-width="2"/>
    <line x1="159" y1="${cuffY + 12}" x2="226" y2="${cuffY + 12}" stroke="${primaryColor}" stroke-width="1.5"/>
    <line x1="159" y1="${cuffY + 18}" x2="226" y2="${cuffY + 18}" stroke="${accentColor}" stroke-width="2"/>

    <!-- Reinforced Heel Cap -->
    <path d="
      M 155 365
      C 150 405 180 435 210 430
      C 185 415 170 385 168 360
      Z
    " fill="url(#heelToeGrad)"/>

    <!-- Reinforced Toe Cap -->
    <path d="
      M 285 390
      C 305 405 305 435 275 448
      C 265 425 272 405 285 390
      Z
    " fill="url(#heelToeGrad)"/>

    <!-- Thematic Insignia / Artwork placement on Leg -->
    <g transform="translate(192, ${cuffY + Math.min(80, legHeight / 2)})">
      ${iconSvg}
    </g>
  </g>

  <!-- Editorial Metadata Badges in Frame -->
  <g transform="translate(24, 34)">
    <rect width="90" height="20" rx="2" fill="rgba(16,16,15,0.85)" stroke="rgba(198,167,122,0.4)" stroke-width="1"/>
    <text x="45" y="14" fill="#C6A77A" font-family="'Inter', sans-serif" font-size="8.5" font-weight="700" letter-spacing="1.5" text-anchor="middle">
      100% SOCKS
    </text>
  </g>

  <g transform="translate(376, 34)" text-anchor="end">
    <text x="0" y="14" fill="#80766B" font-family="'Inter', sans-serif" font-size="9" letter-spacing="1">
      ${sockStyle.toUpperCase()}
    </text>
  </g>

  <!-- Bottom Brand Watermark -->
  <text x="200" y="495" fill="rgba(245,240,232,0.3)" font-family="'Cormorant Garamond', Georgia, serif" font-size="13" font-style="italic" letter-spacing="3" text-anchor="middle">
    SOCKTALES ATELIER • MILANO
  </text>
</svg>`;
}

// Define the 30 sock items
const socksData = [
  // MARVEL / AVENGERS
  {
    filename: 'ironman-arc-reactor.svg',
    themeName: 'Iron Man Arc Reactor',
    primaryColor: '#7A121D', // Deep Crimson
    accentColor: '#B82230',
    heelToeColor: '#D4AF37', // Gold
    cuffStripeColor: '#D4AF37',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Arc Reactor Glowing Icon -->
      <circle cx="0" cy="0" r="22" fill="#0E161C" stroke="#D4AF37" stroke-width="2.5"/>
      <circle cx="0" cy="0" r="16" fill="none" stroke="#4FE3C1" stroke-width="2" stroke-dasharray="6,3"/>
      <circle cx="0" cy="0" r="8" fill="#58E5E5" filter="drop-shadow(0 0 6px #58E5E5)"/>
      <polygon points="0,-14 12,0 0,14 -12,0" fill="none" stroke="#D4AF37" stroke-width="1.5"/>
    `
  },
  {
    filename: 'spiderman-web-slinger.svg',
    themeName: 'Spider-Man Web Slinger',
    primaryColor: '#BA1824', // Spider Red
    accentColor: '#D42330',
    heelToeColor: '#173B6C', // Spider Blue
    cuffStripeColor: '#173B6C',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Spider Web and Emblem -->
      <circle cx="0" cy="0" r="24" fill="#0F1218" stroke="#BA1824" stroke-width="2"/>
      <line x1="-20" y1="-20" x2="20" y2="20" stroke="#E0E6ED" stroke-width="1"/>
      <line x1="20" y1="-20" x2="-20" y2="20" stroke="#E0E6ED" stroke-width="1"/>
      <line x1="0" y1="-22" x2="0" y2="22" stroke="#E0E6ED" stroke-width="1"/>
      <line x1="-22" y1="0" x2="22" y2="0" stroke="#E0E6ED" stroke-width="1"/>
      <!-- Spider Center -->
      <ellipse cx="0" cy="0" rx="4" ry="7" fill="#BA1824"/>
      <path d="M-4,-2 Q-10,-8 -14,-4 M4,-2 Q10,-8 14,-4 M-4,2 Q-12,4 -14,10 M4,2 Q12,4 14,10" stroke="#BA1824" stroke-width="1.5" fill="none"/>
    `
  },
  {
    filename: 'captain-america-shield.svg',
    themeName: 'Captain America Shield',
    primaryColor: '#122E58', // Patriotic Navy
    accentColor: '#1D4582',
    heelToeColor: '#B51B25', // Shield Red
    cuffStripeColor: '#E2E6EA',
    sockStyle: 'ankle',
    iconSvg: `
      <!-- Vibranium Shield -->
      <circle cx="0" cy="0" r="22" fill="#B51B25"/>
      <circle cx="0" cy="0" r="17" fill="#E2E6EA"/>
      <circle cx="0" cy="0" r="12" fill="#B51B25"/>
      <circle cx="0" cy="0" r="7" fill="#122E58"/>
      <!-- Star -->
      <polygon points="0,-6 1.8,-1.8 6.4,-1.8 2.7,0.9 4.1,5.4 0,2.7 -4.1,5.4 -2.7,0.9 -6.4,-1.8 -1.8,-1.8" fill="#E2E6EA"/>
    `
  },
  {
    filename: 'thor-mjolnir-thunder.svg',
    themeName: 'Thor Mjolnir Thunder',
    primaryColor: '#282C34', // Asgard Slate
    accentColor: '#3B414D',
    heelToeColor: '#707A8A', // Silver
    cuffStripeColor: '#D4AF37', // Gold
    sockStyle: 'calf',
    iconSvg: `
      <!-- Mjolnir Hammer & Lightning -->
      <rect x="-12" y="-14" width="24" height="15" rx="2" fill="#8892A2" stroke="#D4AF37" stroke-width="1.5"/>
      <rect x="-3" y="1" width="6" height="20" rx="1" fill="#4B3322"/>
      <path d="M-18,-8 L-8,4 L-14,8 L-4,20" stroke="#68C7F0" stroke-width="2" fill="none" filter="drop-shadow(0 0 4px #68C7F0)"/>
      <path d="M18,-8 L8,4 L14,8 L4,20" stroke="#68C7F0" stroke-width="2" fill="none" filter="drop-shadow(0 0 4px #68C7F0)"/>
    `
  },
  {
    filename: 'hulk-gamma-smash.svg',
    themeName: 'Hulk Gamma Smash',
    primaryColor: '#1F5426', // Gamma Green
    accentColor: '#2D7537',
    heelToeColor: '#4A1D6B', // Gamma Purple
    cuffStripeColor: '#4A1D6B',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Gamma Radiation & Fist Silhouette -->
      <circle cx="0" cy="0" r="22" fill="#141311" stroke="#37A846" stroke-width="2"/>
      <!-- Radiation blades -->
      <path d="M0,0 L-7,-18 A20,20 0 0,1 7,-18 Z" fill="#37A846"/>
      <path d="M0,0 L18,3 A20,20 0 0,1 11,15 Z" fill="#37A846"/>
      <path d="M0,0 L-11,15 A20,20 0 0,1 -18,3 Z" fill="#37A846"/>
      <circle cx="0" cy="0" r="6" fill="#141311" stroke="#4A1D6B" stroke-width="2"/>
    `
  },

  // HARRY POTTER
  {
    filename: 'gryffindor-scarlet-gold.svg',
    themeName: 'Gryffindor Scarlet & Gold',
    primaryColor: '#6B121A', // Scarlet
    accentColor: '#8C1923',
    heelToeColor: '#C99726', // Lion Gold
    cuffStripeColor: '#C99726',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Gryffindor Lion Crest Shield -->
      <path d="M-15,-20 L15,-20 L15,4 C15,16 0,24 0,24 C0,24 -15,16 -15,4 Z" fill="#181512" stroke="#C99726" stroke-width="2"/>
      <text x="0" y="2" fill="#C99726" font-family="'Cormorant Garamond', serif" font-weight="bold" font-size="16" text-anchor="middle">G</text>
      <path d="M-8,-14 L8,-14 M-6,-11 L6,-11" stroke="#C99726" stroke-width="1"/>
    `
  },
  {
    filename: 'slytherin-emerald-silver.svg',
    themeName: 'Slytherin Emerald & Silver',
    primaryColor: '#0E3B24', // Emerald
    accentColor: '#175937',
    heelToeColor: '#8E9AA4', // Silver
    cuffStripeColor: '#8E9AA4',
    sockStyle: 'calf',
    iconSvg: `
      <!-- Slytherin Serpent Shield -->
      <path d="M-15,-20 L15,-20 L15,4 C15,16 0,24 0,24 C0,24 -15,16 -15,4 Z" fill="#181512" stroke="#8E9AA4" stroke-width="2"/>
      <path d="M-6,-12 C2,-16 6,-8 -2,-4 C-8,0 4,8 0,14" fill="none" stroke="#8E9AA4" stroke-width="2.5" stroke-linecap="round"/>
      <text x="0" y="2" fill="#8E9AA4" font-family="'Cormorant Garamond', serif" font-size="14" text-anchor="middle">S</text>
    `
  },
  {
    filename: 'ravenclaw-midnight-bronze.svg',
    themeName: 'Ravenclaw Midnight & Bronze',
    primaryColor: '#0F2648', // Sapphire
    accentColor: '#183B6E',
    heelToeColor: '#9E6B38', // Bronze
    cuffStripeColor: '#9E6B38',
    sockStyle: 'ankle',
    iconSvg: `
      <!-- Ravenclaw Eagle Diadem -->
      <path d="M-15,-20 L15,-20 L15,4 C15,16 0,24 0,24 C0,24 -15,16 -15,4 Z" fill="#181512" stroke="#9E6B38" stroke-width="2"/>
      <text x="0" y="2" fill="#9E6B38" font-family="'Cormorant Garamond', serif" font-weight="bold" font-size="16" text-anchor="middle">R</text>
      <!-- Raven Wings -->
      <path d="M-10,8 Q0,2 10,8" stroke="#9E6B38" stroke-width="1.5" fill="none"/>
    `
  },
  {
    filename: 'hufflepuff-canary-charcoal.svg',
    themeName: 'Hufflepuff Canary & Charcoal',
    primaryColor: '#302D29', // Charcoal
    accentColor: '#45403B',
    heelToeColor: '#E0A922', // Canary Yellow
    cuffStripeColor: '#E0A922',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Hufflepuff Badger Shield -->
      <path d="M-15,-20 L15,-20 L15,4 C15,16 0,24 0,24 C0,24 -15,16 -15,4 Z" fill="#181512" stroke="#E0A922" stroke-width="2"/>
      <text x="0" y="2" fill="#E0A922" font-family="'Cormorant Garamond', serif" font-weight="bold" font-size="16" text-anchor="middle">H</text>
      <line x1="-8" y1="10" x2="8" y2="10" stroke="#E0A922" stroke-width="1.5"/>
    `
  },
  {
    filename: 'marauders-lumos-spells.svg',
    themeName: 'Hogwarts Spells Lumos',
    primaryColor: '#141416', // Magic Obsidian
    accentColor: '#242429',
    heelToeColor: '#C6A77A', // Gold Lurex
    cuffStripeColor: '#C6A77A',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Deathly Hallows & Wand -->
      <polygon points="0,-18 16,14 -16,14" fill="none" stroke="#C6A77A" stroke-width="2"/>
      <circle cx="0" cy="4" r="9" fill="none" stroke="#C6A77A" stroke-width="2"/>
      <line x1="0" y1="-20" x2="0" y2="15" stroke="#C6A77A" stroke-width="2"/>
      <!-- Sparkles -->
      <circle cx="-12" cy="-8" r="1.5" fill="#E8D5B5"/>
      <circle cx="12" cy="-8" r="1.5" fill="#E8D5B5"/>
    `
  },

  // STRANGER THINGS
  {
    filename: 'stranger-hellfire-club.svg',
    themeName: 'Hellfire Club Hawkins',
    primaryColor: '#ECE4D4', // Vintage Cream
    accentColor: '#FFFFFF',
    heelToeColor: '#8C1820', // Crimson
    cuffStripeColor: '#8C1820',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Hellfire Horned Devil Face & D20 -->
      <circle cx="0" cy="0" r="22" fill="#1C1816" stroke="#8C1820" stroke-width="2"/>
      <!-- Horns -->
      <path d="M-10,-6 Q-18,-18 -12,-20 Q-6,-14 -6,-4" fill="#8C1820"/>
      <path d="M10,-6 Q18,-18 12,-20 Q6,-14 6,-4" fill="#8C1820"/>
      <!-- Devil Face / Text -->
      <text x="0" y="4" fill="#8C1820" font-family="'Inter', sans-serif" font-weight="900" font-size="10" text-anchor="middle">HELLFIRE</text>
      <text x="0" y="14" fill="#D4AF37" font-family="'Inter', sans-serif" font-weight="bold" font-size="7" letter-spacing="1" text-anchor="middle">CLUB</text>
    `
  },
  {
    filename: 'stranger-upside-down.svg',
    themeName: 'The Upside Down',
    primaryColor: '#121214', // Shadow Black
    accentColor: '#201A24',
    heelToeColor: '#781926', // Spore Red
    cuffStripeColor: '#781926',
    sockStyle: 'calf',
    iconSvg: `
      <!-- Floating Spores & Dark Rift Vines -->
      <circle cx="0" cy="0" r="22" fill="#0C0A0D" stroke="#781926" stroke-width="2"/>
      <path d="M-12,16 Q-4,0 -10,-14 M12,16 Q4,0 10,-14 M0,18 Q-2,-2 0,-16" stroke="#781926" stroke-width="2" fill="none"/>
      <!-- Glowing Red Spores -->
      <circle cx="-6" cy="-6" r="2" fill="#E83040" filter="drop-shadow(0 0 4px #E83040)"/>
      <circle cx="7" cy="4" r="2" fill="#E83040" filter="drop-shadow(0 0 4px #E83040)"/>
      <circle cx="2" cy="-12" r="1.5" fill="#E83040"/>
    `
  },
  {
    filename: 'stranger-hawkins-1983.svg',
    themeName: 'Hawkins 1983 Retro',
    primaryColor: '#D89828', // 80s Mustard
    accentColor: '#E2A838',
    heelToeColor: '#1B5B66', // Vintage Teal
    cuffStripeColor: '#1B5B66',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Retro 80s Hawkins Tiger Emblem -->
      <rect x="-18" y="-12" width="36" height="24" rx="2" fill="#14181B" stroke="#1B5B66" stroke-width="2"/>
      <text x="0" y="-1" fill="#E2A838" font-family="'Inter', sans-serif" font-weight="900" font-size="8" letter-spacing="1" text-anchor="middle">HAWKINS</text>
      <text x="0" y="8" fill="#FFFFFF" font-family="'Inter', sans-serif" font-weight="bold" font-size="7" text-anchor="middle">1983</text>
    `
  },

  // GHOSTBUSTERS
  {
    filename: 'ghostbusters-slimer-ectoplasm.svg',
    themeName: 'Slimer Ectoplasm Drip',
    primaryColor: '#101010', // Obsidian
    accentColor: '#181A18',
    heelToeColor: '#39D33A', // Ecto Green
    cuffStripeColor: '#39D33A',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Radioactive Neon Slime Drips -->
      <circle cx="0" cy="0" r="22" fill="#0C140D" stroke="#39D33A" stroke-width="2"/>
      <!-- Slime Splatter -->
      <path d="M-14,-8 Q-4,-14 0,-6 Q6,-16 14,-8 Q18,6 10,12 Q-2,18 -10,10 Z" fill="#39D33A" filter="drop-shadow(0 0 5px #39D33A)"/>
      <ellipse cx="-4" cy="-2" rx="2" ry="3" fill="#101010"/>
      <ellipse cx="4" cy="-2" rx="2" ry="3" fill="#101010"/>
      <path d="M-6,4 Q0,10 6,4" stroke="#101010" stroke-width="1.5" fill="none"/>
    `
  },
  {
    filename: 'ghostbusters-proton-pack.svg',
    themeName: 'Ghostbusters No-Ghost',
    primaryColor: '#8C7756', // Jumpsuit Khaki
    accentColor: '#A38B65',
    heelToeColor: '#BA1E1E', // Hazard Red
    cuffStripeColor: '#BA1E1E',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Iconic Crossed-out Ghost Logo -->
      <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#BA1E1E" stroke-width="4"/>
      <!-- White Ghost -->
      <ellipse cx="-2" cy="0" rx="9" ry="11" fill="#FFFFFF"/>
      <circle cx="-5" cy="-3" r="2" fill="#101010"/>
      <circle cx="1" cy="-3" r="2" fill="#101010"/>
      <!-- Red Slash Line -->
      <line x1="-16" y1="-16" x2="16" y2="16" stroke="#BA1E1E" stroke-width="4"/>
    `
  },

  // DISNEY CHARACTERS
  {
    filename: 'disney-mickey-heritage.svg',
    themeName: 'Mickey Mouse Heritage Polka',
    primaryColor: '#121214', // Tuxedo Black
    accentColor: '#1E1E22',
    heelToeColor: '#B81D24', // Mickey Red
    cuffStripeColor: '#E29E20', // Mickey Yellow
    sockStyle: 'crew',
    iconSvg: `
      <!-- Classic 3-Circle Mickey Ears Silhouette -->
      <circle cx="0" cy="4" r="14" fill="#B81D24"/>
      <circle cx="-12" cy="-10" r="8" fill="#121214" stroke="#B81D24" stroke-width="1.5"/>
      <circle cx="12" cy="-10" r="8" fill="#121214" stroke="#B81D24" stroke-width="1.5"/>
      <!-- Polka Dots -->
      <circle cx="-4" cy="6" r="2.5" fill="#FFFFFF"/>
      <circle cx="4" cy="6" r="2.5" fill="#FFFFFF"/>
    `
  },
  {
    filename: 'disney-minnie-bow.svg',
    themeName: 'Minnie Mouse Pastel Bow',
    primaryColor: '#4A222B', // Rose Wine
    accentColor: '#632F3A',
    heelToeColor: '#D9899C', // Soft Rose
    cuffStripeColor: '#D9899C',
    sockStyle: 'ankle',
    iconSvg: `
      <!-- Minnie Bow & Ears -->
      <circle cx="-11" cy="-4" r="8" fill="#181416"/>
      <circle cx="11" cy="-4" r="8" fill="#181416"/>
      <!-- Bow -->
      <path d="M0,-2 L-10,-12 L-8,6 Z" fill="#D9899C"/>
      <path d="M0,-2 L10,-12 L8,6 Z" fill="#D9899C"/>
      <circle cx="0" cy="-2" r="4" fill="#F0C2CD"/>
      <circle cx="-5" cy="-5" r="1.2" fill="#FFFFFF"/>
      <circle cx="5" cy="-5" r="1.2" fill="#FFFFFF"/>
    `
  },
  {
    filename: 'disney-donald-nautical.svg',
    themeName: 'Donald Duck Nautical',
    primaryColor: '#143160', // Sailor Navy
    accentColor: '#1C4280',
    heelToeColor: '#E2A418', // Duckling Yellow
    cuffStripeColor: '#B81D24', // Bow Red
    sockStyle: 'ankle',
    iconSvg: `
      <!-- Donald Sailor Cap & Ribbon -->
      <ellipse cx="0" cy="6" rx="14" ry="8" fill="#E2A418"/>
      <ellipse cx="0" cy="-4" rx="12" ry="6" fill="#FFFFFF"/>
      <rect x="-4" y="-12" width="8" height="8" fill="#143160"/>
      <path d="M-6,10 L0,6 L6,10 L0,12 Z" fill="#B81D24"/>
    `
  },
  {
    filename: 'disney-stitch-experiment.svg',
    themeName: 'Stitch Experiment 626',
    primaryColor: '#184F8C', // Stitch Electric Blue
    accentColor: '#246CB8',
    heelToeColor: '#74B2E8', // Cyan
    cuffStripeColor: '#1C2945', // Indigo
    sockStyle: 'crew',
    iconSvg: `
      <!-- Stitch Ears & Face Outline -->
      <circle cx="0" cy="4" r="14" fill="#184F8C" stroke="#74B2E8" stroke-width="2"/>
      <!-- Huge Alien Ears -->
      <path d="M-12,0 C-24,-16 -18,-24 -8,-8 Z" fill="#74B2E8"/>
      <path d="M12,0 C24,-16 18,-24 8,-8 Z" fill="#74B2E8"/>
      <!-- Eyes & Nose -->
      <ellipse cx="-5" cy="2" rx="3" ry="4" fill="#101010"/>
      <ellipse cx="5" cy="2" rx="3" ry="4" fill="#101010"/>
      <ellipse cx="0" cy="7" rx="3" ry="2" fill="#3877BA"/>
    `
  },
  {
    filename: 'disney-pooh-honeycomb.svg',
    themeName: 'Winnie the Pooh Honeycomb',
    primaryColor: '#C48C20', // Honey Gold
    accentColor: '#DDA028',
    heelToeColor: '#8C1820', // Pooh Red Shirt Accent
    cuffStripeColor: '#8C1820',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Honey Pot & Honey Bee -->
      <ellipse cx="0" cy="4" rx="14" ry="12" fill="#8C501C"/>
      <rect x="-10" y="-8" width="20" height="6" rx="2" fill="#A86224"/>
      <text x="0" y="7" fill="#FAD02C" font-family="'Cormorant Garamond', serif" font-weight="bold" font-size="9" text-anchor="middle">HUNNY</text>
      <!-- Tiny Bee -->
      <circle cx="12" cy="-10" r="3" fill="#FAD02C"/>
      <line x1="10" y1="-10" x2="14" y2="-10" stroke="#101010" stroke-width="1"/>
    `
  },

  // CINEMATIC & LUXURY CLASSICS
  {
    filename: 'matrix-cyber-rain.svg',
    themeName: 'The Cyber Rain Matrix',
    primaryColor: '#0C120D', // Jet Black
    accentColor: '#121F14',
    heelToeColor: '#00E868', // Matrix Green
    cuffStripeColor: '#00E868',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Matrix Digital Rain Glyphs -->
      <rect x="-18" y="-18" width="36" height="36" rx="2" fill="#0A0F0A" stroke="#00E868" stroke-width="1"/>
      <text x="-10" y="-6" fill="#00E868" font-family="monospace" font-size="8">0 1</text>
      <text x="-10" y="4" fill="#75FFAE" font-family="monospace" font-size="8">1 0</text>
      <text x="-10" y="14" fill="#00E868" font-family="monospace" font-size="8">0 1</text>
      <text x="2" y="-6" fill="#75FFAE" font-family="monospace" font-size="8">X 9</text>
      <text x="2" y="4" fill="#00E868" font-family="monospace" font-size="8">7 Z</text>
      <text x="2" y="14" fill="#A3FFC7" font-family="monospace" font-size="8">2 4</text>
    `
  },
  {
    filename: 'interstellar-event-horizon.svg',
    themeName: 'Interstellar Event Horizon',
    primaryColor: '#0B132B', // Deep Cosmos
    accentColor: '#1C2541',
    heelToeColor: '#C6A77A', // Starlight Gold
    cuffStripeColor: '#C6A77A',
    sockStyle: 'calf',
    iconSvg: `
      <!-- Gravitational Waves & Black Hole Lens -->
      <ellipse cx="0" cy="0" rx="22" ry="7" fill="none" stroke="#C6A77A" stroke-width="2" transform="rotate(-25)"/>
      <circle cx="0" cy="0" r="11" fill="#060913" stroke="#F5F0E8" stroke-width="1.5"/>
      <ellipse cx="0" cy="0" rx="18" ry="14" fill="none" stroke="rgba(198,167,122,0.5)" stroke-width="1"/>
    `
  },
  {
    filename: 'godfather-don-pinstripe.svg',
    themeName: 'The Don Pinstripe Silk',
    primaryColor: '#1C1A19', // Charcoal Pinstripe
    accentColor: '#282523',
    heelToeColor: '#8C121A', // Rose Crimson
    cuffStripeColor: '#8C121A',
    sockStyle: 'calf',
    iconSvg: `
      <!-- Pinstripes & Ankle Crimson Rose -->
      <line x1="-14" y1="-18" x2="-14" y2="18" stroke="rgba(245,240,232,0.25)" stroke-width="1"/>
      <line x1="0" y1="-18" x2="0" y2="18" stroke="rgba(245,240,232,0.25)" stroke-width="1"/>
      <line x1="14" y1="-18" x2="14" y2="18" stroke="rgba(245,240,232,0.25)" stroke-width="1"/>
      <!-- Rose -->
      <circle cx="0" cy="0" r="8" fill="#8C121A" stroke="#C6A77A" stroke-width="1"/>
      <circle cx="0" cy="0" r="4" fill="#B51A24"/>
    `
  },
  {
    filename: 'inception-totem-spiral.svg',
    themeName: 'Inception Totem Spiral',
    primaryColor: '#1A1816', // Architect Onyx
    accentColor: '#2B2724',
    heelToeColor: '#9E7D52', // Bronze
    cuffStripeColor: '#9E7D52',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Spinning Top Totem -->
      <path d="M0,-16 L8,-2 L4,8 L0,16 L-4,8 L-8,-2 Z" fill="#9E7D52" stroke="#E0C6A0" stroke-width="1"/>
      <ellipse cx="0" cy="-2" rx="14" ry="4" fill="none" stroke="#E0C6A0" stroke-width="1.5"/>
    `
  },
  {
    filename: 'dark-gothic-nocturne.svg',
    themeName: 'Gothic Nocturne Filigree',
    primaryColor: '#121110', // Obsidian
    accentColor: '#1E1C1A',
    heelToeColor: '#6B583E', // Antique Brass
    cuffStripeColor: '#6B583E',
    sockStyle: 'crew',
    iconSvg: `
      <!-- Victorian Damask Lace -->
      <circle cx="0" cy="0" r="18" fill="none" stroke="#6B583E" stroke-width="1.5"/>
      <path d="M0,-14 C-8,-6 -6,8 0,14 C6,8 8,-6 0,-14" fill="none" stroke="#C6A77A" stroke-width="1.5"/>
      <path d="M-14,0 C-6,-8 8,-6 14,0 C8,6 -6,8 -14,0" fill="none" stroke="#C6A77A" stroke-width="1"/>
    `
  },
  {
    filename: 'dark-ravenwood-shadow.svg',
    themeName: 'Ravenwood Shadow Ribbed',
    primaryColor: '#161514', // Raven Black
    accentColor: '#262422',
    heelToeColor: '#3B3835', // Charcoal
    cuffStripeColor: '#3B3835',
    sockStyle: 'calf',
    iconSvg: `
      <!-- Raven Feather Chevron -->
      <path d="M0,-16 L12,-4 L0,4 L-12,-4 Z M0,-4 L12,8 L0,16 L-12,8 Z" fill="none" stroke="#B8AA9A" stroke-width="1.5"/>
    `
  },
  {
    filename: 'formal-sovereign-herringbone.svg',
    themeName: 'Sovereign Herringbone Formal',
    primaryColor: '#0E1624', // Midnight Navy
    accentColor: '#172338',
    heelToeColor: '#2A3C59', // Lisle Blue
    cuffStripeColor: '#C6A77A', // Gold
    sockStyle: 'calf',
    iconSvg: `
      <!-- Scottish Lisle Micro-Herringbone -->
      <path d="M-12,-14 L0,-6 L12,-14 M-12,-6 L0,2 L12,-6 M-12,2 L0,10 L12,2 M-12,10 L0,18 L12,10" fill="none" stroke="#C6A77A" stroke-width="1.8"/>
    `
  },
  {
    filename: 'formal-diplomat-cashmere.svg',
    themeName: 'Diplomat Cashmere Touch',
    primaryColor: '#36312B', // Bespoke Taupe
    accentColor: '#4A433B',
    heelToeColor: '#1C1916', // Bespoke Black
    cuffStripeColor: '#C6A77A',
    sockStyle: 'calf',
    iconSvg: `
      <!-- Cashmere Royal Tailoring Crest -->
      <circle cx="0" cy="0" r="16" fill="none" stroke="#C6A77A" stroke-width="1.5"/>
      <line x1="-8" y1="-8" x2="8" y2="8" stroke="#C6A77A" stroke-width="1"/>
      <line x1="8" y1="-8" x2="-8" y2="8" stroke="#C6A77A" stroke-width="1"/>
      <circle cx="0" cy="0" r="4" fill="#C6A77A"/>
    `
  },
  {
    filename: 'casual-wanderlust-terry.svg',
    themeName: 'Wanderlust Cloud Terry',
    primaryColor: '#423D36', // Oatmeal Heather
    accentColor: '#59534B',
    heelToeColor: '#1E1C1A', // Dark Contrast
    cuffStripeColor: '#D89828',
    sockStyle: 'ankle',
    iconSvg: `
      <!-- Cloud Terry Mountain Compass -->
      <polygon points="0,-14 4,-3 14,0 4,3 0,14 -4,3 -14,0 -4,-3" fill="#D8B98C"/>
      <circle cx="0" cy="0" r="3" fill="#1E1C1A"/>
    `
  },
  {
    filename: 'casual-chromatic-spectrum.svg',
    themeName: 'Chromatic Spectrum Colourblock',
    primaryColor: '#7A3525', // Terracotta
    accentColor: '#A84C38',
    heelToeColor: '#D4A017', // Mustard Gold
    cuffStripeColor: '#183652', // Deep Navy
    sockStyle: 'crew',
    iconSvg: `
      <!-- Colourblock Geometric Panels -->
      <rect x="-14" y="-14" width="13" height="13" fill="#D4A017"/>
      <rect x="1" y="-14" width="13" height="13" fill="#183652"/>
      <rect x="-14" y="1" width="13" height="13" fill="#1E5C38"/>
      <rect x="1" y="1" width="13" height="13" fill="#F5F0E8"/>
    `
  }
];

// Write all sock svgs
for (const item of socksData) {
  const svgContent = createSockSvg(item);
  fs.writeFileSync(path.join(outputDir, item.filename), svgContent, 'utf-8');
  console.log(`Generated sock SVG: ${item.filename}`);
}

// Also generate editorial Hero and Storytelling banners showcasing socks
const heroSockBannerSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
  <defs>
    <radialGradient id="heroGlow" cx="45%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#26221D"/>
      <stop offset="55%" stop-color="#121110"/>
      <stop offset="100%" stop-color="#080807"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#heroGlow)"/>

  <!-- Atelier Studio Lighting Lines -->
  <line x1="0" y1="620" x2="1600" y2="620" stroke="rgba(198,167,122,0.15)" stroke-width="1"/>
  <ellipse cx="960" cy="650" rx="420" ry="60" fill="rgba(0,0,0,0.6)" filter="blur(16px)"/>

  <!-- Left Artistic Sock Pair (Pop Culture & Cinematic Edition) -->
  <g transform="translate(820, 220) scale(1.15)">
    <!-- Sock 1: Marvel Crimson & Gold -->
    <path d="M 60 40 L 125 40 Q 130 180 128 220 C 130 260 180 300 195 320 C 205 335 200 355 170 365 C 120 375 75 350 55 305 L 55 60 Z" fill="#7A121D" stroke="#C6A77A" stroke-width="2"/>
    <rect x="59" y="40" width="67" height="24" rx="2" fill="#D4AF37"/>
    <!-- Arc Reactor -->
    <circle cx="92" cy="120" r="14" fill="#0C141A" stroke="#D4AF37" stroke-width="2"/>
    <circle cx="92" cy="120" r="6" fill="#4FE3C1" filter="url(#glow)"/>
  </g>

  <!-- Sock 2: Matrix Green & Jet Black -->
  <g transform="translate(1020, 180) scale(1.2)">
    <path d="M 60 40 L 125 40 Q 130 180 128 220 C 130 260 180 300 195 320 C 205 335 200 355 170 365 C 120 375 75 350 55 305 L 55 60 Z" fill="#0C120D" stroke="#00E868" stroke-width="2"/>
    <rect x="59" y="40" width="67" height="24" rx="2" fill="#00E868"/>
    <!-- Matrix Glyphs -->
    <text x="92" y="120" fill="#00E868" font-family="monospace" font-size="12" text-anchor="middle">1 0 1</text>
    <text x="92" y="140" fill="#75FFAE" font-family="monospace" font-size="10" text-anchor="middle">X 9 Z</text>
  </g>

  <!-- Sock 3: Harry Potter Gryffindor Scarlet & Gold -->
  <g transform="translate(680, 260) scale(1.1)">
    <path d="M 60 40 L 125 40 Q 130 180 128 220 C 130 260 180 300 195 320 C 205 335 200 355 170 365 C 120 375 75 350 55 305 L 55 60 Z" fill="#6B121A" stroke="#D4AF37" stroke-width="1.5"/>
    <rect x="59" y="40" width="67" height="20" rx="2" fill="#D4AF37"/>
    <path d="M 82 110 L 102 110 L 102 126 C 102 134 92 140 92 140 C 92 140 82 134 82 126 Z" fill="#181512" stroke="#D4AF37" stroke-width="1.5"/>
    <text x="92" y="126" fill="#D4AF37" font-family="serif" font-size="11" text-anchor="middle">G</text>
  </g>

  <!-- Editorial Typography Watermarks -->
  <text x="140" y="800" fill="rgba(198,167,122,0.4)" font-family="'Inter', sans-serif" font-size="14" letter-spacing="4">
    HAUTE FOOTWEAR • EXCLUSIVE POP CULTURE &amp; CINEMATIC SOCKS
  </text>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'hero-socks-banner.svg'), heroSockBannerSvg, 'utf-8');
console.log('Generated hero-socks-banner.svg');

// Collection category banners
const collectionsBanners = [
  { file: 'collection-movie.svg', title: 'MOVIE & POP CULTURE SERIES', color: '#B82230' },
  { file: 'collection-marvel.svg', title: 'MARVEL AVENGERS SOCKS', color: '#D4AF37' },
  { file: 'collection-potter.svg', title: 'HARRY POTTER HOGWARTS SOCKS', color: '#6B121A' },
  { file: 'collection-stranger.svg', title: 'STRANGER THINGS SOCKS', color: '#8C1820' },
  { file: 'collection-ghostbusters.svg', title: 'GHOSTBUSTERS SLIME SOCKS', color: '#39D33A' },
  { file: 'collection-disney.svg', title: 'DISNEY CHARACTERS SOCKS', color: '#184F8C' },
  { file: 'collection-dark.svg', title: 'DARK STORIES NOCTURNE', color: '#36312D' },
  { file: 'collection-formal.svg', title: 'FORMAL MERCERIZED LISLE', color: '#172338' },
  { file: 'collection-casual.svg', title: 'EVERYDAY CLOUD TERRY', color: '#7A3525' }
];

for (const c of collectionsBanners) {
  const cSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="bannerGlow_${c.file.replace('.svg','')}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#221F1B"/>
      <stop offset="60%" stop-color="#121110"/>
      <stop offset="100%" stop-color="#080807"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="600" fill="url(#bannerGlow_${c.file.replace('.svg','')})"/>
  <!-- Pair of socks silhouette in center -->
  <g transform="translate(730, 80) scale(0.9)">
    <path d="M 60 40 L 125 40 Q 130 180 128 220 C 130 260 180 300 195 320 C 205 335 200 355 170 365 C 120 375 75 350 55 305 L 55 60 Z" fill="${c.color}" stroke="#C6A77A" stroke-width="2"/>
    <rect x="59" y="40" width="67" height="24" rx="2" fill="#C6A77A"/>
  </g>
  <text x="800" y="520" fill="#C6A77A" font-family="'Cormorant Garamond', serif" font-size="28" letter-spacing="6" text-anchor="middle">${c.title}</text>
  <text x="800" y="555" fill="#80766B" font-family="'Inter', sans-serif" font-size="12" letter-spacing="3" text-anchor="middle">100% COMBED COTTON SOCKS ONLY</text>
</svg>`;
  fs.writeFileSync(path.join(outputDir, c.file), cSvg, 'utf-8');
  console.log(`Generated collection banner: ${c.file}`);
}

console.log('All sock SVG assets generated successfully!');
