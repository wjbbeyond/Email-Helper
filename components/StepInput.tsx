import React, { useCallback } from 'react';
import { Clipboard } from 'lucide-react';

interface StepInputProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  isLoading: boolean;
}

export const StepInput: React.FC<StepInputProps> = ({ value, onChange, onNext, isLoading }) => {
  
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  }, [onChange]);

  return (
    <div className="flex flex-col h-full space-y-4 animate-fade-in">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          客户邮件内容
        </label>
        <div className="relative">
          <textarea
            className="w-full h-64 p-3 text-base text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400"
            placeholder="在此粘贴客户发来的邮件..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {!value && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                type="button"
                className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white text-brand-600 font-medium rounded-full shadow-md border border-slate-100 active:scale-95 transition-transform"
                onClick={handlePaste}
              >
                <Clipboard size={18} />
                <span>从剪贴板粘贴</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1"></div>

      <button
        onClick={onNext}
        disabled={!value.trim() || isLoading}
        className={`
          w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all
          flex items-center justify-center gap-2
          ${!value.trim() || isLoading 
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
            : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98] shadow-brand-500/30'
          }
        `}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>智能分析中...</span>
          </>
        ) : (
          <span>下一步</span>
        )}
      </button>
    </div>
  );
};