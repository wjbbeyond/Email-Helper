export type AppStep = 'input' | 'clarify' | 'result';

export interface AnalysisResult {
  status: 'READY' | 'NEEDS_INFO';
  questions: string[];
}

export interface EmailContext {
  customerEmail: string;
  analysis: AnalysisResult | null;
  userNotes: string;
  generatedEmail: string;
}
