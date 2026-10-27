const { connectDb, closeDb, getDb } = require('../config/db');
const { hashPassword } = require('../utils/crypto');

const categories = [
  {
    name: 'Movie-Inspired',
    slug: 'movie-inspired',
    description: 'Cinematic masterpieces honoring timeless films, superhero epics, magical universes, and pop culture icons.',
    image: '/images/socks/collection-movie.svg',
    banner: '/images/socks/collection-movie.svg'
  },
  {
    name: 'Marvel / Avengers',
    slug: 'marvel-avengers',
    description: 'Earth’s mightiest luxury footwear honoring Iron Man, Spider-Man, Captain America, Thor, and the Hulk.',
    image: '/images/socks/collection-marvel.svg',
    banner: '/images/socks/collection-marvel.svg'
  },
  {
    name: 'Harry Potter',
    slug: 'harry-potter',
    description: 'Authentic Hogwarts house crests and spellbound jacquards for Gryffindor, Slytherin, Ravenclaw, and Hufflepuff.',
    image: '/images/socks/collection-potter.svg',
    banner: '/images/socks/collection-potter.svg'
  },
  {
    name: 'Stranger Things',
    slug: 'stranger-things',
    description: 'Retro 80s Hawkins athletics, the Hellfire Club, and dark atmospheric weaves from the Upside Down.',
    image: '/images/socks/collection-stranger.svg',
    banner: '/images/socks/collection-stranger.svg'
  },
  {
    name: 'Ghostbusters',
    slug: 'ghostbusters',
    description: 'Iconic No-Ghost crossed crests, proton pack caution stripes, and luminous Slimer ectoplasm drips.',
    image: '/images/socks/collection-ghostbusters.svg',
    banner: '/images/socks/collection-ghostbusters.svg'
  },
  {
    name: 'Disney Characters',
    slug: 'disney-characters',
    description: 'Beloved Disney magic woven in luxury combed cotton featuring Mickey, Minnie, Donald, Stitch, and Winnie the Pooh.',
    image: '/images/socks/collection-disney.svg',
    banner: '/images/socks/collection-disney.svg'
  },
  {
    name: 'Dark Stories',
    slug: 'dark-stories',
    description: 'Gothic tapestries, mysterious silhouettes, and dark fantasy weaves for the bold nocturnal soul.',
    image: '/images/socks/collection-dark.svg',
    banner: '/images/socks/collection-dark.svg'
  },
  {
    name: 'Formal',
    slug: 'formal',
    description: 'Exquisite double-mercerized Scottish Lisle cotton, pinstripes, and cashmere touch for gala and boardroom elegance.',
    image: '/images/socks/collection-formal.svg',
    banner: '/images/socks/collection-formal.svg'
  },
  {
    name: 'Everyday & Casual',
    slug: 'everyday-casual',
    description: 'Vibrant, breathable cloud-terry and geometric colourblock combed cotton socks for effortless daily leisure.',
    image: '/images/socks/collection-casual.svg',
    banner: '/images/socks/collection-casual.svg'
  }
];

const products = [
  // ==========================================
  // 1. MARVEL / AVENGERS (MANDATORY)
  // ==========================================
  {
    name: 'Iron Man Arc Reactor Metallic Crew',
    slug: 'ironman-arc-reactor-crew',
    collection: 'Movie-Inspired',
    franchise: 'Marvel / Avengers',
    movieReference: 'Marvel: Iron Man / Avengers',
    description: 'Deep crimson organic combed cotton featuring a glowing golden Arc Reactor geometric emblem on the ribbed cuff. Reinforced with double-knit heel and seamless hand-linked toe.',
    price: 499,
    originalPrice: 699,
    discountBadge: '29% OFF',
    categories: ['movie-inspired', 'marvel-avengers', 'crew', 'themed'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Crimson Red', 'Metallic Gold'],
    stock: 50,
    material: '82% Combed Organic Cotton, 15% Polyamide, 3% Lurex',
    rating: 4.96,
    reviewsCount: 124,
    isFeatured: true,
    active: true,
    images: ['/images/socks/ironman-arc-reactor.svg']
  },
  {
    name: 'Spider-Man Web-Slinger Ribbed Crew',
    slug: 'spiderman-web-slinger-crew',
    collection: 'Movie-Inspired',
    franchise: 'Marvel / Avengers',
    movieReference: 'Marvel: Spider-Man',
    description: 'Vibrant Peter Parker red and Queens blue knit with precision spider-web geometry. Features dynamic arch compression band and anti-slip ribbed leg structure.',
    price: 449,
    originalPrice: 599,
    discountBadge: '25% OFF',
    categories: ['movie-inspired', 'marvel-avengers', 'crew', 'casual'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Classic Red', 'Queens Blue'],
    stock: 65,
    material: '80% Combed Cotton, 17% Polyamide, 3% Elastane',
    rating: 4.98,
    reviewsCount: 156,
    isFeatured: true,
    active: true,
    images: ['/images/socks/spiderman-web-slinger.svg']
  },
  {
    name: 'Captain America Vibranium Shield Ankle',
    slug: 'captain-america-shield-ankle',
    collection: 'Movie-Inspired',
    franchise: 'Marvel / Avengers',
    movieReference: 'Marvel: Captain America',
    description: 'Ultra-cushioned low-cut ankle sock in patriotic navy with circular vibranium star shield crest. Breathable mesh top panel keeps feet cool during all-day missions.',
    price: 399,
    originalPrice: 499,
    discountBadge: '20% OFF',
    categories: ['movie-inspired', 'marvel-avengers', 'ankle', 'comfort'],
    sizes: ['S', 'M', 'L'],
    colors: ['Star Blue', 'Patriot Red'],
    stock: 45,
    material: '85% Ringspun Cotton, 12% Polyester, 3% Spandex',
    rating: 4.91,
    reviewsCount: 88,
    isFeatured: false,
    active: true,
    images: ['/images/socks/captain-america-shield.svg']
  },
  {
    name: 'Thor Mjolnir Thunder Stripe Mid-Calf',
    slug: 'thor-mjolnir-thunder-calf',
    collection: 'Movie-Inspired',
    franchise: 'Marvel / Avengers',
    movieReference: 'Marvel: Thor / Avengers',
    description: 'Forged in Asgardian slate grey with silver metallic lightning zigzags and the iconic Mjolnir hammer insignia. Heavyweight gauge knit offering divine cushion and warmth.',
    price: 549,
    originalPrice: 749,
    discountBadge: '27% OFF',
    categories: ['movie-inspired', 'marvel-avengers', 'knee-high', 'calf', 'themed'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Asgard Slate', 'Lightning Silver'],
    stock: 35,
    material: '78% Mercerized Cotton, 19% Nylon, 3% Spandex',
    rating: 4.94,
    reviewsCount: 92,
    isFeatured: true,
    active: true,
    images: ['/images/socks/thor-mjolnir-thunder.svg']
  },
  {
    name: 'Hulk Gamma Smash Heavyweight Crew',
    slug: 'hulk-gamma-smash-crew',
    collection: 'Movie-Inspired',
    franchise: 'Marvel / Avengers',
    movieReference: 'Marvel: The Incredible Hulk',
    description: 'Maximum-strength reinforced cushioned crew in radioactive gamma green paired with deep shredded-purple contrast heel and toe. Built to withstand colossal impacts.',
    price: 449,
    originalPrice: 599,
    discountBadge: '25% OFF',
    categories: ['movie-inspired', 'marvel-avengers', 'crew', 'casual'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Gamma Green', 'Monster Purple'],
    stock: 40,
    material: '84% Supima Cotton, 13% Nylon, 3% Lycra',
    rating: 4.89,
    reviewsCount: 74,
    isFeatured: false,
    active: true,
    images: ['/images/socks/hulk-gamma-smash.svg']
  },

  // ==========================================
  // 2. HARRY POTTER (MANDATORY)
  // ==========================================
  {
    name: 'Gryffindor Bravery Scarlet & Gold Crew',
    slug: 'gryffindor-scarlet-gold-crew',
    collection: 'Movie-Inspired',
    franchise: 'Harry Potter',
    movieReference: 'Harry Potter: House Gryffindor',
    description: 'Chivalric scarlet red body accented with golden lion collegiate athletic stripes and high-density Gryffindor crest embroidery. Fit for the truly courageous.',
    price: 499,
    originalPrice: 699,
    discountBadge: '29% OFF',
    categories: ['movie-inspired', 'harry-potter', 'crew', 'themed'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Scarlet Red', 'Lion Gold'],
    stock: 60,
    material: '82% Combed Cotton, 15% Polyamide, 3% Elastane',
    rating: 4.99,
    reviewsCount: 210,
    isFeatured: true,
    active: true,
    images: ['/images/socks/gryffindor-scarlet-gold.svg']
  },
  {
    name: 'Slytherin Ambition Emerald & Silver Calf',
    slug: 'slytherin-emerald-silver-calf',
    collection: 'Movie-Inspired',
    franchise: 'Harry Potter',
    movieReference: 'Harry Potter: House Slytherin',
    description: 'Lustrous deep emerald green Scottish Lisle weave with silver serpentine chevron ribbing and serpent shield insignia. Pure cunning and aristocratic sophistication.',
    price: 499,
    originalPrice: 699,
    discountBadge: '29% OFF',
    categories: ['movie-inspired', 'harry-potter', 'calf', 'formal'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Forest Emerald', 'Serpentine Silver'],
    stock: 48,
    material: '80% Fil d’Écosse Cotton, 17% Polyamide, 3% Spandex',
    rating: 4.95,
    reviewsCount: 142,
    isFeatured: true,
    active: true,
    images: ['/images/socks/slytherin-emerald-silver.svg']
  },
  {
    name: 'Ravenclaw Wisdom Midnight & Bronze Ankle',
    slug: 'ravenclaw-midnight-bronze-ankle',
    collection: 'Movie-Inspired',
    franchise: 'Harry Potter',
    movieReference: 'Harry Potter: House Ravenclaw',
    description: 'Scholarly midnight sapphire blue breathable ankle sock woven with antique bronze tipping and eagle diadem geometry. Ready for wit and boundless intellect.',
    price: 399,
    originalPrice: 549,
    discountBadge: '27% OFF',
    categories: ['movie-inspired', 'harry-potter', 'ankle', 'casual'],
    sizes: ['S', 'M', 'L'],
    colors: ['Midnight Blue', 'Antique Bronze'],
    stock: 35,
    material: '85% Ringspun Cotton, 12% Polyester, 3% Elastane',
    rating: 4.92,
    reviewsCount: 96,
    isFeatured: false,
    active: true,
    images: ['/images/socks/ravenclaw-midnight-bronze.svg']
  },
  {
    name: 'Hufflepuff Loyalty Canary & Charcoal Crew',
    slug: 'hufflepuff-canary-charcoal-crew',
    collection: 'Movie-Inspired',
    franchise: 'Harry Potter',
    movieReference: 'Harry Potter: House Hufflepuff',
    description: 'Heartwarming canary badger-yellow body with comforting charcoal heather ribbing and soft cushioned footbed. Dedicated, patient, and unbeatably cozy.',
    price: 449,
    originalPrice: 599,
    discountBadge: '25% OFF',
    categories: ['movie-inspired', 'harry-potter', 'crew', 'comfort'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Canary Yellow', 'Charcoal Heather'],
    stock: 42,
    material: '80% Combed Cotton, 17% Polyamide, 3% Elastane',
    rating: 4.93,
    reviewsCount: 108,
    isFeatured: false,
    active: true,
    images: ['/images/socks/hufflepuff-canary-charcoal.svg']
  },
  {
    name: 'Marauders & Spells Lumos Jacquard Crew',
    slug: 'marauders-lumos-spells-crew',
    collection: 'Movie-Inspired',
    franchise: 'Harry Potter',
    movieReference: 'Harry Potter: Spells & Hogwarts',
    description: 'Woven in midnight black Supima cotton with luminous golden Deathly Hallows emblem, Elder Wand motif, and celestial starry sparkles across the leg.',
    price: 549,
    originalPrice: 749,
    discountBadge: '27% OFF',
    categories: ['movie-inspired', 'harry-potter', 'crew', 'aesthetic'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Magic Obsidian', 'Lumos Gold'],
    stock: 55,
    material: '82% Supima Cotton, 15% Nylon, 3% Metallic Lurex',
    rating: 4.97,
    reviewsCount: 168,
    isFeatured: true,
    active: true,
    images: ['/images/socks/marauders-lumos-spells.svg']
  },

  // ==========================================
  // 3. STRANGER THINGS (MANDATORY)
  // ==========================================
  {
    name: 'Hellfire Club Hawkins Retro Crew',
    slug: 'stranger-hellfire-club-crew',
    collection: 'Movie-Inspired',
    franchise: 'Stranger Things',
    movieReference: 'Stranger Things: Hellfire Club',
    description: 'Authentic 80s vintage off-white tube sock with retro crimson athletic stripes and the horned dice crest of the legendary Hawkins High Hellfire Club.',
    price: 499,
    originalPrice: 649,
    discountBadge: '23% OFF',
    categories: ['movie-inspired', 'stranger-things', 'crew', 'themed'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Vintage Cream', 'Retro Crimson'],
    stock: 70,
    material: '85% Ringspun Cotton, 12% Polyamide, 3% Elastane',
    rating: 4.96,
    reviewsCount: 184,
    isFeatured: true,
    active: true,
    images: ['/images/socks/stranger-hellfire-club.svg']
  },
  {
    name: 'The Upside Down Spore Shadow Calf',
    slug: 'stranger-upside-down-calf',
    collection: 'Movie-Inspired',
    franchise: 'Stranger Things',
    movieReference: 'Stranger Things: The Upside Down',
    description: 'Eerie dark dimensional motif with decaying shadow vine jacquard and glowing toxic red spore particles woven over pitch black combed cotton.',
    price: 499,
    originalPrice: 699,
    discountBadge: '29% OFF',
    categories: ['movie-inspired', 'stranger-things', 'calf', 'aesthetic'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Shadow Black', 'Spore Crimson'],
    stock: 45,
    material: '80% Combed Cotton, 17% Polyamide, 3% Spandex',
    rating: 4.94,
    reviewsCount: 118,
    isFeatured: true,
    active: true,
    images: ['/images/socks/stranger-upside-down.svg']
  },
  {
    name: 'Hawkins 1983 Vintage Athletic Rib',
    slug: 'stranger-hawkins-1983-rib',
    collection: 'Movie-Inspired',
    franchise: 'Stranger Things',
    movieReference: 'Stranger Things (1983)',
    description: 'Golden mustard and retro teal stripes embodying classic 1980s Indiana skate culture with full terry footbed cushion and reinforced heel.',
    price: 449,
    originalPrice: 599,
    discountBadge: '25% OFF',
    categories: ['movie-inspired', 'stranger-things', 'crew', 'casual'],
    sizes: ['S', 'M', 'L'],
    colors: ['80s Mustard', 'Vintage Teal'],
    stock: 50,
    material: '82% Combed Cotton, 15% Nylon, 3% Elastane',
    rating: 4.91,
    reviewsCount: 82,
    isFeatured: false,
    active: true,
    images: ['/images/socks/stranger-hawkins-1983.svg']
  },

  // ==========================================
  // 4. GHOSTBUSTERS (MANDATORY)
  // ==========================================
  {
    name: 'Slimer Ectoplasm Neon Drip Crew',
    slug: 'ghostbusters-slimer-ectoplasm-crew',
    collection: 'Movie-Inspired',
    franchise: 'Ghostbusters',
    movieReference: 'Ghostbusters (1984)',
    description: 'Vivid radioactive neon green ectoplasm drips cascading down jet black luxury combed cotton. Features ultra-bright contrast toe and heel with Slimer motif.',
    price: 499,
    originalPrice: 649,
    discountBadge: '23% OFF',
    categories: ['movie-inspired', 'ghostbusters', 'crew', 'themed'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian Black', 'Ecto Green'],
    stock: 55,
    material: '82% Organic Cotton, 15% Polyamide, 3% Elastane',
    rating: 4.93,
    reviewsCount: 135,
    isFeatured: true,
    active: true,
    images: ['/images/socks/ghostbusters-slimer-ectoplasm.svg']
  },
  {
    name: 'No-Ghost Proton Pack Utility Rib',
    slug: 'ghostbusters-proton-pack-rib',
    collection: 'Movie-Inspired',
    franchise: 'Ghostbusters',
    movieReference: 'Ghostbusters: Proton Pack',
    description: 'Jumpsuit khaki utility weave engineered with hazard red and white caution tape stripes and the iconic red crossed ghost emblem.',
    price: 549,
    originalPrice: 749,
    discountBadge: '27% OFF',
    categories: ['movie-inspired', 'ghostbusters', 'crew', 'casual'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Jumpsuit Khaki', 'Hazard Red'],
    stock: 40,
    material: '80% Combed Cotton, 17% Polyamide, 3% Lycra',
    rating: 4.95,
    reviewsCount: 98,
    isFeatured: false,
    active: true,
    images: ['/images/socks/ghostbusters-proton-pack.svg']
  },

  // ==========================================
  // 5. DISNEY CHARACTERS (MANDATORY)
  // ==========================================
  {
    name: 'Mickey Mouse Heritage Polka Crew',
    slug: 'disney-mickey-heritage-crew',
    collection: 'Movie-Inspired',
    franchise: 'Disney Characters',
    movieReference: 'Disney: Mickey Mouse',
    description: 'Timeless tuxedo black combed cotton adorned with delicate pearl white polka dots and the vintage Mickey Mouse ear silhouette in rich crimson and gold.',
    price: 499,
    originalPrice: 649,
    discountBadge: '23% OFF',
    categories: ['movie-inspired', 'disney-characters', 'crew', 'themed'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Tuxedo Black', 'Mickey Red'],
    stock: 80,
    material: '84% Supima Cotton, 13% Nylon, 3% Elastane',
    rating: 4.98,
    reviewsCount: 220,
    isFeatured: true,
    active: true,
    images: ['/images/socks/disney-mickey-heritage.svg']
  },
  {
    name: 'Minnie Mouse Pastel Bow Ankle',
    slug: 'disney-minnie-bow-ankle',
    collection: 'Movie-Inspired',
    franchise: 'Disney Characters',
    movieReference: 'Disney: Minnie Mouse',
    description: 'Chic rose-wine body with sweet pastel bow embroidery, gentle scalloped elastic cuff, and low-cut discreet comfort for sneakers and ballet flats.',
    price: 399,
    originalPrice: 499,
    discountBadge: '20% OFF',
    categories: ['movie-inspired', 'disney-characters', 'ankle', 'comfort'],
    sizes: ['S', 'M', 'L'],
    colors: ['Rose Wine', 'Soft Blush'],
    stock: 55,
    material: '85% Ringspun Cotton, 12% Polyester, 3% Spandex',
    rating: 4.94,
    reviewsCount: 110,
    isFeatured: false,
    active: true,
    images: ['/images/socks/disney-minnie-bow.svg']
  },
  {
    name: 'Donald Duck Nautical Stripe Ankle',
    slug: 'disney-donald-nautical-ankle',
    collection: 'Movie-Inspired',
    franchise: 'Disney Characters',
    movieReference: 'Disney: Donald Duck',
    description: 'French sailor navy and crisp white nautical stripes accented with duckling yellow heel/toe and Donald’s iconic red ribbon bow tie.',
    price: 399,
    originalPrice: 499,
    discountBadge: '20% OFF',
    categories: ['movie-inspired', 'disney-characters', 'ankle', 'casual'],
    sizes: ['S', 'M', 'L'],
    colors: ['Sailor Navy', 'Duckling Yellow'],
    stock: 45,
    material: '82% Combed Cotton, 15% Nylon, 3% Spandex',
    rating: 4.90,
    reviewsCount: 78,
    isFeatured: false,
    active: true,
    images: ['/images/socks/disney-donald-nautical.svg']
  },
  {
    name: 'Stitch Experiment 626 Knit Crew',
    slug: 'disney-stitch-experiment-crew',
    collection: 'Movie-Inspired',
    franchise: 'Disney Characters',
    movieReference: 'Disney: Lilo & Stitch',
    description: 'Playful electric galactic blue socks featuring Stitch alien ear outlines, subtle tropical hibiscus motifs, and reinforced pressure points.',
    price: 499,
    originalPrice: 649,
    discountBadge: '23% OFF',
    categories: ['movie-inspired', 'disney-characters', 'crew', 'themed'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Electric Blue', 'Cyan Blue'],
    stock: 65,
    material: '80% Combed Cotton, 17% Polyamide, 3% Elastane',
    rating: 4.97,
    reviewsCount: 175,
    isFeatured: true,
    active: true,
    images: ['/images/socks/disney-stitch-experiment.svg']
  },
  {
    name: 'Winnie the Pooh Honeycomb Comfort Crew',
    slug: 'disney-pooh-honeycomb-crew',
    collection: 'Movie-Inspired',
    franchise: 'Disney Characters',
    movieReference: 'Disney: Winnie the Pooh',
    description: 'Cozy waffle-knit honeycomb texture in rich golden honey with tiny bumblebee jacquards and Hundred Acre Wood warmth.',
    price: 449,
    originalPrice: 599,
    discountBadge: '25% OFF',
    categories: ['movie-inspired', 'disney-characters', 'crew', 'comfort'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Honey Gold', 'Soft Cream'],
    stock: 50,
    material: '85% Organic Cotton, 12% Polyester, 3% Elastane',
    rating: 4.92,
    reviewsCount: 89,
    isFeatured: false,
    active: true,
    images: ['/images/socks/disney-pooh-honeycomb.svg']
  },

  // ==========================================
  // 6. CINEMATIC CLASSICS
  // ==========================================
  {
    name: 'The Cyber Rain Ribbed Crew',
    slug: 'cyber-rain-ribbed-crew',
    collection: 'Movie-Inspired',
    franchise: 'Cinematic Classics',
    movieReference: 'The Matrix (1999)',
    description: 'Woven with luminescent emerald green digital rain patterns cascading over jet black Egyptian cotton. Designed with targeted arch support and a reinforced toe.',
    price: 499,
    originalPrice: 649,
    discountBadge: '23% OFF',
    categories: ['movie-inspired', 'crew', 'unisex', 'themed'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Jet Black', 'Matrix Green'],
    stock: 60,
    material: '82% Combed Organic Cotton, 15% Polyamide, 3% Elastane',
    rating: 4.95,
    reviewsCount: 188,
    isFeatured: true,
    active: true,
    images: ['/images/socks/matrix-cyber-rain.svg']
  },
  {
    name: 'Interstellar Event Horizon Calf',
    slug: 'interstellar-event-horizon-calf',
    collection: 'Movie-Inspired',
    franchise: 'Cinematic Classics',
    movieReference: 'Interstellar (2014)',
    description: 'An ode to gravitational waves and celestial dust. Deep navy and gold ring weaves with relativistic distortion geometry across the cuff.',
    price: 599,
    originalPrice: 799,
    discountBadge: '25% OFF',
    categories: ['movie-inspired', 'luxury', 'calf', 'aesthetic'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Deep Cosmos Navy', 'Starlight Gold'],
    stock: 45,
    material: '78% Mercerized Cotton, 19% Nylon, 3% Spandex',
    rating: 4.98,
    reviewsCount: 164,
    isFeatured: true,
    active: true,
    images: ['/images/socks/interstellar-event-horizon.svg']
  },
  {
    name: 'The Don Pinstripe Silk Blend',
    slug: 'the-don-pinstripe-silk-blend',
    collection: 'Movie-Inspired',
    franchise: 'Cinematic Classics',
    movieReference: 'The Godfather (1972)',
    description: 'Understated power tailoring. Charcoal wool and silk weave featuring a delicate crimson rose monogram on the exterior ankle.',
    price: 699,
    originalPrice: 899,
    discountBadge: 'BESTSELLER',
    categories: ['movie-inspired', 'formal', 'silk-blend', 'calf'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal Pinstripe', 'Crimson Accent'],
    stock: 35,
    material: '60% Merino Wool, 25% Silk, 12% Polyamide, 3% Elastane',
    rating: 4.92,
    reviewsCount: 84,
    isFeatured: true,
    active: true,
    images: ['/images/socks/godfather-don-pinstripe.svg']
  },
  {
    name: 'Totem Inception Spiral Knit',
    slug: 'totem-inception-spiral-knit',
    collection: 'Movie-Inspired',
    franchise: 'Cinematic Classics',
    movieReference: 'Inception (2010)',
    description: 'Subconscious dream layer motifs rendered in golden ratio geometric jacquard. Seamless hand-linked toe for zero friction during lucid states.',
    price: 549,
    originalPrice: 749,
    discountBadge: 'LIMITED',
    categories: ['movie-inspired', 'geometric', 'crew', 'aesthetic'],
    sizes: ['S', 'M', 'L'],
    colors: ['Onyx', 'Architect Bronze'],
    stock: 30,
    material: '80% Combed Cotton, 17% Polyamide, 3% Lycra',
    rating: 4.88,
    reviewsCount: 52,
    isFeatured: false,
    active: true,
    images: ['/images/socks/inception-totem-spiral.svg']
  },

  // ==========================================
  // 7. DARK STORIES
  // ==========================================
  {
    name: 'Gothic Nocturne Filigree Sock',
    slug: 'gothic-nocturne-filigree-sock',
    collection: 'Dark Stories',
    franchise: 'Dark Stories',
    movieReference: 'Penny Dreadful & Dark Romance',
    description: 'Victorian baroque lace motifs woven in matte midnight black with burnished bronze accents. High-gauge knit offering velvet-soft tactile warmth.',
    price: 549,
    originalPrice: 749,
    discountBadge: '27% OFF',
    categories: ['dark-stories', 'gothic', 'crew', 'aesthetic'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Midnight Obsidian', 'Antique Gold'],
    stock: 45,
    material: '84% Supima Cotton, 14% Nylon, 2% Elastane',
    rating: 4.91,
    reviewsCount: 96,
    isFeatured: true,
    active: true,
    images: ['/images/socks/dark-gothic-nocturne.svg']
  },
  {
    name: 'Ravenwood Shadow Mid-Calf',
    slug: 'ravenwood-shadow-mid-calf',
    collection: 'Dark Stories',
    franchise: 'Dark Stories',
    movieReference: 'The Crow / Dark Fantasy',
    description: 'Textured ribbed chevron pattern echoing corvid plumage. Engineered double-cuff prevents slipping while maintaining a sleek silhouette.',
    price: 449,
    originalPrice: 599,
    discountBadge: '25% OFF',
    categories: ['dark-stories', 'casual', 'ribbed', 'calf'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Matte Black', 'Dark Charcoal'],
    stock: 50,
    material: '80% Combed Cotton, 18% Polyamide, 2% Spandex',
    rating: 4.87,
    reviewsCount: 62,
    isFeatured: false,
    active: true,
    images: ['/images/socks/dark-ravenwood-shadow.svg']
  },

  // ==========================================
  // 8. FORMAL
  // ==========================================
  {
    name: 'Sovereign Herringbone Mercerized',
    slug: 'sovereign-herringbone-mercerized',
    collection: 'Formal',
    franchise: 'Formal Luxury',
    movieReference: 'Kingsman: The Secret Service',
    description: 'Subtle micro-herringbone weave crafted from double-mercerized Scottish Lisle cotton. Exceptional silky sheen and breathability under formal oxfords.',
    price: 649,
    originalPrice: 849,
    discountBadge: '24% OFF',
    categories: ['formal', 'mercerized', 'luxury', 'calf'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Midnight Navy', 'Mocha Brown'],
    stock: 60,
    material: '90% Fil d’Écosse Cotton, 8% Polyamide, 2% Elastane',
    rating: 4.96,
    reviewsCount: 114,
    isFeatured: true,
    active: true,
    images: ['/images/socks/formal-sovereign-herringbone.svg']
  },
  {
    name: 'Diplomat Ribbed Cashmere Touch',
    slug: 'diplomat-ribbed-cashmere-touch',
    collection: 'Formal',
    franchise: 'Formal Luxury',
    movieReference: 'Casino Royale',
    description: 'Classic vertical ribbed structure in rich taupe with ultra-soft hand feel. Hand-finished flat seams designed specifically for all-day gala comfort.',
    price: 799,
    originalPrice: 999,
    discountBadge: 'LUXURY',
    categories: ['formal', 'cashmere-blend', 'calf'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Warm Taupe', 'Bespoke Black'],
    stock: 35,
    material: '75% Combed Cotton, 15% Cashmere, 8% Nylon, 2% Spandex',
    rating: 4.99,
    reviewsCount: 88,
    isFeatured: true,
    active: true,
    images: ['/images/socks/formal-diplomat-cashmere.svg']
  },

  // ==========================================
  // 9. EVERYDAY & CASUAL
  // ==========================================
  {
    name: 'Wanderlust Cloud-Terry Ankle',
    slug: 'wanderlust-cloud-terry-ankle',
    collection: 'Everyday & Casual',
    franchise: 'Daily Comfort',
    movieReference: 'The Secret Life of Walter Mitty',
    description: 'Plush cushioned terry sole offering responsive shock absorption for city strolls. Breathable mesh top panel keeps feet cool in any weather.',
    price: 349,
    originalPrice: 449,
    discountBadge: '22% OFF',
    categories: ['everyday-casual', 'ankle', 'comfort'],
    sizes: ['S', 'M', 'L'],
    colors: ['Oatmeal Heather', 'Vintage White'],
    stock: 75,
    material: '85% Ringspun Cotton, 12% Polyester, 3% Elastane',
    rating: 4.89,
    reviewsCount: 140,
    isFeatured: false,
    active: true,
    images: ['/images/socks/casual-wanderlust-terry.svg']
  },
  {
    name: 'Chromatic Spectrum Colourblock',
    slug: 'chromatic-spectrum-colourblock',
    collection: 'Everyday & Casual',
    franchise: 'Daily Comfort',
    movieReference: 'La La Land / Technicolor Classics',
    description: 'Joyful modern geometry in muted terracotta, mustard gold, and deep forest green. Perfect statement accent for loafers and clean white sneakers.',
    price: 399,
    originalPrice: 549,
    discountBadge: '27% OFF',
    categories: ['everyday-casual', 'crew', 'colourful', 'casual'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Terracotta Multi', 'Mustard / Navy'],
    stock: 55,
    material: '80% Combed Cotton, 17% Polyamide, 3% Elastane',
    rating: 4.93,
    reviewsCount: 94,
    isFeatured: true,
    active: true,
    images: ['/images/socks/casual-chromatic-spectrum.svg']
  }
];

async function seed() {
  console.log('[Seed] Starting Socktales database seeding with SOCKS-ONLY catalogue & INR pricing...');
  const db = await connectDb();

  // 1. Seed Users
  console.log('[Seed] Seeding administrative & customer accounts...');
  const adminPasswordHash = await hashPassword('Admin@12345');
  const customerPasswordHash = await hashPassword('Customer@12345');

  const usersCollection = db.collection('users');
  await usersCollection.updateOne(
    { email: 'admin@socktales.com' },
    {
      $set: {
        name: 'Socktales Curator (Admin)',
        email: 'admin@socktales.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        phone: '+91 98765 43210',
        addresses: [
          {
            fullName: 'Socktales Studio',
            street: '42 Editorial Boulevard',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
            phone: '+91 98765 43210'
          }
        ],
        updatedAt: new Date()
      },
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );

  await usersCollection.updateOne(
    { email: 'customer@socktales.com' },
    {
      $set: {
        name: 'Angad Mankar',
        email: 'customer@socktales.com',
        passwordHash: customerPasswordHash,
        role: 'customer',
        phone: '+91 91234 56789',
        addresses: [
          {
            fullName: 'Angad Mankar',
            street: '15 Cinema Avenue, Apt 4B',
            city: 'Pune',
            state: 'Maharashtra',
            postalCode: '411001',
            country: 'India',
            phone: '+91 91234 56789'
          }
        ],
        updatedAt: new Date()
      },
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );

  // 2. Clean and Seed Categories
  console.log('[Seed] Seeding brand collections and categories...');
  const categoriesCollection = db.collection('categories');
  await categoriesCollection.deleteMany({});
  for (const cat of categories) {
    await categoriesCollection.insertOne({
      ...cat,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // 3. Clean and Seed Products (Socks only, INR prices)
  console.log('[Seed] Seeding 30 movie-inspired, Marvel, Potter, Stranger Things, Ghostbusters, Disney & luxury socks...');
  const productsCollection = db.collection('products');
  await productsCollection.deleteMany({});
  for (const prod of products) {
    await productsCollection.insertOne({
      ...prod,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  console.log(`[Seed] Seeding complete! Database primed with ${products.length} sock designs, ${categories.length} categories, all in Indian Rupees (₹ INR).`);
  await closeDb();
  process.exit(0);
}

if (require.main === module) {
  seed().catch(err => {
    console.error('[Seed Error]:', err);
    process.exit(1);
  });
}

module.exports = seed;
