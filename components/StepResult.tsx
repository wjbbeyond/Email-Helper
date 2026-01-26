import React, { useState } from 'react';
import { Copy, Check, RotateCcw, ArrowLeft } from 'lucide-react';

interface StepResultProps {
  content: string;
  onReset: () => void;
  onBack: () => void;
}

export const StepResult: React.FC<StepResultProps> = ({ content, onReset, onBack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in pb-24">
      {/* Result Container */}
      <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col flex-1 relative">
        <div className="h-2 bg-brand-500 w-full"></div>
        <div className="p-4 overflow-y-auto flex-1">
          <pre className="whitespace-pre-wrap font-sans text-sm md:text-base text-slate-800 leading-relaxed">
            {content}
          </pre>
        </div>
        
        {/* Copy Overlay Button (Floating inside) */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleCopy}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all
              ${copied 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? '已复制' : '复制'}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-slate-100 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>调整</span>
        </button>
        
        <button
          onClick={handleCopy}
          className="flex-[2] py-3 px-4 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied ? '已复制!' : '复制全部内容'}</span>
        </button>
      </div>
      
      {/* Reset Link */}
      <div className="text-center mt-4 mb-2">
         <button onClick={onReset} className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1 mx-auto hover:text-brand-600">
            <RotateCcw size={12} />
            开始写新邮件
         </button>
      </div>
    </div>
  );
};