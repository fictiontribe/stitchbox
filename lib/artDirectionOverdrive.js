/**
 * Art Direction 2.1 - Creative Overdrive & Image Generation Systems
 * Provides UX/UI Art Direction for Stitch code generation,
 * and Nano Banana Image Generation prompts for AI image creation.
 */

export const CATEGORIES = [
  'Website',
  'Photography',
  'Graphics',
  'Branding & Identity',
  'Editorial & Print'
];

/**
 * Creative Overdrive Prompt (Focused 100% on UX & Web Design for Stitch)
 * STRICTLY NO CAMERA / OPTICS / PHOTOGRAPHIC EQUIPMENT REFERENCES.
 */
export function compileCreativeOverdrivePrompt(item, subject = 'Modern AI Application') {
  if (!item) return '';

  const ds = item.recipe?.designSystem || {};
  const colors = ds.color || {};
  const typo = ds.typography || {};
  const fx = item.recipe?.visualEffects || {};

  const category = item.category || 'Website';
  const creativeName = item.creativeName || 'Asset DNA';
  const aestheticFamily = item.recipe?.aestheticFamily || 'clinical-editorial';
  const tokens = item.tokens || [];
  const vocabulary = item.recipe?.vocabularyTerms || [];

  // Extract swatches
  const lightBase = colors.lightBase || colors.surface || '#f8fafc';
  const darkBase = colors.darkBase || colors.card || '#0f172a';
  const primary = colors.primary || '#000000';
  const secondary = colors.secondary || '#64748b';
  const accent = colors.accent || colors.accentA || '#4f46e5';
  const neutralText = colors.neutralText || '#0f172a';

  let uxDirection = '';
  let layoutRhythm = '';
  let surfaceTreatment = '';

  switch (category) {
    case 'Photography':
      uxDirection = `High-impact hero visual hierarchy with dramatic contrast, full-bleed imagery containers, and crisp dark/light color blocking (${lightBase} to ${darkBase}). Focus on bold visual anchors and minimal content framing.`;
      layoutRhythm = `Asymmetric editorial grid with generous negative space, floating caption chips, and razor-thin container borders (${ds.shape?.borderStyle || '1px solid rgba(255,255,255,0.1)'}).`;
      surfaceTreatment = `High-contrast monochrome card containers, crisp image overlays with hover greyscale/color transitions, and sharp typography tracking.`;
      break;

    case 'Graphics':
      uxDirection = `Punchy vector layout architecture with chromatic color blocking (${accent} highlights against ${darkBase} surfaces). High-density graphic modularity and geometric visual flow.`;
      layoutRhythm = `Modular 12-column CSS grid rhythm with tight compact spacing (${ds.spacing?.baseUnit || '8px'}), sharp corner radiuses (${ds.shape?.borderRadius || '8px'}), and prominent stat counters.`;
      surfaceTreatment = `Dithered texture fields (${fx.textureField?.type || '1-bit dither'}), flat color-blocked CTA cards, and high-visibility status badges.`;
      break;

    case 'Branding & Identity':
      uxDirection = `Tactile digital identity layout for "${subject}". High-contrast branding showcase featuring embossed typography in ${typo.headingFont || 'Grotesk Display'} and structured design token chips.`;
      layoutRhythm = `Balanced multi-card grid hierarchy with strict alignment, structured metadata rows, and prominent brand primary accenting (${primary}).`;
      surfaceTreatment = `Subtle glassmorphic container cards with backdrop blur (${fx.glassmorphism?.blurRadius || '12px'}), crisp 1px borders, and refined neutral body text (${neutralText}).`;
      break;

    case 'Editorial & Print':
      uxDirection = `Sculptural typographic web layout with brutalist editorial rhythm. Oversized lead headlines bleeding across section boundaries paired with technical monospace labels.`;
      layoutRhythm = `Asymmetric, high-density editorial column layout with dynamic text scale ratios (${typo.scaleRatio || '1.33'}) and tight tracking.`;
      surfaceTreatment = `Print-inspired matte paper canvas (${lightBase}), dark stark containers (${darkBase}), and razor-sharp typographic contrast.`;
      break;

    case 'Website':
    default:
      uxDirection = `Pristine UI architecture for "${subject}". High-density layout rhythm, ${typo.headingFont || 'Grotesk Display'} display headlines paired with ${typo.bodyFont || 'Inter'} body typography. High-contrast interactive components and intuitive navigation.`;
      layoutRhythm = `Structured container grid with ${ds.spacing?.density || 'comfortable'} vertical rhythm, sticky navigation header, and clean modular content cards.`;
      surfaceTreatment = `Glassmorphic surface cards with subtle transparency, ${fx.textureField?.type || 'dither'} accent fields, and prominent CTA buttons using accent color (${accent}).`;
      break;
  }

  return `[CREATIVE OVERDRIVE UX/UI ART DIRECTION BRIEF]

PROJECT SUBJECT: "${subject}"
CREATIVE IDENTITY: ${creativeName} (${aestheticFamily})
FUNCTIONAL CATEGORY: ${category.toUpperCase()}
AESTHETIC TOKENS: ${tokens.slice(0, 8).join(', ')}
DESIGN VOCABULARY: ${vocabulary.slice(0, 6).join(', ')}

--- SUPREME UX & UI ARCHITECTURE BRIEF ---
${uxDirection}

LAYOUT & SPATIAL RHYTHM:
${layoutRhythm}

SURFACE TREATMENT & INTERACTIVE STATES:
${surfaceTreatment}

COLOR SYSTEM & CONTRAST STRATEGY:
- Canvas Light Base: ${lightBase}
- Container Dark Base: ${darkBase}
- Brand Primary: ${primary}
- Structural Secondary: ${secondary}
- Key Accent CTA: ${accent}
- Typography Neutral: ${neutralText}

TYPOGRAPHY & COMPONENT HIERARCHY:
- Heading Font Family: "${typo.headingFont || 'Outfit, sans-serif'}"
- Body Font Family: "${typo.bodyFont || 'Inter, sans-serif'}"
- Container Border Radius: ${ds.shape?.borderRadius || '8px'}
- Border Definition: ${ds.shape?.borderStyle || '1px solid rgba(255,255,255,0.1)'}

--- START STITCH DESIGN.md CODE BLOCK ---
:root {
  --color-light-base: ${lightBase};
  --color-dark-base: ${darkBase};
  --color-primary: ${primary};
  --color-secondary: ${secondary};
  --color-accent: ${accent};
  --color-neutral-text: ${neutralText};
  --font-heading: "${typo.headingFont || 'Outfit, sans-serif'}";
  --font-body: "${typo.bodyFont || 'Inter, sans-serif'}";
  --spacing-base: ${ds.spacing?.baseUnit || '8px'};
  --radius-container: ${ds.shape?.borderRadius || '8px'};
  --border-style: ${ds.shape?.borderStyle || '1px solid rgba(0,0,0,0.1)'};
}

/* STRUCTURAL RULES */
${(item.recipe?.alwaysRules || ['Maintain clinical typography grid', 'Use sharp high-contrast color blocking']).map(r => `- ${r}`).join('\n')}

/* BANS & ANTI-PATTERNS */
${(item.recipe?.neverRules || ['Never use soft gradients or washed pastels', 'Avoid generic low-contrast text']).map(r => `- ${r}`).join('\n')}
--- END STITCH DESIGN.md CODE BLOCK ---`;
}

/**
 * Nano Banana Image Generation Prompt System
 * Synthesizes reference art direction, color palette, lighting, and visual style
 * into a stylized base prompt for AI Image Generators (Nano Banana / Midjourney / Flux).
 */
export function compileNanoBananaImagePrompt(item, subject = 'Futuristic Product Design') {
  if (!item) return '';

  const ds = item.recipe?.designSystem || {};
  const colors = ds.color || {};
  const fx = item.recipe?.visualEffects || {};

  const category = item.category || 'Website';
  const creativeName = item.creativeName || 'Asset DNA';
  const aestheticFamily = item.recipe?.aestheticFamily || 'minimal-editorial';
  const tokens = item.tokens || [];
  const vocabulary = item.recipe?.vocabularyTerms || [];

  // Colors
  const lightBase = colors.lightBase || '#f8fafc';
  const darkBase = colors.darkBase || '#0f172a';
  const primary = colors.primary || '#000000';
  const accent = colors.accent || '#4f46e5';

  // Determine Art Style & Rendering Medium based on category & recipe
  let medium = 'Sculptural 3D render and high-end art direction showcase';
  let lighting = 'Hard studio key lighting casting razor-sharp graphic shadows, high-contrast chiaroscuro, pure highlights';
  let composition = 'Centered hero composition, bold studio isolation, dramatic spatial balance';

  switch (category) {
    case 'Photography':
      medium = 'High-fashion editorial photography, raw industrial aesthetic';
      lighting = 'Direct hard key strobe from side angle, razor-sharp shadow edges, deep true blacks and crisp whites';
      composition = 'Confrontational hero framing, tight crop on subject details, stark studio backdrop';
      break;

    case 'Graphics':
      medium = 'Brutalist graphic illustration, vector-as-sculpture design, chromatic color blocking';
      lighting = 'Flat overhead studio illumination, crisp vector edge separation, zero unwanted noise';
      composition = 'Geometric graphic alignment, graphic poster composition, bold focal contrast';
      break;

    case 'Branding & Identity':
      medium = 'Tactile product showcase, matte material texture finish, embossed branding detail';
      lighting = 'Clinical studio lighting with subtle 45-degree directional falloff and specular edge highlights';
      composition = 'Architectural product elevation view, resting on raw concrete or matte dark studio pedestal';
      break;

    case 'Editorial & Print':
      medium = 'High-contrast editorial print artwork, cover art aesthetic, graphic paper texture finish';
      lighting = 'Stark directional studio lighting, dramatic chiaroscuro contrast between light and dark fields';
      composition = 'Asymmetric graphic grid composition, poster design hierarchy';
      break;

    case 'Website':
    default:
      medium = 'Futuristic digital artwork and sleek 3D studio render';
      lighting = 'Clinical studio illumination with subtle volumetric ambient glow and glassmorphic reflection';
      composition = 'Clean hero presentation against a matte dark background, isometric elevated perspective';
      break;
  }

  const textureDescriptor = fx.textureField?.enabled 
    ? `Subtle ${fx.textureField?.type || 'dither'} texture overlay` 
    : 'Pristine matte surface finish';

  return `[NANO BANANA AI IMAGE PROMPT]

SUBJECT:
${subject}

ART DIRECTION & VISUAL STYLE:
${medium}, in the style of ${creativeName} (${aestheticFamily}). ${composition}.

COLOR PALETTE & PALETTE ACCENTS:
Dominant color harmony featuring dark base canvas (${darkBase}), crisp light accents (${lightBase}), brand primary (${primary}), and vivid key highlight (${accent}).

LIGHTING & MATERIAL TEXTURES:
${lighting}. ${textureDescriptor}, razor-sharp details, high contrast, clean vector clarity, hyper-detailed material rendering.

STYLE KEYWORDS:
${vocabulary.slice(0, 5).join(', ')}, ${tokens.slice(0, 6).join(', ')}, 8k resolution, award-winning art direction, --ar 16:9 --v 6.0`;
}
