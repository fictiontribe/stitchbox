export const INITIAL_LIBRARY = [];

export const VOCAB_DICTIONARY = {
  'topo-ink': 'Topographic lines in dark ink used as structured layouts instead of vector grids.',
  'sage-ground': 'A desaturated organic pale-green background representing heavy craft paper.',
  'grotesk-display': 'High-contrast sans-serif display fonts conveying raw, technical authority.',
  'mono-chips': 'Small tabular text blocks containing tags, transaction metadata, or coordinates.',
  'halftone': 'A classic printing texture built with variable-size dots, offering an analog print quality.',
  'bitmap-dither': 'Raw 1-bit image processing rendering photography into dense black and white pixels.',
  'stark-dark': 'Pure high-contrast dark space with no subtle gray cards or friendly lighting.',
  'giant-wordmark': 'Exaggerated branding headers that bleed off structural container borders.',
  'cinematic': 'Volumetric lighting, organic textures, and wide landscape photography resembling film.',
  'minimalism': 'Elimination of structural decorations in favor of absolute typographical rhythm.',
  'desaturated-photo': 'Low-saturation or monochromatic imagery integrated to preserve layout palette integrity.',
  'binary-dither': 'Using computer-generated characters (1s and 0s) as textures to construct shapes.'
};

export const TAG_RELATIONS = {
  'Editorial': ['topo-ink', 'sage-ground', 'grotesk-display', 'cinematic', 'minimalism', 'desaturated-photo', 'tiny-sans'],
  'SaaS/B2B': ['topo-ink', 'mono-chips', 'ruler-linework', 'technical-timestamps', 'binary-dither', 'dark-teal', 'amber-glow'],
  'Brutalist': ['bitmap-dither', 'stark-dark', 'giant-wordmark', 'high-contrast', 'raw-grain', 'asymmetric-grid'],
  'Consumer': ['grotesk-display', 'flat-shadow', 'bold-borders', 'apricot-accent', 'geometry'],
  'Mono': ['sage-ground', 'bitmap-dither', 'stark-dark', 'high-contrast', 'tiny-sans', 'desaturated-photo'],
  'Textured': ['topo-ink', 'halftone', 'bitmap-dither', 'raw-grain', 'binary-dither', 'atmospheric-fog']
};

export const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
});

export const compressImageDataUrl = (dataUrl, maxWidth = 1000, quality = 0.82) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !dataUrl || !dataUrl.startsWith('data:image')) {
      return resolve(dataUrl);
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(dataUrl);
  });
};

export const compileStitchPrompt = (item, subject) => {
  const ds = item.recipe?.designSystem || {};
  const colors = ds.color || {};
  const typo = ds.typography || {};
  const spacing = ds.spacing || {};
  const shape = ds.shape || {};
  const fx = item.recipe?.visualEffects || {};

  return `Build a landing page for: "${subject}"

Refer to the structural, aesthetic, color tokens, and layout constraints defined in the DESIGN.md block below to generate the page.

--- START DESIGN.md CONSTRAINTS ---

# Aesthetic Profile: ${item.recipe?.aestheticFamily || 'Custom Design DNA'} - ${(item.recipe?.vocabularyTerms || []).join(', ')}

## 1. CSS Design Tokens (:root)
\`\`\`css
:root {
  --color-light-base: ${colors.lightBase || colors.surface || '#f8fafc'};
  --color-dark-base: ${colors.darkBase || colors.card || '#0f172a'};
  --color-accent-a: ${colors.accentA || colors.primary || '#4f46e5'};
  --color-accent-b: ${colors.accentB || colors.secondary || '#10b981'};
  --color-accent-synth: ${colors.synthesizedAccent || colors.accent || '#6366f1'};
  --color-neutral-text: ${colors.neutralText || '#0f172a'};
  --font-heading: "${typo.headingFont || 'Outfit, sans-serif'}";
  --font-body: "${typo.bodyFont || 'Inter, sans-serif'}";
  --spacing-base: ${spacing.baseUnit || '8px'};
  --radius-container: ${shape.borderRadius || '8px'};
  --border-style: ${shape.borderStyle || '1px solid rgba(0,0,0,0.1)'};
}
\`\`\`

## 2. Visual Feel & Intent
- Sensory Feel: ${item.recipe?.feel || 'Modern'}
- Perceived Intent: ${item.recipe?.intent || 'High visual clarity'}

## 3. Structural Rules (MUST FOLLOW)
${(item.recipe?.alwaysRules || []).map(rule => `- ${rule}`).join('\n')}

## 4. Anti-Patterns & Bans (NEVER DO)
${(item.recipe?.neverRules || []).map(rule => `- ${rule}`).join('\n')}

## 5. Advanced Visual Rendering
- Glassmorphism: ${fx.glassmorphism?.enabled ? `Enabled (blur: ${fx.glassmorphism?.blurRadius}, opacity: ${fx.glassmorphism?.transparency})` : 'Disabled'}
- Texture Field: ${fx.textureField?.enabled ? `Enabled (type: ${fx.textureField?.type})` : 'None'}
- Performance Tier: ${fx.renderingTier || 'lightweight'}

--- END DESIGN.md CONSTRAINTS ---`;
};

export const fetchUrlScreenshot = async (url) => {
  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  let domain = cleanUrl;
  try {
    domain = new URL(cleanUrl).hostname;
  } catch (e) {
    domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];
  }
  const screenshotUrl = `https://image.thum.io/get/width/1200/crop/800/noanimate/${cleanUrl}`;
  return {
    screenshotUrl,
    title: domain,
    cleanUrl
  };
};

export const imageUrlToBase64 = async (imageUrl) => {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const blob = await res.blob();
  const mimeType = blob.type || 'image/png';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1];
      resolve({ base64: base64data, mimeType });
    };
    reader.onerror = reject;
  });
};
