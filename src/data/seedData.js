export const INITIAL_LIBRARY = [
  {
    id: '1',
    creativeName: 'Print-Tech Paper',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    summary: 'A tactile, analog-driven interface that feels serious and technical, trading flat SaaS hype for raw engineering credibility.',
    tokens: ['topo-ink', 'sage-ground', 'grotesk-display', 'mono-chips', 'halftone', 'ruler-linework', 'technical-timestamps'],
    baseTags: ['Editorial', 'Mono', 'Textured'],
    recipe: {
      aestheticFamily: 'print-tech x data',
      vocabularyTerms: ['pale sage ground', 'topographic line illustration', 'mono data callouts', 'transaction-id chips', 'grotesk display'],
      feel: 'Serious, confidence-inducing, hyper-technical, tactile, analog-document feel.',
      intent: 'A small team\'s unfair advantage. Raw engineering credibility over standard SaaS hype.',
      alwaysRules: [
        'Solid pale sage ground (#D1DCD2) matching natural paper stock.',
        'Process visual content as topographic line illustrations or dithered grain diagrams.',
        'Apply technical timestamps, marginalia (coordinates, ruler lines), and transaction-ID chips to anchor layout zones.',
        'Use extreme typographic contrasts: monumental display headings or tiny monospaced labeling, nothing in between.'
      ],
      neverRules: [
        'No purple or blue gradient backgrounds.',
        'No glossy 3D blobs, untextured stock photos, or friendly rounded vectors.',
        'No standard feature grid rows or generic system typography.'
      ]
    }
  },
  {
    id: '2',
    creativeName: 'Dither Mono',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    imageUrl: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=600&q=80',
    summary: 'Brutalist-editorial styling characterized by heavy bitmap dither, extreme contrast, and structural dark-mode containers.',
    tokens: ['bitmap-dither', 'stark-dark', 'giant-wordmark', 'clean-sans', 'high-contrast', 'raw-grain', 'asymmetric-grid'],
    baseTags: ['Brutalist', 'Mono', 'Textured'],
    recipe: {
      aestheticFamily: 'brutalist-editorial-mono',
      vocabularyTerms: ['bitmap dither', 'stark studio dark', 'monumental wordmark', 'clean sans', 'high contrast', 'raw grain'],
      feel: 'Aggressive, raw, structural, precise but unpolished.',
      intent: 'Underground authority. High aesthetic confidence for technical or design audiences.',
      alwaysRules: [
        'High-contrast black-and-white palettes.',
        'Convert all secondary elements to heavy, raw 1-bit dithered textures.',
        'Position a giant, cropped wordmark in the footer overlapping the layout boundaries.',
        'Utilize asymmetric grids with clean, rigid borders to divide data panels.'
      ],
      neverRules: [
        'No soft dropshadows, colorful gradients, or friendly cartoon graphics.',
        'No center-aligned conversational body paragraphs.',
        'No soft pastel backgrounds or rounded buttons.'
      ]
    }
  }
];

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

export const compileStitchPrompt = (item, subject) => {
  return `Build a landing page for: "${subject}"

Refer to the structural, aesthetic, and layout rules defined in the DESIGN.md block below to generate the layout components, spacing, typography scale, color rules, and system behavior. Do not use generic system palettes, untextured styling, or rounded-everything elements.

--- START DESIGN.md CONSTRAINTS ---

# Aesthetic Profile: ${item.recipe.aestheticFamily} - ${item.recipe.vocabularyTerms.join(', ')}

## Visual Feel
${item.recipe.feel}

## Intent
${item.recipe.intent}

## Design Rules (Always)
${item.recipe.alwaysRules.map(rule => `- ${rule}`).join('\n')}

## Exclusions (Never)
${item.recipe.neverRules.map(rule => `- ${rule}`).join('\n')}

--- END DESIGN.md CONSTRAINTS ---`;
};

export const compileBrief = (item) => {
  return `# Creative Brief: ${item.creativeName}
    
## Visual Overview
${item.summary}

## Aesthetic Profile
Family: ${item.recipe.aestheticFamily}
Key Tokens: ${item.tokens.join(', ')}

## Strategic Alignment
Intent: ${item.recipe.intent}
Mood & Feel: ${item.recipe.feel}
`;
};

export const fetchUrlScreenshot = async (url) => {
  const target = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(target)}&screenshot=true`);
  if (!response.ok) {
    throw new Error(`Failed to screenshot URL: ${target} (HTTP status ${response.status})`);
  }
  const data = await response.json();
  const screenshotUrl = data?.data?.screenshot?.url;
  if (!screenshotUrl) {
    throw new Error(`Could not generate visual screenshot for ${target}`);
  }
  return {
    screenshotUrl,
    title: data?.data?.title || data?.data?.publisher || new URL(target).hostname
  };
};

export const imageUrlToBase64 = async (imageUrl) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download captured screenshot image.`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const result = reader.result;
      const base64 = typeof result === 'string' ? result.split(',')[1] : '';
      resolve({ base64, mimeType: blob.type || 'image/png' });
    };
    reader.onerror = error => reject(error);
  });
};

