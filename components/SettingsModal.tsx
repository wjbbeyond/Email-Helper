import React from 'react';
import { X, Key, Box, PenTool } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  modelName: string;
  signature: string;
  onSave: (settings: { apiKey: string; modelName: string; signature: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  apiKey: initialApiKey, 
  modelName: initialModelName,
  signature: initialSignature, 
  onSave 
}) => {
  const [localApiKey, setLocalApiKey] = React.useState(initialApiKey);
  const [localModelName, setLocalModelName] = React.useState(initialModelName);
  const [localSignature, setLocalSignature] = React.useState(initialSignature);

  // Sync state when opening
  React.useEffect(() => {
    if (isOpen) {
      setLocalApiKey(initialApiKey);
      setLocalModelName(initialModelName);
      setLocalSignature(initialSignature);
    }
  }, [isOpen, initialApiKey, initialModelName, initialSignature]);

  const handleSave = () => {
    onSave({
      apiKey: localApiKey,
      modelName: localModelName,
      signature: localSignature
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
          <h2 className="font-bold text-slate-800">设置 (Settings)</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* API Key Section */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Key size={16} className="text-brand-600" />
              API Key
            </label>
            <input
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-300 font-mono"
            />
            <p className="text-xs text-slate-400 mt-1">留空则使用环境变量中的默认 Key。</p>
          </div>

          {/* Model Name Section */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Box size={16} className="text-brand-600" />
              模型名称 (Model Name)
            </label>
            <input
              type="text"
              value={localModelName}
              onChange={(e) => setLocalModelName(e.target.value)}
              placeholder="e.g. gemini-3-flash-preview"
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all font-mono"
            />
             <p className="text-xs text-slate-400 mt-1">例如: gemini-3-flash-preview, glm-4.7-flash 等。</p>
          </div>

          {/* Signature Section */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <PenTool size={16} className="text-brand-600" />
              邮件签名 (Signature)
            </label>
            <textarea
              value={localSignature}
              onChange={(e) => setLocalSignature(e.target.value)}
              placeholder="输入您的签名..."
              rows={4}
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="p-5 pt-2 flex-shrink-0">
          <button onClick={handleSave} className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20 active:scale-[0.98]">
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};