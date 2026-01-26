import React, { useRef, useEffect } from 'react';
import { Mic, Sparkles } from 'lucide-react';
import { AnalysisResult } from '../types';

interface StepClarifyProps {
  analysis: AnalysisResult | null;
  userNotes: string;
  onChangeNotes: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const StepClarify: React.FC<StepClarifyProps> = ({ 
  analysis, 
  userNotes, 
  onChangeNotes, 
  onGenerate,
  isLoading
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto focus on mount
    if (textareaRef.current) {
        textareaRef.current.focus();
    }
  }, []);

  const needsInfo = analysis?.status === 'NEEDS_INFO';

  return (
    <div className="flex flex-col h-full space-y-4 animate-fade-in pb-24">
      {/* AI Analyst Output */}
      {needsInfo && analysis.questions.length > 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
            <Sparkles size={18} className="fill-amber-700" />
            <span>AI 建议补充信息</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-amber-900">
            {analysis.questions.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 shadow-sm flex items-center gap-2 text-green-700">
          <Sparkles size={18} className="fill-green-700" />
          <span className="text-sm font-medium">信息看起来很完整！如有其他补充请在下方输入。</span>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-1 bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col">
        <div className="flex justify-between items-center mb-2">
           <label className="text-sm font-semibold text-slate-700">您的回复 / 补充说明</label>
           <button className="text-slate-400 hover:text-brand-600 transition-colors">
             <Mic size={20} />
           </button>
        </div>
        <textarea
          ref={textareaRef}
          className="flex-1 w-full text-base text-slate-800 bg-transparent outline-none resize-none placeholder:text-slate-300"
          placeholder={needsInfo ? "请针对上方问题进行简单回答..." : "例如：提供5%折扣，2周交货，推荐使用精梳棉..."}
          value={userNotes}
          onChange={(e) => onChangeNotes(e.target.value)}
        />
      </div>

      {/* Floating Action Button for Mobile Sticky-ness */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 to-transparent">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full py-4 rounded-xl font-bold text-lg shadow-xl shadow-brand-500/20 bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98] flex items-center justify-center gap-2 transition-all"
        >
          {isLoading ? (
             <>
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               <span>正在撰写邮件...</span>
             </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>生成邮件</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};