export enum ScriptType {
  FULL = 'FULL',
  SHORT = 'SHORT',
  RESEARCH_GUIDE = 'RESEARCH_GUIDE'
}

export interface ScriptParams {
  type: ScriptType;
  title: string;
  hook: string;
  angle: string;
  keywords: string;
  researchMaterial: string;
}

export interface GeneratedScript {
  content: string;
  timestamp: string;
  params: ScriptParams;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  params: ScriptParams;
  content: string;
}