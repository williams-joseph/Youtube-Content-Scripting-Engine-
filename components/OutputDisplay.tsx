import React from 'react';
import { Copy, Terminal, Check } from 'lucide-react';

interface OutputDisplayProps {
  content: string;
  isLoading: boolean;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ content, isLoading }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-ps-panel border border-ps-border rounded-lg flex flex-col h-full overflow-hidden relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-ps-border bg-ps-bg/50">
        <div className="flex items-center gap-2 text-ps-muted">
          <Terminal size={16} />
          <span className="text-xs font-mono uppercase tracking-wider">Output Stream</span>
        </div>
        <button
          onClick={handleCopy}
          disabled={!content || isLoading}
          className={`flex items-center gap-2 text-xs font-mono uppercase transition-colors px-2 py-1 rounded
            ${copied ? 'text-green-400' : 'text-ps-muted hover:text-ps-text disabled:opacity-30 disabled:cursor-not-allowed'}`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy Data'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed text-ps-text relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-ps-accent space-y-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-ps-accent rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-ps-accent rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-ps-accent rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-xs tracking-widest uppercase opacity-80">Synthesizing Pattern...</p>
          </div>
        ) : content ? (
          <div className="whitespace-pre-wrap max-w-3xl mx-auto">
             {/* Using simple text rendering to maintain the raw script feel requested */}
             {content}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-ps-border opacity-50 select-none">
            <div className="w-16 h-16 border-2 border-dashed border-current rounded-full flex items-center justify-center mb-4">
               <div className="w-2 h-2 bg-current rounded-full" />
            </div>
            <p className="text-xs font-mono uppercase tracking-widest">Awaiting Input Parameters</p>
          </div>
        )}
      </div>

      {content && !isLoading && (
        <div className="h-1 bg-gradient-to-r from-transparent via-ps-accent to-transparent opacity-20"></div>
      )}
    </div>
  );
};

export default OutputDisplay;
