import React from 'react';
import { ScriptParams, ScriptType } from '../types';
import { Settings2, Type, Anchor, Compass, Key, BookOpen, FileText } from 'lucide-react';

interface InputFormProps {
  params: ScriptParams;
  setParams: React.Dispatch<React.SetStateAction<ScriptParams>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ params, setParams, onGenerate, isLoading }) => {

  const handleChange = (field: keyof ScriptParams, value: string) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Check if the input contains the bulk format identifiers
    // We look for 'Hook:' and 'Angle:'/'Reframe:' as strong indicators of the specific template
    const isBulkPaste = /Hook:/i.test(value) && (/(?:Angle|Reframe):/i.test(value));

    if (isBulkPaste) {
      const newParams: Partial<ScriptParams> = {};

      // Robust Regex Parsing
      // 1. Matches "Topic:" or "Title:" label
      // 2. Captures content non-greedily
      // 3. Stops looking when it sees another keyword (Hook, Angle, Keywords) or End of String
      // Note: (?=\s*...) allows for spaces or newlines before the next keyword
      const topicMatch = value.match(/(?:Topic|Title):\s*([\s\S]*?)(?=\s*(?:Hook|Angle|Reframe|Keywords)|$)/i);
      const hookMatch = value.match(/Hook:\s*([\s\S]*?)(?=\s*(?:Topic|Title|Angle|Reframe|Keywords)|$)/i);
      const angleMatch = value.match(/(?:Angle|Reframe):\s*([\s\S]*?)(?=\s*(?:Topic|Title|Hook|Keywords)|$)/i);
      const keywordsMatch = value.match(/Keywords:\s*([\s\S]*?)(?=\s*(?:Topic|Title|Hook|Angle|Reframe)|$)/i);

      if (topicMatch && topicMatch[1]) {
        // Success: We found a title. Set ONLY the extracted title.
        newParams.title = topicMatch[1].trim();
      } else {
        // Fallback: If it looks like a bulk paste but we couldn't find "Topic:" specifically,
        // we leave the value as is to prevent data loss, or user might be pasting without the "Topic:" label.
        newParams.title = value;
      }

      if (hookMatch && hookMatch[1]) newParams.hook = hookMatch[1].trim();
      if (angleMatch && angleMatch[1]) newParams.angle = angleMatch[1].trim();
      if (keywordsMatch && keywordsMatch[1]) newParams.keywords = keywordsMatch[1].trim();

      // Batch update the state
      setParams(prev => ({ ...prev, ...newParams }));
    } else {
      // Standard input behavior
      handleChange('title', value);
    }
  };

  const isResearchMode = params.type === ScriptType.RESEARCH_GUIDE;

  // Validation logic
  const isValid = isResearchMode
    ? !!params.title
    : !!params.researchMaterial && params.researchMaterial.trim().length > 0;

  return (
    <div className="bg-ps-panel border border-ps-border rounded-lg p-6 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-6 text-ps-accent">
        <Settings2 size={20} />
        <h2 className="font-mono text-sm tracking-widest uppercase font-semibold">Configuration</h2>
      </div>

      <div className="space-y-5 flex-1 flex flex-col">
        {/* Script Type Selector */}
        <div className="flex bg-ps-bg p-1 rounded-md border border-ps-border shrink-0">
          <button
            onClick={() => handleChange('type', ScriptType.RESEARCH_GUIDE)}
            className={`flex-1 py-2 text-[10px] md:text-xs font-mono uppercase tracking-wide rounded transition-all ${params.type === ScriptType.RESEARCH_GUIDE
                ? 'bg-ps-border text-white shadow-sm'
                : 'text-ps-muted hover:text-ps-text'
              }`}
          >
            Research Guide
          </button>
          <button
            onClick={() => handleChange('type', ScriptType.FULL)}
            className={`flex-1 py-2 text-[10px] md:text-xs font-mono uppercase tracking-wide rounded transition-all ${params.type === ScriptType.FULL
                ? 'bg-ps-border text-white shadow-sm'
                : 'text-ps-muted hover:text-ps-text'
              }`}
          >
            Full Script
          </button>
          <button
            onClick={() => handleChange('type', ScriptType.SHORT)}
            className={`flex-1 py-2 text-[10px] md:text-xs font-mono uppercase tracking-wide rounded transition-all ${params.type === ScriptType.SHORT
                ? 'bg-ps-border text-white shadow-sm'
                : 'text-ps-muted hover:text-ps-text'
              }`}
          >
            Short Script
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 flex-1 flex flex-col">
          {isResearchMode ? (
            /* Research Guide Inputs */
            <>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-xs font-mono text-ps-muted uppercase">
                  <Type size={12} /> Title / Topic
                </label>
                <input
                  type="text"
                  value={params.title}
                  onChange={handleTitleChange}
                  placeholder="Paste formatted topic here or type..."
                  className="w-full bg-ps-bg border border-ps-border rounded px-3 py-2 text-sm text-ps-text focus:outline-none focus:border-ps-accent focus:ring-1 focus:ring-ps-accent transition-colors placeholder-ps-muted/30"
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-xs font-mono text-ps-muted uppercase">
                  <Anchor size={12} /> The Hook / Tension
                </label>
                <textarea
                  value={params.hook}
                  onChange={(e) => handleChange('hook', e.target.value)}
                  placeholder="e.g. Silence isn't absence, it's processing..."
                  rows={2}
                  className="w-full bg-ps-bg border border-ps-border rounded px-3 py-2 text-sm text-ps-text focus:outline-none focus:border-ps-accent focus:ring-1 focus:ring-ps-accent transition-colors placeholder-ps-muted/30 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-xs font-mono text-ps-muted uppercase">
                  <Compass size={12} /> Angle / Reframe
                </label>
                <textarea
                  value={params.angle}
                  onChange={(e) => handleChange('angle', e.target.value)}
                  placeholder="e.g. Reframe isolation as input management..."
                  rows={2}
                  className="w-full bg-ps-bg border border-ps-border rounded px-3 py-2 text-sm text-ps-text focus:outline-none focus:border-ps-accent focus:ring-1 focus:ring-ps-accent transition-colors placeholder-ps-muted/30 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-xs font-mono text-ps-muted uppercase">
                  <Key size={12} /> Keywords
                </label>
                <input
                  type="text"
                  value={params.keywords}
                  onChange={(e) => handleChange('keywords', e.target.value)}
                  placeholder="e.g. System 2, Dopamine, Regulation"
                  className="w-full bg-ps-bg border border-ps-border rounded px-3 py-2 text-sm text-ps-text focus:outline-none focus:border-ps-accent focus:ring-1 focus:ring-ps-accent transition-colors placeholder-ps-muted/30"
                />
              </div>
            </>
          ) : (
            /* Script Generation Input - Research Material ONLY */
            <div className="space-y-1 pt-2 flex-1 flex flex-col min-h-0">
              <label className="flex items-center gap-2 text-xs font-mono text-ps-accent uppercase tracking-wide">
                <BookOpen size={12} /> Research Material (Filtered DOCX)
              </label>
              <textarea
                value={params.researchMaterial}
                onChange={(e) => handleChange('researchMaterial', e.target.value)}
                placeholder="Paste the complete text from your filtered research document here..."
                className="w-full flex-1 bg-ps-bg border border-ps-border rounded px-3 py-2 text-xs text-ps-text focus:outline-none focus:border-ps-accent focus:ring-1 focus:ring-ps-accent transition-colors placeholder-ps-muted/30 resize-none font-mono"
              />
              <p className="text-[10px] text-ps-muted/70 shrink-0">
                Paste the filtered NotebookLM output here. The engine will extract the title, hook, and mechanisms automatically.
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 shrink-0">
          <button
            onClick={onGenerate}
            disabled={isLoading || !isValid}
            className={`w-full py-3 rounded text-sm font-mono font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2
              ${isLoading
                ? 'bg-ps-border text-ps-muted cursor-wait opacity-70'
                : !isValid
                  ? 'bg-ps-border text-ps-muted opacity-50 cursor-not-allowed'
                  : 'bg-ps-text text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-[0.99]'
              }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-ps-muted border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </>
            ) : isResearchMode ? (
              <>
                <FileText size={16} /> Generate Guide
              </>
            ) : (
              'Generate Script'
            )}
          </button>
        </div>

        <div className="mt-6 border-t border-ps-border pt-4 shrink-0">
          <p className="text-[10px] text-ps-muted font-mono leading-relaxed">
            {isResearchMode
              ? "PHASE 1: RESEARCH. Generates a protocol for NotebookLM. Paste formatted topic block to auto-fill."
              : "PHASE 2: SCRIPT GENERATION. Requires filtered research material. Metadata is extracted from content."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputForm;