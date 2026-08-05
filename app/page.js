'use client';

import React, { useState, useMemo, useEffect } from 'react';

import {
  CANONICAL_BASE_TAGS,
  normalizeBaseTags,
  getClusterVocabulary,
  canonicalizeVocabTag,
  fileToBase64,
  compileStitchPrompt,
  fetchUrlScreenshot,
  imageUrlToBase64,
  compressImageDataUrl
} from '../data/seedData';

import { INITIAL_LIBRARY } from '../data/initialLibrary';

import {
  getCustomBaseTags,
  saveCustomBaseTag
} from '../data/dbStorage';

import { synthesizeSixColorPalette } from '../lib/colorSynthesis';

import Header from '../components/Header';
import NoticeBanners from '../components/NoticeBanners';
import DailySpark from '../components/DailySpark';
import TagFilterBar from '../components/TagFilterBar';
import DashboardGrid from '../components/DashboardGrid';
import BlenderConsole from '../components/BlenderConsole';
import DetailModal from '../components/DetailModal';
import BookmarkletModal from '../components/BookmarkletModal';
import Footer from '../components/Footer';

export default function Home() {
  // Start instantly with INITIAL_LIBRARY seed cards so 20 cards load on frame 1 (0ms blank page!)
  const [library, setLibrary] = useState(INITIAL_LIBRARY);
  const [isSyncingKV, setIsSyncingKV] = useState(true);
  const [customTags, setCustomTags] = useState([]);
  const [activeBaseTag, setActiveBaseTag] = useState(null);
  const [activeSubTag, setActiveSubTag] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customSubject, setCustomSubject] = useState('');
  const [copiedType, setCopiedType] = useState(null);
  const [blendSlotA, setBlendSlotA] = useState(null);
  const [blendSlotB, setBlendSlotB] = useState(null);
  const [blendedResult, setBlendedResult] = useState(null);
  const [dailySpark, setDailySpark] = useState(null);
  const [sparkHistory, setSparkHistory] = useState([]);
  const [isSparkLoading, setIsSparkLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isBookmarkletOpen, setIsBookmarkletOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedTags = getCustomBaseTags();
      setCustomTags(loadedTags);

      // Hydrate immediately from localStorage client cache if available
      try {
        const cached = localStorage.getItem('stitchbox_library_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLibrary(parsed);
          }
        }
      } catch (err) {
        console.warn('LocalStorage cache read error:', err);
      }

      // Check URL query parameters for ?addUrl= or ?url= from 1-click Bookmarklet
      const params = new URLSearchParams(window.location.search);
      const urlToAdd = params.get('addUrl') || params.get('url');
      if (urlToAdd) {
        setUrlInput(urlToAdd);
        window.history.replaceState({}, document.title, window.location.pathname);
        triggerBookmarkletIngest(urlToAdd);
      }

      // Load native shared board items from Cloudflare KV in the background
      const fetchCloudLibrary = async () => {
        setIsSyncingKV(true);
        try {
          const res = await fetch('/api/library');
          const data = await res.json().catch(() => ({}));
          if (data && data.success && Array.isArray(data.items) && data.items.length > 0) {
            setLibrary(data.items);
            try {
              localStorage.setItem('stitchbox_library_cache', JSON.stringify(data.items));
            } catch (e) {}
          }
        } catch (err) {
          console.error('Failed to fetch Cloud library:', err);
        } finally {
          setIsSyncingKV(false);
        }
      };
      fetchCloudLibrary();
    }
  }, []);

  const triggerBookmarkletIngest = async (targetUrl) => {
    setIsProcessing(true);
    setApiError(null);

    try {
      const { screenshotUrl, title } = await fetchUrlScreenshot(targetUrl);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: screenshotUrl })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success || !data.dna) {
        throw new Error(data.error || `Server HTTP ${response.status} Error`);
      }

      const parsedDNA = data.dna;
      const newDnaItem = {
        id: String(Date.now()),
        creativeName: parsedDNA.creativeName || title,
        uploadedAt: new Date(),
        imageUrl: screenshotUrl,
        sourceUrl: targetUrl,
        summary: parsedDNA.summary,
        tokens: parsedDNA.tokens || [],
        baseTags: parsedDNA.baseTags || ['Website'],
        recipe: parsedDNA.recipe,
        category: parsedDNA.category || 'Website'
      };

      await saveToCloudNative(newDnaItem);
      setSelectedItem(newDnaItem);
    } catch (error) {
      console.error("Bookmarklet Ingest Error: ", error);
      setApiError({
        title: "Bookmarklet Analysis Error",
        message: error.message || "Failed to analyze URL from bookmarklet.",
        suggestion: "Ensure the URL is publicly accessible."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    generateNewSpark();
  }, []);

  const generateNewSpark = async () => {
    setIsSparkLoading(true);

    const fallbackSubjects = [
      'a cybernetic fungal mycorrhizal network dashboard',
      'an orbital space debris salvage logistics terminal',
      'a bio-luminescent deep sea ambient sound synth',
      'a tactile papercraft vinyl record archival portal',
      'an autonomous drone swarm choreography interface',
      'a quantum state superposition debug terminal',
      'a retro-futuristic arcade flight simulator configuration suite',
      'a geothermal volcanic energy distribution grid',
      'a holographic spatial computing volumetric renderer',
      'an exoplanet atmospheric spectroscopy analyzer',
      'a brutalist concrete architectural structural simulator',
      'a synthetic biology microbiome gene sequencer',
      'a high-frequency algorithmic liquidity trading terminal',
      'a vintage modular analog synthesizer patching suite',
      'a kinetic sculpture horology clockwork CAD',
      'a paleontology ice core climate analytics console',
      'an urban guerilla micro-agriculture monitor',
      'an algorithmic generative textile weaving studio',
      'a decentralized physical infrastructure protocol',
      'a spatial developer environment for VR interfaces',
      'a biotech research workflow dashboard for genomic sequencing'
    ];
    const fallbackStyles = [
      'Dithered Monochromatic Wireframe with Neon Cyan Accents',
      'Print-Tech Paper styling with topo-ink overlays',
      'Vast Quiet Cinematic fog borders',
      'Brutalist Monochrome typographic grid layout',
      'Neumorphic Glassmorphism glow effects',
      'Editorial Serif headlines with warm cream background',
      'High-contrast SaaS Light Mode with vibrant accents',
      'Industrial Tactical Monochrome with high-visibility yellow highlights',
      'Retro-Futuristic CRT Raster phosphor glow',
      'Bauhaus Minimalist geometric primary color blocking'
    ];

    try {
      const res = await fetch('/api/spark', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ previousSubjects: sparkHistory })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.spark && data.spark.subject) {
          setDailySpark(data.spark);
          setCustomSubject(data.spark.subject);
          setSparkHistory(prev => [...prev.slice(-20), data.spark.subject]);
          setIsSparkLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch spark from Gemini, using fallback", err);
    }

    let nextSubject, nextStyle;
    let attempts = 0;
    do {
      nextSubject = fallbackSubjects[Math.floor(Math.random() * fallbackSubjects.length)];
      nextStyle = fallbackStyles[Math.floor(Math.random() * fallbackStyles.length)];
      attempts++;
    } while (attempts < 20 && (sparkHistory.includes(nextSubject) || (dailySpark && nextSubject === dailySpark.subject)));

    const newSpark = { subject: nextSubject, style: nextStyle };
    setDailySpark(newSpark);
    setCustomSubject(nextSubject);
    setSparkHistory(prev => [...prev.slice(-20), nextSubject]);
    setIsSparkLoading(false);
  };

  const onApplySpark = () => {
    if (dailySpark?.subject) {
      if (dailySpark.style) {
        setCustomSubject(`${dailySpark.subject} using ${dailySpark.style}`);
      } else {
        setCustomSubject(dailySpark.subject);
      }
    }
  };

  const allBaseTags = useMemo(() => {
    // Guaranteed max 8 canonical Base Tags
    return CANONICAL_BASE_TAGS;
  }, []);

  const currentSubTags = useMemo(() => {
    // Guaranteed max 30 clean, ranked vocabulary tags per base cluster
    return getClusterVocabulary(library, activeBaseTag, 30);
  }, [library, activeBaseTag]);

  const handleAddCustomTag = (newTag) => {
    const updated = saveCustomBaseTag(newTag);
    setCustomTags(updated);
  };

  const filteredLibrary = useMemo(() => {
    let list = [...library].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    if (activeBaseTag) {
      list = list.filter(item => {
        const itemClusters = normalizeBaseTags(item.baseTags || [item.category]);
        return itemClusters.includes(activeBaseTag);
      });
    }
    if (activeSubTag) {
      list = list.filter(item => {
        if (!Array.isArray(item.tokens)) return false;
        return item.tokens.some(tok => canonicalizeVocabTag(tok) === activeSubTag || tok === activeSubTag);
      });
    }
    return list;
  }, [library, activeBaseTag, activeSubTag]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.relatedTarget === null || (e.currentTarget && !e.currentTarget.contains(e.relatedTarget))) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        await processImageFile(file);
      } else {
        setApiError({
          title: "Invalid File Type",
          message: "Please drop an image file (PNG, JPG, WEBP).",
          suggestion: "Take a screenshot of a website and drop the image file directly onto the board."
        });
      }
    }
  };

  const runDnaExtraction = async (rawBase64, mimeType) => {
    const existingItems = library.map(item => ({
      creativeName: item.creativeName,
      summary: item.summary,
      tokens: item.tokens,
      baseTags: item.baseTags
    }));

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: rawBase64, mimeType, existingItems })
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success && data.dna) {
      return data.dna;
    }

    const errMsg = data.error || `Server HTTP ${response.status} Error`;
    throw {
      title: "Gemini Analysis Error",
      message: errMsg,
      suggestion: "Set GEMINI_API_KEY in Cloudflare Pages (Settings -> Environment Variables) or in .env.local for local development."
    };
  };

  const saveToCloudNative = async (item) => {
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success && Array.isArray(data.items)) {
        setLibrary(data.items);
      } else {
        setLibrary(prev => [item, ...prev.filter(i => i.id !== item.id)]);
      }
    } catch (err) {
      console.error("Native Cloud Save Error:", err);
      setLibrary(prev => [item, ...prev.filter(i => i.id !== item.id)]);
    }
  };

  const processImageFile = async (file) => {
    setIsProcessing(true);
    setApiError(null);

    try {
      const rawBase64 = await fileToBase64(file);
      const rawDataUrl = `data:${file.type || 'image/png'};base64,${rawBase64}`;
      const persistentImageDataUrl = await compressImageDataUrl(rawDataUrl);

      const parsedDNA = await runDnaExtraction(rawBase64, file.type);

      const newDnaItem = {
        id: String(Date.now()),
        creativeName: parsedDNA.creativeName || 'Visual Blueprint',
        uploadedAt: new Date(),
        imageUrl: persistentImageDataUrl,
        summary: parsedDNA.summary,
        tokens: parsedDNA.tokens || [],
        baseTags: parsedDNA.baseTags || ['Graphics'],
        recipe: parsedDNA.recipe,
        category: parsedDNA.category || 'Graphics'
      };

      await saveToCloudNative(newDnaItem);
      setSelectedItem(newDnaItem);
    } catch (error) {
      console.error("Upload Parsing Error: ", error);
      setApiError({
        title: "Image Analysis Error",
        message: error.message || "Failed to parse image file.",
        suggestion: "Ensure GEMINI_API_KEY is configured in Cloudflare or .env.local and retry."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) await processImageFile(file);
  };

  const handleUrlIngest = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsProcessing(true);
    setApiError(null);

    try {
      const { screenshotUrl, title, cleanUrl } = await fetchUrlScreenshot(urlInput);
      setUrlInput('');

      const existingItems = library.map(item => ({
        creativeName: item.creativeName,
        summary: item.summary,
        tokens: item.tokens,
        baseTags: item.baseTags
      }));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: screenshotUrl, existingItems })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success || !data.dna) {
        const errMsg = data.error || `Server HTTP ${response.status} Error`;
        throw new Error(errMsg);
      }

      const parsedDNA = data.dna;

      const newDnaItem = {
        id: String(Date.now()),
        creativeName: parsedDNA.creativeName || title,
        uploadedAt: new Date(),
        imageUrl: screenshotUrl,
        sourceUrl: cleanUrl,
        summary: parsedDNA.summary,
        tokens: parsedDNA.tokens || [],
        baseTags: parsedDNA.baseTags || ['Website'],
        recipe: parsedDNA.recipe,
        category: parsedDNA.category || 'Website'
      };

      await saveToCloudNative(newDnaItem);
      setSelectedItem(newDnaItem);
    } catch (error) {
      console.error("URL Capture Error: ", error);
      setApiError({
        title: "URL Analysis Error",
        message: error.message || "Failed to capture and analyze URL screenshot.",
        suggestion: "Try uploading a direct screenshot image file instead."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBaseTagClick = (tag) => {
    if (activeBaseTag === tag) {
      setActiveBaseTag(null);
      setActiveSubTag(null);
    } else {
      setActiveBaseTag(tag);
      setActiveSubTag(null);
    }
  };

  const executeBlend = () => {
    if (!blendSlotA || !blendSlotB) return;
    const a = library.find(item => item.id === blendSlotA);
    const b = library.find(item => item.id === blendSlotB);
    if (!a || !b) return;

    const dsA = a.recipe?.designSystem || {};
    const dsB = b.recipe?.designSystem || {};
    const colA = dsA.color || {};
    const colB = dsB.color || {};
    const typA = dsA.typography || {};
    const typB = dsB.typography || {};

    const hybridFamily = `${a.recipe.aestheticFamily} × ${b.recipe.aestheticFamily}`;
    const combinedTerms = [...new Set([...a.recipe.vocabularyTerms, ...b.recipe.vocabularyTerms])].slice(0, 7);
    const combinedFeel = `${a.recipe.feel} colliding with ${b.recipe.feel}`;
    const combinedAlways = [...a.recipe.alwaysRules.slice(0, 2), ...b.recipe.alwaysRules.slice(0, 2)];
    const combinedNever = [...a.recipe.neverRules.slice(0, 2), ...b.recipe.neverRules.slice(0, 2)];

    // Synthesize a harmonious 6-color palette
    const synthesizedColors = synthesizeSixColorPalette(colA, colB);

    const blendedDesignSystem = {
      color: synthesizedColors,
      typography: {
        headingFont: `${typA.headingFont || 'Display'} / ${typB.headingFont || 'Sans'}`,
        bodyFont: typB.bodyFont || typA.bodyFont || 'Inter',
        scaleRatio: '1.33',
        letterSpacing: typA.letterSpacing || 'normal'
      },
      spacing: {
        baseUnit: dsA.spacing?.baseUnit || '8px',
        density: 'comfortable'
      },
      shape: {
        borderRadius: dsB.shape?.borderRadius || dsA.shape?.borderRadius || '8px',
        borderStyle: dsA.shape?.borderStyle || '1px solid rgba(0,0,0,0.1)'
      }
    };

    const blendedVisualEffects = {
      glassmorphism: {
        enabled: a.recipe?.visualEffects?.glassmorphism?.enabled || b.recipe?.visualEffects?.glassmorphism?.enabled || false,
        blurRadius: '12px',
        transparency: '0.85'
      },
      textureField: {
        enabled: true,
        type: `${a.recipe?.visualEffects?.textureField?.type || 'none'} + ${b.recipe?.visualEffects?.textureField?.type || 'none'}`
      },
      renderingTier: 'medium'
    };

    setBlendedResult({
      creativeName: `${a.creativeName} × ${b.creativeName}`,
      recipe: {
        aestheticFamily: hybridFamily,
        vocabularyTerms: combinedTerms,
        feel: combinedFeel,
        intent: `Synthesized multi-dimensional design layout blending color swatches, typography, and visual rules of both frames.`,
        alwaysRules: combinedAlways,
        neverRules: combinedNever,
        designSystem: blendedDesignSystem,
        visualEffects: blendedVisualEffects
      }
    });
  };
  const clearBlend = () => {
    setBlendSlotA(null);
    setBlendSlotB(null);
    setBlendedResult(null);
  };

  const [modalPromptMode, setModalPromptMode] = useState('standard');

  const handleOpenOverdrive = (item) => {
    setSelectedItem(item);
    setModalPromptMode('overdrive');
  };

  const handleOpenImagePrompt = (item) => {
    setSelectedItem(item);
    setModalPromptMode('image');
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setModalPromptMode('standard');
  };

  const handleCopyPrompt = (item, textOverride) => {
    const text = textOverride || compileStitchPrompt(item, customSubject);
    if (typeof navigator !== 'undefined') navigator.clipboard.writeText(text);
    setCopiedType('prompt');
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white flex flex-col justify-between relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Full-screen Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-indigo-50/95 border-4 border-dashed border-indigo-500 z-50 flex flex-col items-center justify-center p-8 backdrop-blur-md pointer-events-none transition-all shadow-2xl">
          <div className="bg-indigo-600 text-white p-6 rounded-full shadow-2xl animate-bounce mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display tracking-tight">Drop Website Screenshot Here</h2>
          <p className="text-sm text-indigo-700 mt-2 font-mono font-semibold">Deconstruct Design DNA automatically with Gemini Flash</p>
        </div>
      )}

      <div>
        <Header
          handleFileUpload={handleFileUpload}
          handleUrlIngest={handleUrlIngest}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          isProcessing={isProcessing}
          onOpenBookmarklet={() => setIsBookmarkletOpen(true)}
        />

        <NoticeBanners
          apiError={apiError}
          setApiError={setApiError}
        />

        <DailySpark
          dailySpark={dailySpark}
          generateNewSpark={generateNewSpark}
          isSparkLoading={isSparkLoading}
        />

        <TagFilterBar
          allBaseTags={allBaseTags}
          activeBaseTag={activeBaseTag}
          activeSubTag={activeSubTag}
          currentSubTags={currentSubTags}
          handleBaseTagClick={handleBaseTagClick}
          setActiveSubTag={setActiveSubTag}
          clearFilters={() => { setActiveBaseTag(null); setActiveSubTag(null); }}
        />

        <DashboardGrid
          filteredLibrary={filteredLibrary}
          isProcessing={isProcessing}
          setSelectedItem={handleSelectItem}
          setOpenOverdrive={handleOpenOverdrive}
          setOpenImagePrompt={handleOpenImagePrompt}
          setBlendSlotA={setBlendSlotA}
          setBlendSlotB={setBlendSlotB}
        />
      </div>

      <BlenderConsole
        blendSlotA={blendSlotA}
        blendSlotB={blendSlotB}
        blendedResult={blendedResult}
        library={library}
        executeBlend={executeBlend}
        clearBlend={clearBlend}
        customSubject={customSubject}
        setCustomSubject={setCustomSubject}
      />

      <DetailModal
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        customSubject={customSubject}
        setCustomSubject={setCustomSubject}
        handleCopyPrompt={handleCopyPrompt}
        copiedType={copiedType}
        setActiveSubTag={setActiveSubTag}
        initialPromptMode={modalPromptMode}
      />

      <BookmarkletModal
        isOpen={isBookmarkletOpen}
        onClose={() => setIsBookmarkletOpen(false)}
      />

      <Footer />
    </div>
  );
}
