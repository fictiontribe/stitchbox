'use client';

import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Check saved session passcode on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('stitchbox_admin_passcode');
    if (saved) {
      verifyPasscode(saved, true);
    }
  }, []);

  const verifyPasscode = async (codeToVerify, silent = false) => {
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: codeToVerify })
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('stitchbox_admin_passcode', codeToVerify);
        fetchLibraryItems(codeToVerify);
      } else {
        if (!silent) {
          setError(data.error || 'Incorrect passcode');
        } else {
          sessionStorage.removeItem('stitchbox_admin_passcode');
        }
      }
    } catch (err) {
      if (!silent) setError('Connection error verifying passcode');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    verifyPasscode(passcode);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    sessionStorage.removeItem('stitchbox_admin_passcode');
  };

  const fetchLibraryItems = async (savedCode) => {
    setLoading(true);
    try {
      const res = await fetch('/api/library');
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Failed to fetch library items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    const activeCode = passcode || sessionStorage.getItem('stitchbox_admin_passcode');
    setDeletingId(id);
    try {
      const res = await fetch('/api/library', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': activeCode
        },
        body: JSON.stringify({ id })
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setItems(data.items || items.filter(i => i.id !== id));
        setToastMessage('Entry deleted successfully from Cloudflare KV');
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        alert(data.error || 'Failed to delete entry');
      }
    } catch (err) {
      alert('Error deleting entry: ' + err.message);
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  const filteredItems = items.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.creativeName && item.creativeName.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.summary && item.summary.toLowerCase().includes(q)) ||
      (item.id && item.id.includes(q))
    );
  });

  // Passcode Gate View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono font-bold text-lg">
              🔒
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-white tracking-tight">StitchBox Admin</h1>
              <p className="text-xs font-mono text-slate-400">Restricted Management Console</p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all font-mono"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-rose-950/50 border border-rose-800/80 rounded-xl p-3 text-xs text-rose-300 font-mono flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !passcode.trim()}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs uppercase tracking-wider font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-950/50"
            >
              {isVerifying ? 'Verifying...' : 'Unlock Console'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Console View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-30 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-mono">
            ← Back to App
          </a>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-base font-bold font-display text-white tracking-tight">STITCHBOX // ADMIN CONSOLE</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            Total Entries: <strong className="text-emerald-400">{items.length}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-900/50"
          >
            🔒 Lock Console
          </button>
        </div>
      </header>

      {/* Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-950/90 border-b border-emerald-800/80 px-6 py-3 text-xs text-emerald-300 font-mono flex items-center justify-between sticky top-[65px] z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span>✓</span> {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-emerald-200">✕</button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold font-display text-white">Cloudflare KV Database Entries</h2>
            <p className="text-xs text-slate-400 font-mono mt-1">Manage, inspect, or delete entries directly from production storage.</p>
          </div>

          <div className="w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, or ID..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-20 font-mono text-slate-400 text-xs">
            Fetching entries from Cloudflare KV...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-8">
            <p className="text-sm font-mono text-slate-400">No entries found in Cloudflare KV storage.</p>
          </div>
        )}

        {/* Entry Grid */}
        {!loading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Preview */}
                  <div className="relative h-44 bg-slate-950 overflow-hidden border-b border-slate-800">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.creativeName || 'Entry'}
                        className="w-full h-full object-cover object-top opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700 font-mono text-xs">
                        No Preview Image
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                      {item.category || item.baseTags?.[0] || 'Uncategorized'}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-white font-display line-clamp-1 mb-1">
                      {item.creativeName || 'Untitled Entry'}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans line-clamp-2 mb-4 leading-relaxed">
                      {item.summary || 'No summary description provided.'}
                    </p>

                    <div className="space-y-1.5 font-mono text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">ID:</span>
                        <span className="text-slate-300 font-semibold">{item.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Uploaded:</span>
                        <span className="text-slate-300">
                          {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 pt-0">
                  {deleteConfirmId === item.id ? (
                    <div className="bg-rose-950/80 border border-rose-800 rounded-xl p-3 text-xs space-y-2">
                      <p className="font-mono text-rose-200 text-center font-bold">Confirm delete this entry?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deletingId === item.id}
                          className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[11px] font-bold py-2 rounded-lg transition-colors text-center"
                        >
                          {deletingId === item.id ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] py-2 rounded-lg transition-colors text-center"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="w-full bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-900/50 hover:border-rose-700 font-mono text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Entry
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
