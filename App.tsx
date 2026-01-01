import React, { useState, useEffect } from 'react';
import { ScriptParams, ScriptType, HistoryItem } from './types';
import { generateScript } from './services/geminiService';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import HistoryList from './components/HistoryList';
import { Hexagon, Activity, History } from 'lucide-react';
import { APP_NAME } from './constants';

const App: React.FC = () => {
  // --- App State ---
  const [params, setParams] = useState<ScriptParams>({
    type: ScriptType.FULL,
    title: '',
    hook: '',
    angle: '',
    keywords: '',
    researchMaterial: ''
  });

  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- History State ---
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // --- Effects ---

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('ps_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // API Key Check
    if (!process.env.API_KEY) {
      setError("CRITICAL SYSTEM ERROR: API_KEY is missing from environment variables.");
    }
  }, []);

  // --- Handlers ---

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent('');

    try {
      const result = await generateScript(params);
      setGeneratedContent(result);

      // Save to History (Only if it's a Script)
      if (params.type !== ScriptType.RESEARCH_GUIDE) {
        const newItem: HistoryItem = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          params: { ...params }, // Copy params
          content: result
        };

        setHistory(prev => {
          const updated = [newItem, ...prev].slice(0, 50); // Limit to 50 items
          localStorage.setItem('ps_history', JSON.stringify(updated));
          return updated;
        });
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setParams(item.params);
    setGeneratedContent(item.content);
    setIsHistoryOpen(false);
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('ps_history', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-ps-bg text-ps-text font-sans selection:bg-ps-accent selection:text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-ps-border bg-ps-bg/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hexagon className="text-ps-accent" size={24} strokeWidth={1.5} />
            <h1 className="font-mono text-lg font-bold tracking-[0.2em] text-ps-text">
              {APP_NAME}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-ps-muted hidden md:flex">
              <Activity size={14} className={isLoading ? "animate-pulse text-ps-accent" : ""} />
              <span className={isLoading ? "text-ps-accent" : ""}>
                {isLoading ? "SYSTEM ACTIVE" : "SYSTEM READY"}
              </span>
            </div>

            <div className="h-4 w-px bg-ps-border hidden md:block"></div>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-ps-muted hover:text-ps-accent transition-colors bg-ps-panel border border-ps-border px-3 py-1.5 rounded"
            >
              <History size={14} />
              <span className="hidden sm:inline">Memory</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-hidden flex flex-col md:flex-row gap-6 relative">

        {/* Left Column: Input */}
        <div className="w-full md:w-1/3 lg:w-1/4 min-w-[300px] flex-shrink-0 h-full">
          <InputForm
            params={params}
            setParams={setParams}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column: Output */}
        <div className="flex-1 h-full min-w-0">
          <OutputDisplay content={generatedContent} isLoading={isLoading} />
        </div>

        {/* History Sidebar Overlay */}
        <HistoryList
          history={history}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelect={handleRestoreHistory}
          onDelete={handleDeleteHistory}
        />

        {/* Backdrop for history sidebar on mobile */}
        {isHistoryOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsHistoryOpen(false)}
          />
        )}
      </main>

      {/* Global Error Toast */}
      {error && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-ps-panel border border-ps-error/50 text-ps-error px-6 py-4 rounded shadow-2xl flex items-center gap-4 z-50 max-w-lg w-full mx-4">
          <div className="w-2 h-2 bg-ps-error rounded-full animate-pulse"></div>
          <p className="text-sm font-mono flex-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs uppercase hover:text-ps-text transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default App;