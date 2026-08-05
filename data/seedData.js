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

export const CANONICAL_BASE_TAGS = [
  'Website',
  'Mobile & App',
  'Graphics & Motion',
  'Branding & Identity',
  'Editorial & Print',
  'UI & SaaS',
  'Photography',
  'Minimal & Brutalist'
];

export function clusterBaseTag(rawTag) {
  if (!rawTag || typeof rawTag !== 'string') return 'Website';
  const tag = rawTag.trim().toLowerCase();

  if (tag.includes('web') || tag.includes('landing') || tag.includes('site') || tag.includes('e-commerce') || tag.includes('store') || tag.includes('commerce') || tag.includes('drops')) {
    return 'Website';
  }
  if (tag.includes('app') || tag.includes('mobile') || tag.includes('ios') || tag.includes('android')) {
    return 'Mobile & App';
  }
  if (tag.includes('graphic') || tag.includes('motion') || tag.includes('illustration') || tag.includes('3d') || tag.includes('vector') || tag.includes('art') || tag.includes('textured') || tag.includes('candy')) {
    return 'Graphics & Motion';
  }
  if (tag.includes('brand') || tag.includes('identity') || tag.includes('logo') || tag.includes('packaging') || tag.includes('corporate')) {
    return 'Branding & Identity';
  }
  if (tag.includes('editorial') || tag.includes('print') || tag.includes('poster') || tag.includes('magazine') || tag.includes('book') || tag.includes('typography')) {
    return 'Editorial & Print';
  }
  if (tag.includes('saas') || tag.includes('b2b') || tag.includes('ui') || tag.includes('dashboard') || tag.includes('interface') || tag.includes('component') || tag.includes('system') || tag.includes('consumer') || tag.includes('fintech') || tag.includes('enterprise')) {
    return 'UI & SaaS';
  }
  if (tag.includes('photo') || tag.includes('cinematic') || tag.includes('portrait') || tag.includes('shot')) {
    return 'Photography';
  }
  if (tag.includes('brutal') || tag.includes('minimal') || tag.includes('stark') || tag.includes('mono') || tag.includes('dither') || tag.includes('raw')) {
    return 'Minimal & Brutalist';
  }

  if (CANONICAL_BASE_TAGS.includes(rawTag)) return rawTag;
  return 'Website';
}

export function normalizeBaseTags(rawTags) {
  if (!rawTags) return ['Website'];
  const tags = Array.isArray(rawTags) ? rawTags : [rawTags];
  const clusters = new Set();
  tags.forEach(t => {
    clusters.add(clusterBaseTag(t));
  });
  return clusters.size > 0 ? Array.from(clusters) : ['Website'];
}

export const VOCAB_SYNONYMS = {
  // 3D & Graphics
  '3d-rendering': '3d-render',
  '3d-render': '3d-render',
  '3d metallic render': '3d-render',
  '3d-graphics': '3d-render',
  'product motion': '3d-render',
  'isometric illustration': 'vector-graphics',
  'flat-vector': 'vector-graphics',
  'vector-illustration': 'vector-graphics',
  'vector art': 'vector-graphics',

  // Gradients
  'gradient-mesh': 'gradient-mesh',
  'gradient mesh': 'gradient-mesh',
  'volumetric-gradients': 'gradient-mesh',
  'gradient background': 'gradient-mesh',
  'gradient field': 'gradient-mesh',
  'fluid-art': 'gradient-mesh',
  'generative background': 'gradient-mesh',
  'pink-yellow gradient': 'gradient-mesh',
  'mesh gradient': 'gradient-mesh',

  // Dark Mode
  'dark-mode': 'dark-mode',
  'dark mode': 'dark-mode',
  'dark glassmorphism': 'dark-mode',
  'pitch-black': 'dark-mode',
  'black-background': 'dark-mode',
  'void backdrop': 'dark-mode',
  'pitch black': 'dark-mode',
  'charcoal surface': 'dark-mode',
  'monochrome-canvas': 'dark-mode',
  'stark-dark': 'dark-mode',

  // Light Mode
  'light-mode': 'light-mode',
  'light mode': 'light-mode',
  'white-canvas': 'light-mode',
  'light-canvas': 'light-mode',
  'pure white': 'light-mode',
  'clean white': 'light-mode',
  'cream canvas': 'light-mode',
  'cloud white': 'light-mode',
  'white typography': 'light-mode',
  'crisp white text': 'light-mode',
  'whitespace': 'white-space',
  'white-space': 'white-space',
  'generous-whitespace': 'white-space',
  'spacious layout': 'white-space',
  'spacious': 'white-space',

  // Glassmorphism
  'glassmorphism': 'glassmorphism',
  'glassmorphic overlay': 'glassmorphism',
  'translucent': 'glassmorphism',

  // Minimalism
  'minimalist': 'minimalism',
  'minimal': 'minimalism',
  'clean-minimalism': 'minimalism',
  'clean minimalist': 'minimalism',
  'minimalism': 'minimalism',
  'minimal layout': 'minimalism',
  'clean': 'minimalism',
  'sleek': 'minimalism',

  // Typography
  'grotesk display': 'grotesk-display',
  'grotesk-display': 'grotesk-display',
  'grotesk sans': 'grotesk-display',
  'editorial serif': 'editorial-serif',
  'editorial-serif': 'editorial-serif',
  'serif display': 'editorial-serif',
  'serif headings': 'editorial-serif',
  'serif-logo': 'editorial-serif',
  'geometric sans': 'geometric-sans',
  'geometric-sans': 'geometric-sans',
  'sans-serif display': 'geometric-sans',
  'sans-serif body': 'geometric-sans',
  'sans-serif': 'geometric-sans',
  'technical monospace': 'technical-monospace',
  'monospace metadata': 'technical-monospace',
  'code terminal': 'technical-monospace',
  'bold headline': 'bold-typography',
  'bold headings': 'bold-typography',
  'bold-typography': 'bold-typography',

  // SaaS & UI
  'saas-landing-page': 'saas-interface',
  'saas-landing': 'saas-interface',
  'saas landing page': 'saas-interface',
  'software landing page': 'saas-interface',
  'modern saas': 'saas-interface',
  'modern SaaS': 'saas-interface',
  'saas/b2b': 'saas-interface',
  'saas': 'saas-interface',
  'saas-interface': 'saas-interface',
  'saas hero': 'saas-interface',
  'enterprise-ui': 'saas-interface',
  'enterprise': 'saas-interface',
  'b2b': 'saas-interface',
  'tech-ui': 'saas-interface',
  'corporate ui': 'saas-interface',
  'developer tools': 'developer-platform',
  'developer-platform': 'developer-platform',
  'modern finance': 'fintech-ui',

  // Navigation & Components
  'sidebar-layout': 'sidebar-nav',
  'sidebar navigation': 'sidebar-nav',
  'sidebar-navigation': 'sidebar-nav',
  'sidebar nav': 'sidebar-nav',
  'pill buttons': 'pill-components',
  'pill-button': 'pill-components',
  'pill navigation': 'pill-components',
  'border-radius pill': 'pill-components',
  'rounded-pills': 'pill-components',
  'rounded-containers': 'rounded-containers',
  'rounded containers': 'rounded-containers',
  'rounded-xl': 'rounded-containers',
  'rounded cards': 'rounded-containers',
  'nested-panels': 'nested-panels',
  'card interface': 'nested-panels',
  'layered stack': 'nested-panels',
  'clean-header': 'clean-nav',
  'minimalist nav': 'clean-nav',
  'minimalist-nav': 'clean-nav',
  'minimalist navigation': 'clean-nav',

  // Print & Texture
  '1-bit dither': '1-bit-dither',
  'dither texture': '1-bit-dither',
  '1-bit-dither': '1-bit-dither',
  'stipple art': '1-bit-dither',
  'stippled-texture': '1-bit-dither',
  'halftone dots': 'halftone',
  'halftone': 'halftone',
  'high-contrast': 'high-contrast',
  'high contrast': 'high-contrast',
  'high-contrast CTA': 'high-contrast',

  // AI & Tech
  'ai-interface': 'ai-workspace',
  'ai-workspace': 'ai-workspace',
  'ai prompting': 'ai-workspace',
  'technical ai': 'ai-workspace'
};

export function canonicalizeVocabTag(rawTag) {
  if (!rawTag || typeof rawTag !== 'string') return null;
  const tag = rawTag.trim().toLowerCase();

  // Exclude raw hex codes (e.g., #ffffff, #000008, #111111)
  if (/^#([0-9a-f]{3}){1,2}$/i.test(tag)) return null;

  // Exclude low-value generic words
  if (['clean', 'modern', 'neutral', 'vibrant', 'spacious', 'header', 'navigation', 'hero section'].includes(tag)) return null;

  if (VOCAB_SYNONYMS[tag]) {
    return VOCAB_SYNONYMS[tag];
  }

  // Convert spaces to clean kebab-case
  return tag.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function getClusterVocabulary(library, activeBaseTag, maxCount = 30) {
  const freqMap = {};

  library.forEach(item => {
    const itemClusters = normalizeBaseTags(item.baseTags || [item.category]);
    if (!activeBaseTag || itemClusters.includes(activeBaseTag)) {
      if (Array.isArray(item.tokens)) {
        item.tokens.forEach(tok => {
          const clean = canonicalizeVocabTag(tok);
          if (clean) {
            freqMap[clean] = (freqMap[clean] || 0) + 1;
          }
        });
      }
    }
  });

  return Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxCount)
    .map(entry => entry[0]);
}

export const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      const parts = reader.result.split(',');
      resolve(parts[1] || parts[0]);
    } else {
      reject(new Error('Failed to convert file to base64 string.'));
    }
  };
  reader.onerror = () => reject(new Error('FileReader failed to read selected image file.'));
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

  return `Build a landing page for: "${subject || 'a modern web application'}"

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

export const getDnaSourceUrl = (item) => {
  if (!item) return null;
  if (item.sourceUrl && typeof item.sourceUrl === 'string' && item.sourceUrl.trim()) {
    return item.sourceUrl.trim();
  }
  if (item.cleanUrl && typeof item.cleanUrl === 'string' && item.cleanUrl.startsWith('http')) {
    return item.cleanUrl.trim();
  }
  if (item.imageUrl && typeof item.imageUrl === 'string') {
    const thumMatch = item.imageUrl.match(/https:\/\/image\.thum\.io\/get\/.*?(https?:\/\/[^\s]+)/);
    if (thumMatch && thumMatch[1]) {
      return thumMatch[1].trim();
    }
    const mshotsMatch = item.imageUrl.match(/s0\.wp\.com\/mshots\/v1\/(https?%3A%2F%2F[^\?]+|https?:\/\/[^\?]+)/);
    if (mshotsMatch && mshotsMatch[1]) {
      try {
        return decodeURIComponent(mshotsMatch[1]).trim();
      } catch (e) {
        return mshotsMatch[1].trim();
      }
    }
  }
  return null;
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

  // 1. Primary: Microlink API (Real headless Chrome browser with 2000px height viewport & age-gate bypass)
  try {
    const ageGateHideSelectors = '#shopify-section-age-verification, .shopify-section.age-verification-section, .age-verification-section, #age-gate, .age-gate, .age-gate__backdrop, .age-gate__card, [class*="agegate"], [class*="age-gate"], [id*="age-gate"], [id*="agegate"], [class*="age_verification"], [id*="age_verification"], [class*="cookie-banner"], [id*="cookie-banner"]';
    const clickSelectors = '#age-gate-yes, .age-gate__btn--yes, [id*="age-gate-yes"], [class*="age-gate__btn--yes"]';
    const microlinkEndpoint = `https://api.microlink.io/?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&viewport.width=1280&viewport.height=2000&click=${encodeURIComponent(clickSelectors)}&hide=${encodeURIComponent(ageGateHideSelectors)}`;
    const res = await fetch(microlinkEndpoint);
    if (res.ok) {
      const data = await res.json();
      const screenshotUrl = data?.data?.screenshot?.url;
      if (screenshotUrl) {
        return {
          screenshotUrl,
          title: domain,
          cleanUrl
        };
      }
    }
  } catch (err) {
    console.warn('Microlink capture fallback:', err.message);
  }

  // 2. Secondary: Thum.io with 2000px height crop for full layout capture
  try {
    const thumUrl = `https://image.thum.io/get/width/1200/crop/2000/noanimate/${cleanUrl}`;
    const thumRes = await fetch(thumUrl, { method: 'HEAD' });
    if (thumRes.ok) {
      return {
        screenshotUrl: thumUrl,
        title: domain,
        cleanUrl
      };
    }
  } catch (err) {
    console.warn('Thum.io capture fallback:', err.message);
  }

  // 3. Fallback: WordPress mshots with 2000px height
  const screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=1200&h=2000`;
  return {
    screenshotUrl,
    title: domain,
    cleanUrl
  };
};

export const imageUrlToBase64 = async (imageUrl) => {
  try {
    let res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    let blob = await res.blob();

    // If using mshots and image is small (< 5KB loading placeholder), wait 2s and retry once
    if (imageUrl.includes('mshots') && blob.size < 5000) {
      await new Promise(r => setTimeout(r, 2000));
      res = await fetch(imageUrl);
      if (res.ok) {
        blob = await res.blob();
      }
    }

    const mimeType = blob.type || 'image/jpeg';
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const parts = reader.result.split(',');
          resolve({ base64: parts[1] || parts[0], mimeType });
        } else {
          reject(new Error('FileReader result is not a string.'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error while reading blob.'));
    });
  } catch (err) {
    throw new Error(err.message || 'Unable to fetch image from URL');
  }
};

