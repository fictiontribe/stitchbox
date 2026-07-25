'use client';

import React, { useState, useMemo, useEffect } from 'react';

import {
  INITIAL_LIBRARY,
  TAG_RELATIONS,
  fileToBase64,
  compileStitchPrompt,
  fetchUrlScreenshot,
  imageUrlToBase64
} from '../data/seedData';

import {
  getAllLibraryItems,
  saveLibraryItem,
  deleteLibraryItem,
  getCustomBaseTags,
  saveCustomBaseTag
} from '../data/dbStorage';

import Header from '../components/Header';
import NoticeBanners from '../components/NoticeBanners';
import DailySpark from '../components/DailySpark';
import TagFilterBar from '../components/TagFilterBar';
import DashboardGrid from '../components/DashboardGrid';
import BlenderConsole from '../components/BlenderConsole';
import DetailModal from '../components/DetailModal';

export default function Home() {
  const [library, setLibrary] = useState([]);
  const [customTags, setCustomTags] = useState([]);
  const [activeBaseTag, setActiveBaseTag] = useState(null);
  const [activeSubTag, setActiveSubTag] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customSubject, setCustomSubject] = useState('an AI analytics platform for small startups');
  const [copiedType, setCopiedType] = useState(null);
  const [blendSlotA, setBlendSlotA] = useState(null);
  const [blendSlotB, setBlendSlotB] = useState(null);
  const [blendedResult, setBlendedResult] = useState(null);
  const [dailySpark, setDailySpark] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedTags = getCustomBaseTags();
      setCustomTags(loadedTags);

      const syncDatabase = async () => {
        try {
          // 1. Fetch local items stored in user's browser IndexedDB
          const localItems = await getAllLibraryItems();

          // 2. Fetch server items stored in Cloudflare KV
          const res = await fetch('/api/library');
          const data = await res.json().catch(() => ({}));
          const serverItems = (data && data.success && Array.isArray(data.items)) ? data.items : [];

          // 3. Merge local + server items so no cards are lost
          const itemMap = new Map();

          if (Array.isArray(localItems)) {
            localItems.forEach(i => { if (i && i.id) itemMap.set(i.id, i); });
          }

          if (Array.isArray(serverItems)) {
            serverItems.forEach(i => { if (i && i.id) itemMap.set(i.id, i); });
          }

          const combined = Array.from(itemMap.values());
          setLibrary(combined);

          // 4. Auto-push any local items to Cloudflare KV so all team members see them immediately
          if (localItems && localItems.length > 0) {
            for (const item of localItems) {
              fetch('/api/library', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
              }).catch(() => {});
            }
          }
        } catch (err) {
          console.error('Failed to sync library database:', err);
        }
      };
      syncDatabase();
    }
  }, []);

  const handleSyncToCloud = async () => {
    setIsSyncingCloud(true);
    setSyncSuccessMsg('');
    try {
      const localItems = await getAllLibraryItems();
      const itemMap = new Map();
      library.forEach(i => { if (i && i.id) itemMap.set(i.id, i); });
      localItems.forEach(i => { if (i && i.id) itemMap.set(i.id, i); });

      const allToSync = Array.from(itemMap.values());

      let count = 0;
      for (const item of allToSync) {
        const res = await fetch('/api/library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (res.ok) count++;
      }

      setSyncSuccessMsg(`Synced ${count} card${count === 1 ? '' : 's'} to Cloud!`);
      setTimeout(() => setSyncSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Manual cloud sync error:", err);
    } finally {
      setIsSyncingCloud(false);
    }
  };

  useEffect(() => {
    generateNewSpark();
  }, []);

  const generateNewSpark = () => {
    const subjects = [
      'a decentralized physical infrastructure protocol',
      'a collaborative editorial editor for long-form writers',
      'a spatial developer environment for VR interfaces',
      'an automated supply-chain accounting engine',
      'a biotech research workflow dashboard for genomic sequencing',
      'a high-frequency algorithmic trading terminal',
      'a minimalist digital design agency portfolio',
      'a real-time AI voice transcription and summarization platform',
      'an open-source developer documentation portal',
      'a climate analytics and carbon offset dashboard'
    ];
    const styles = [
      'Print-Tech Paper styling with topo-ink overlays',
      'Dither Mono raw contrast grid rules',
      'Vast Quiet Cinematic fog borders',
      'Brutalist Monochrome typographic grid layout',
      'Neumorphic Dark Glassmorphism glow effects',
      'Editorial Serif headlines with warm cream background',
      'High-contrast SaaS Dark Mode with neon accents'
    ];

    setDailySpark(prev => {
      let nextSubject, nextStyle;
      do {
        nextSubject = subjects[Math.floor(Math.random() * subjects.length)];
        nextStyle = styles[Math.floor(Math.random() * styles.length)];
      } while (prev && nextSubject === prev.subject && nextStyle === prev.style);
      return { subject: nextSubject, style: nextStyle };
    });
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
    const tagSet = new Set();
    library.forEach(item => {
      if (Array.isArray(item.baseTags)) {
        item.baseTags.forEach(tag => tagSet.add(tag));
      }
    });
    customTags.forEach(tag => tagSet.add(tag));
    if (tagSet.size === 0) {
      Object.keys(TAG_RELATIONS).forEach(tag => tagSet.add(tag));
    }
    return Array.from(tagSet);
  }, [library, customTags]);

  const currentSubTags = useMemo(() => {
    if (!activeBaseTag) return [];
    const tokenSet = new Set();
    library.forEach(item => {
      if (item.baseTags && item.baseTags.includes(activeBaseTag)) {
        if (Array.isArray(item.tokens)) {
          item.tokens.forEach(tok => tokenSet.add(tok));
        }
      }
    });
    if (TAG_RELATIONS[activeBaseTag]) {
      TAG_RELATIONS[activeBaseTag].forEach(tok => tokenSet.add(tok));
    }
    return Array.from(tokenSet);
  }, [library, activeBaseTag]);

  const handleAddCustomTag = (newTag) => {
    const updated = saveCustomBaseTag(newTag);
    setCustomTags(updated);
  };

  const filteredLibrary = useMemo(() => {
    let list = [...library].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    if (activeBaseTag) {
      list = list.filter(item => item.baseTags && item.baseTags.includes(activeBaseTag));
    }
    if (activeSubTag) {
      list = list.filter(item => item.tokens && item.tokens.includes(activeSubTag));
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

  const handleDeleteItem = async (id) => {
    setLibrary(prev => prev.filter(item => item.id !== id));
    await deleteLibraryItem(id);
    fetch('/api/library', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).catch(err => console.error("Failed to delete from Cloudflare KV:", err));

    if (selectedItem?.id === id) setSelectedItem(null);
    if (blendSlotA === id) setBlendSlotA(null);
    if (blendSlotB === id) setBlendSlotB(null);
  };

  const runDnaExtraction = async (rawBase64, mimeType) => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: rawBase64, mimeType })
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

  const processImageFile = async (file) => {
    setIsProcessing(true);
    setApiError(null);

    try {
      const rawBase64 = await fileToBase64(file);
      const persistentImageDataUrl = `data:${file.type || 'image/png'};base64,${rawBase64}`;

      const parsedDNA = await runDnaExtraction(rawBase64, file.type);

      const newDnaItem = {
        id: String(Date.now()),
        creativeName: parsedDNA.creativeName || 'Visual Blueprint',
        uploadedAt: new Date(),
        imageUrl: persistentImageDataUrl,
        summary: parsedDNA.summary,
        tokens: parsedDNA.tokens || [],
        baseTags: parsedDNA.baseTags || ['Textured'],
        recipe: parsedDNA.recipe
      };

      setLibrary(prev => [newDnaItem, ...prev]);
      await saveLibraryItem(newDnaItem);

      // Save item globally to Cloudflare KV
      await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDnaItem)
      }).catch(err => console.error("Failed to save item to Cloudflare KV:", err));

      setSelectedItem(newDnaItem);
    } catch (error) {
      console.error("Upload Parsing Error: ", error);
      setApiError(error);
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
      const { screenshotUrl, title } = await fetchUrlScreenshot(urlInput);
      setUrlInput('');

      let persistentImageUrl = screenshotUrl;
      let base64Data = '';
      let mimeType = 'image/png';

      try {
        const res = await imageUrlToBase64(screenshotUrl);
        base64Data = res.base64;
        mimeType = res.mimeType || 'image/png';
        persistentImageUrl = `data:${mimeType};base64,${base64Data}`;
      } catch (e) {
        console.warn('Could not convert image to base64 data URL, storing CDN URL:', e);
      }

      if (!base64Data) {
        throw {
          title: "Screenshot Capture Error",
          message: `Unable to capture image from ${urlInput}`,
          suggestion: "Try uploading a direct screenshot image file instead."
        };
      }

      const parsedDNA = await runDnaExtraction(base64Data, mimeType);

      const newDnaItem = {
        id: String(Date.now()),
        creativeName: parsedDNA.creativeName || title,
        uploadedAt: new Date(),
        imageUrl: persistentImageUrl,
        summary: parsedDNA.summary,
        tokens: parsedDNA.tokens || [],
        baseTags: parsedDNA.baseTags || ['SaaS/B2B'],
        recipe: parsedDNA.recipe
      };

      setLibrary(prev => [newDnaItem, ...prev]);
      await saveLibraryItem(newDnaItem);

      // Save item globally to Cloudflare KV
      await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDnaItem)
      }).catch(err => console.error("Failed to save item to Cloudflare KV:", err));

      setSelectedItem(newDnaItem);
    } catch (error) {
      console.error("URL Capture Error: ", error);
      setApiError(error);
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

  const handleCopyPrompt = (item) => {
    const text = compileStitchPrompt(item, customSubject);
    if (typeof navigator !== 'undefined') navigator.clipboard.writeText(text);
    setCopiedType('prompt');
    setTimeout(() => setCopiedType(null), 2500);
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

    const blendedDesignSystem = {
      color: {
        primary: colA.primary || '#ffffff',
        secondary: colB.secondary || colA.secondary || '#888888',
        accent: colB.accent || colA.accent || '#6366f1',
        surface: colA.surface || '#0f172a',
        card: colB.card || colA.card || '#1e293b',
        neutralText: colA.neutralText || '#f8fafc'
      },
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
        borderRadius: dsB.shape?.borderRadius || dsA.shape?.borderRadius || '4px',
        borderStyle: dsA.shape?.borderStyle || '1px solid rgba(255,255,255,0.1)'
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

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Full-screen Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-indigo-950/90 border-4 border-dashed border-indigo-400 z-50 flex flex-col items-center justify-center p-8 backdrop-blur-md pointer-events-none transition-all shadow-2xl">
          <div className="bg-indigo-600 text-white p-6 rounded-full shadow-2xl animate-bounce mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white font-display tracking-tight">Drop Website Screenshot Here</h2>
          <p className="text-sm text-indigo-200 mt-2 font-mono">Deconstruct Design DNA automatically with Gemini 2.0 Flash</p>
        </div>
      )}

      <div>
        <Header
          handleFileUpload={handleFileUpload}
          handleUrlIngest={handleUrlIngest}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          isProcessing={isProcessing}
          handleSyncToCloud={handleSyncToCloud}
          isSyncingCloud={isSyncingCloud}
          syncSuccessMsg={syncSuccessMsg}
        />

        <NoticeBanners
          apiError={apiError}
          setApiError={setApiError}
        />

        <DailySpark
          dailySpark={dailySpark}
          generateNewSpark={generateNewSpark}
          onApplySpark={onApplySpark}
        />

        <TagFilterBar
          allBaseTags={allBaseTags}
          activeBaseTag={activeBaseTag}
          activeSubTag={activeSubTag}
          currentSubTags={currentSubTags}
          handleBaseTagClick={handleBaseTagClick}
          setActiveSubTag={setActiveSubTag}
          clearFilters={() => { setActiveBaseTag(null); setActiveSubTag(null); }}
          onAddCustomTag={handleAddCustomTag}
        />

        <DashboardGrid
          filteredLibrary={filteredLibrary}
          isProcessing={isProcessing}
          setSelectedItem={setSelectedItem}
          setBlendSlotA={setBlendSlotA}
          setBlendSlotB={setBlendSlotB}
          handleDeleteItem={handleDeleteItem}
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
      />
    </div>
  );
}
