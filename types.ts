
export type Page = 'Import' | 'Query' | 'Documents' | 'Export';

export interface Document {
  id: string;
  name: string;
  content: string;
}

export type RelevanceDecision = 'Relevant' | 'Not Relevant' | 'Pending';

export interface RelevanceDetails {
    [key: string]: boolean;
}

export interface DiscoveryResult {
  docId: string;
  docName: string;
  decision: RelevanceDecision;
  relevanceDetails?: RelevanceDetails;
  reasoning: string;
  confidence?: number;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  total: number;
  error?: string;
}
