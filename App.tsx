import React, { useState, useEffect } from 'react';
import { Settings, Shirt } from 'lucide-react';
import { StepInput } from './components/StepInput';
import { StepClarify } from './components/StepClarify';
import { StepResult } from './components/StepResult';
import { SettingsModal } from './components/SettingsModal';
import { analyzeEmail, generateReply } from './services/geminiService';
import { AppStep, EmailContext } from './types';

// Default configuration
const DEFAULT_MODEL = 'gemini-3-flash-preview';
const DEFAULT_SIGNATURE = `Best regards,

[Your Name]
Sales Manager
[Factory Name]`;

function App() {
  const [step, setStep] = useState<AppStep>('input');
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings State
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState(DEFAULT_MODEL);
  const [signature, setSignature] = useState(DEFAULT_SIGNATURE);
  
  const [context, setContext] = useState<EmailContext>({
    customerEmail: '',
    analysis: null,
    userNotes: '',
    generatedEmail: ''
  });

  // Load settings from LocalStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('sr_api_key');
    const savedModel = localStorage.getItem('sr_model');
    const savedSig = localStorage.getItem('sr_signature');

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedModel) setModelName(savedModel);
    if (savedSig) setSignature(savedSig);
  }, []);

  // Save settings handler
  const handleSaveSettings = (settings: { apiKey: string; modelName: string; signature: string }) => {
    setApiKey(settings.apiKey);
    setModelName(settings.modelName);
    setSignature(settings.signature);

    localStorage.setItem('sr_api_key', settings.apiKey);
    localStorage.setItem('sr_model', settings.modelName);
    localStorage.setItem('sr_signature', settings.signature);
  };

  // Step 1 -> 2: Analyze Email
  const handleAnalyze = async () => {
    if (!context.customerEmail.trim()) return;
    
    setLoading(true);
    try {
      // Pass config to service
      const analysis = await analyzeEmail(context.customerEmail, apiKey, modelName);
      
      setContext(prev => ({ ...prev, analysis }));
      setStep('clarify');
    } catch (error) {
      console.error(error);
      alert("分析邮件失败，请检查网络连接或 API Key 设置。");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 -> 3: Generate Email
  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Pass config to service
      const result = await generateReply(context.customerEmail, context.userNotes, signature, apiKey, modelName);
      setContext(prev => ({ ...prev, generatedEmail: result }));
      setStep('result');
    } catch (error) {
      console.error(error);
      alert("生成邮件失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  // Reset Flow
  const handleReset = () => {
    setContext({
      customerEmail: '',
      analysis: null,
      userNotes: '',
      generatedEmail: ''
    });
    setStep('input');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <header className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600">
               <Shirt size={20} className="fill-brand-100 stroke-brand-600" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 leading-tight">SmartReply <span className="text-brand-600 text-sm align-top">OEM</span></h1>
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors active:bg-slate-100"
          >
            <Settings size={20} />
          </button>
        </header>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100 flex">
          <div className={`h-full bg-brand-500 transition-all duration-300 ${step === 'input' ? 'w-1/3' : step === 'clarify' ? 'w-2/3' : 'w-full'}`}></div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-5 overflow-hidden flex flex-col">
          {step === 'input' && (
            <StepInput 
              value={context.customerEmail} 
              onChange={(val) => setContext(prev => ({...prev, customerEmail: val}))}
              onNext={handleAnalyze}
              isLoading={loading}
            />
          )}

          {step === 'clarify' && (
            <StepClarify 
              analysis={context.analysis}
              userNotes={context.userNotes}
              onChangeNotes={(val) => setContext(prev => ({...prev, userNotes: val}))}
              onGenerate={handleGenerate}
              isLoading={loading}
            />
          )}

          {step === 'result' && (
            <StepResult 
              content={context.generatedEmail}
              onReset={handleReset}
              onBack={() => setStep('clarify')}
            />
          )}
        </main>
        
        {/* Settings Modal */}
        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          apiKey={apiKey}
          modelName={modelName}
          signature={signature}
          onSave={handleSaveSettings}
        />

      </div>
    </div>
  );
}

export default App;