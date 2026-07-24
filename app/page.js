'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

import {
  INITIAL_LIBRARY,
  TAG_RELATIONS,
  fileToBase64,
  compileStitchPrompt,
  compileBrief,
  fetchUrlScreenshot,
  imageUrlToBase64
} from '../data/seedData';

import {
  getAllLibraryItems,
  saveLibraryItem,
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
  const [library, setLibrary] = useState(INITIAL_LIBRARY);
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
  const [apiKey, setApiKey] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [isCloudManaged, setIsCloudManaged] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('GEMINI_API_KEY') || '';
      setApiKey(savedKey);
      setIsKeySaved(!!savedKey);

      const loadedTags = getCustomBaseTags();
      setCustomTags(loadedTags);

      const syncDatabase = async () => {
        try {
          const storedItems = await getAllLibraryItems();
          if (storedItems && storedItems.length > 0) {
            const storedIds = new Set(storedItems.map(i => i.id));
            const initialRemaining = INITIAL_LIBRARY.filter(i => !storedIds.has(i.id));
            setLibrary([...storedItems, ...initialRemaining]);
          }
        } catch (err) {
          console.error('Failed to load from IndexedDB:', err);
        }
      };
      syncDatabase();

      // Check if Next.js serverless API route endpoint /api/analyze is reachable
      fetch('/api/analyze', { method: 'OPTIONS' })
        .then(res => {
          if (res.status !== 404) setIsCloudManaged(true);
        })
        .catch(() => setIsCloudManaged(false));
    }
  }, []);

  const handleSaveApiKey = (key) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    if (trimmed) {
      if (typeof window !== 'undefined') localStorage.setItem('GEMINI_API_KEY', trimmed);
      setIsKeySaved(true);
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem('GEMINI_API_KEY');
      setIsKeySaved(false);
    }
  };

  const handleClearApiKey = () => {
    setApiKey('');
    if (typeof window !== 'undefined') localStorage.removeItem('GEMINI_API_KEY');
    setIsKeySaved(false);
  };

  useEffect(() => {
    generateNewSpark();
  }, []);

  const generateNewSpark = () => {
    const subjects = [
      'a decentralized physical infrastructure protocol',
      'a collaborative editorial editor for long-form writers',
      'a spatial developer environment for VR interfaces',
      'an automated supply-chain accounting engine'
    ];
    const styles = ['Print-Tech Paper styling with topo-ink overlays', 'Dither Mono raw contrast grid rules', 'Vast Quiet Cinematic fog borders'];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    setDailySpark({ subject: randomSubject, style: randomStyle });
  };

  const allBaseTags = useMemo(() => {
    const defaultKeys = Object.keys(TAG_RELATIONS);
    return [...new Set([...defaultKeys, ...customTags])];
  }, [customTags]);

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

  const runDnaExtraction = async (rawBase64, mimeType) => {
    const systemPrompt = `You are the design intelligence engine for StitchBox. Analyze the uploaded website screenshot and extract its design DNA into a clean JSON object. 

Deconstruct the design into structural, typographic, color, and functional patterns, avoiding generic marketing terms in favor of precise, conventional UX, typography, and design vocabulary.

Generate the output matching this exact JSON schema:
{
  "creativeName": "A synthesized, creative, evocative name for the style (e.g., 'Dither Mono', 'Print-Tech Paper')",
  "summary": "A short, inspired 2-3 sentence summary of the design's overall aesthetic impact and mood",
  "tokens": ["Minimum 6, maximum 12 explicit, lowercase aesthetic tags representing colors, fonts, layouts, and textures used"],
  "baseTags": ["A subset list matching at least one of these exact values: 'Editorial', 'SaaS/B2B', 'Brutalist', 'Consumer', 'Mono', 'Textured'"],
  "recipe": {
    "aestheticFamily": "A 2-word family name (e.g., 'brutalist-editorial', 'clean-minimalism')",
    "vocabularyTerms": ["5 to 8 specific design descriptors"],
    "feel": "The raw sensory feel of the reference design",
    "intent": "The visual purpose or perceived strategic goal of the layout",
    "alwaysRules": ["3-5 concrete layout, color, typography, or styling rules that must always be present to recreate this aesthetic"],
    "neverRules": ["3-5 concrete styling choices, layout patterns, or color treatments to strictly avoid"]
  }
}`;

    // 1. Client-Side API Key execution if user provided local key
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent([
          { inlineData: { data: rawBase64, mimeType: mimeType || 'image/png' } },
          systemPrompt
        ]);

        return JSON.parse(result.response.text());
      } catch (err) {
        console.error("Gemini SDK Client Error:", err);
        const msg = err.message || String(err);
        let title = "API Key Error";
        let suggestion = "Verify your API Key at https://aistudio.google.com/ or check billing status.";
        
        if (msg.includes("API_KEY_INVALID") || msg.includes("400") || msg.includes("403")) {
          title = "Invalid Gemini API Key";
          suggestion = "The API key provided was rejected by Google AI Studio / Vertex. Please check for typos or generate a new key.";
        } else if (msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
          title = "API Rate Limit Exceeded";
          suggestion = "You have hit Google's free tier rate limit. Please wait 60 seconds before trying another upload.";
        }
        
        throw { title, message: msg, suggestion };
      }
    }

    // 2. Next.js Serverless Route execution (/api/analyze)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: rawBase64, mimeType })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.dna) return data.dna;
      }
    } catch (e) {
      console.warn("Next.js Serverless route /api/analyze not available, using fallback.");
    }

    // 3. Fallback Simulation Mode
    return null;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setApiError(null);

    try {
      const rawBase64 = await fileToBase64(file);
      const persistentImageDataUrl = `data:${file.type || 'image/png'};base64,${rawBase64}`;

      const parsedDNA = await runDnaExtraction(rawBase64, file.type);

      if (!parsedDNA) {
        setTimeout(async () => {
          const fallbackItem = {
            id: String(Date.now()),
            creativeName: 'Fallback Blueprint',
            uploadedAt: new Date(),
            imageUrl: persistentImageDataUrl,
            summary: 'A structural layout generated in simulated fallback mode. Enter a Gemini API Key to run live deconstruction.',
            tokens: ['stark-dark', 'minimalism', 'fallback-grid'],
            baseTags: ['Brutalist', 'Mono'],
            recipe: {
              aestheticFamily: 'fallback-simulated',
              vocabularyTerms: ['wireframe guidelines', 'stark layout', 'simple text blocks'],
              feel: 'Basic structural visualization.',
              intent: 'Educational layout representation without active AI interpretation.',
              alwaysRules: ['Maintain flat monochrome structural shapes.', 'Align text labels directly against coordinate markers.'],
              neverRules: ['No complex graphic illustrations.', 'No color gradients.']
            }
          };
          setLibrary(prev => [fallbackItem, ...prev]);
          await saveLibraryItem(fallbackItem);
          setIsProcessing(false);
        }, 1200);
        return;
      }

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
    } catch (error) {
      console.error("Upload Parsing Error: ", error);
      setApiError(error);
    } finally {
      setIsProcessing(false);
    }
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

      const parsedDNA = base64Data ? await runDnaExtraction(base64Data, mimeType) : null;

      if (!parsedDNA) {
        const fallbackItem = {
          id: String(Date.now()),
          creativeName: `${title} Blueprint`,
          uploadedAt: new Date(),
          imageUrl: persistentImageUrl,
          summary: `Visual screenshot captured from ${title} in simulated fallback mode. Enter a Gemini API Key to run live visual deconstruction.`,
          tokens: ['topo-ink', 'minimalism', 'url-capture', 'web-blueprint'],
          baseTags: ['SaaS/B2B', 'Editorial'],
          recipe: {
            aestheticFamily: 'url-capture-simulated',
            vocabularyTerms: ['captured screenshot', 'hero section', 'web typography'],
            feel: 'Direct site capture visualization.',
            intent: `Represent design layout of ${title} without active AI interpretation.`,
            alwaysRules: ['Maintain exact visual layout captured from source site.', 'Extract dominant color palettes.'],
            neverRules: ['No synthetic stock images.', 'No distorted aspect ratios.']
          }
        };
        setLibrary(prev => [fallbackItem, ...prev]);
        await saveLibraryItem(fallbackItem);
        return;
      }

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

  const handleCopyBrief = (item) => {
    const text = compileBrief(item);
    if (typeof navigator !== 'undefined') navigator.clipboard.writeText(text);
    setCopiedType('brief');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const executeBlend = () => {
    if (!blendSlotA || !blendSlotB) return;
    const a = library.find(item => item.id === blendSlotA);
    const b = library.find(item => item.id === blendSlotB);
    if (!a || !b) return;

    const hybridFamily = `${a.recipe.aestheticFamily} x ${b.recipe.aestheticFamily}`;
    const combinedTerms = [...new Set([...a.recipe.vocabularyTerms, ...b.recipe.vocabularyTerms])].slice(0, 7);
    const combinedFeel = `${a.recipe.feel} colliding with ${b.recipe.feel}`;
    const combinedAlways = [...a.recipe.alwaysRules.slice(0, 2), ...b.recipe.alwaysRules.slice(0, 2)];
    const combinedNever = [...a.recipe.neverRules.slice(0, 2), ...b.recipe.neverRules.slice(0, 2)];

    setBlendedResult({
      creativeName: `${a.creativeName} × ${b.creativeName}`,
      recipe: {
        aestheticFamily: hybridFamily,
        vocabularyTerms: combinedTerms,
        feel: combinedFeel,
        intent: `Synthesized design layout blending the intent of both reference frames.`,
        alwaysRules: combinedAlways,
        neverRules: combinedNever
      }
    });
  };

  const clearBlend = () => {
    setBlendSlotA(null);
    setBlendSlotB(null);
    setBlendedResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <div>
        <Header
          apiKey={apiKey}
          saveApiKey={handleSaveApiKey}
          clearApiKey={handleClearApiKey}
          isKeySaved={isKeySaved}
          handleFileUpload={handleFileUpload}
          handleUrlIngest={handleUrlIngest}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          isProcessing={isProcessing}
        />

        <NoticeBanners
          apiError={apiError}
          setApiError={setApiError}
          apiKey={apiKey}
          isCloudManaged={isCloudManaged}
        />

        <DailySpark
          dailySpark={dailySpark}
          generateNewSpark={generateNewSpark}
        />

        <TagFilterBar
          allBaseTags={allBaseTags}
          activeBaseTag={activeBaseTag}
          activeSubTag={activeSubTag}
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
        />
      </div>

      <BlenderConsole
        blendSlotA={blendSlotA}
        blendSlotB={blendSlotB}
        blendedResult={blendedResult}
        library={library}
        executeBlend={executeBlend}
        clearBlend={clearBlend}
      />

      <DetailModal
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        customSubject={customSubject}
        setCustomSubject={setCustomSubject}
        handleCopyBrief={handleCopyBrief}
        handleCopyPrompt={handleCopyPrompt}
        copiedType={copiedType}
        setActiveSubTag={setActiveSubTag}
      />
    </div>
  );
}
