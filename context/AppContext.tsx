import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Document, DiscoveryResult, ProcessingState, Page } from '../types';
import { generateMockDocuments, extractTextFromFile } from '../services/documentService';

interface AppContextType {
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  loadMockData: () => void;
  addDocuments: (files: File[]) => Promise<{success: number; failed: number}>;
  query: string;
  setQuery: (q: string) => void;
  results: DiscoveryResult[];
  setResults: React.Dispatch<React.SetStateAction<DiscoveryResult[]>>;
  processingState: ProcessingState;
  setProcessingState: React.Dispatch<React.SetStateAction<ProcessingState>>;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  selectedDocument: Document | null;
  setSelectedDocument: (doc: Document | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState<Page>('Import');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const loadMockData = useCallback(() => {
    const mockDocs = generateMockDocuments(100);
    setDocuments(mockDocs);
    setResults(mockDocs.map(doc => ({
      docId: doc.id,
      docName: doc.name,
      decision: 'Pending',
      reasoning: 'Not yet processed.',
    })));
    setProcessingState({ status: 'idle', progress: 0, total: 0 });
    setCurrentPage('Query');
  }, []);

  const addDocuments = useCallback(async (files: File[]): Promise<{success: number; failed: number}> => {
    let successCount = 0;
    let failureCount = 0;
    const newDocs: Document[] = [];
    const newResults: DiscoveryResult[] = [];
    
    const startingIndex = documents.length;

    const pad = (num: number, size: number): string => {
        let s = num.toString();
        while (s.length < size) s = "0" + s;
        return s;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
            const content = await extractTextFromFile(file);
            const docId = `UPL.0001.001.${pad(startingIndex + i + 1, 4)}`;
            
            const newDoc: Document = {
                id: docId,
                name: file.name,
                content: content,
            };

            const newResult: DiscoveryResult = {
                docId: docId,
                docName: file.name,
                decision: 'Pending',
                reasoning: 'Not yet processed.',
            };

            newDocs.push(newDoc);
            newResults.push(newResult);
            successCount++;

        } catch (error) {
            console.error(`Failed to process file ${file.name}:`, error);
            failureCount++;
        }
    }

    if (newDocs.length > 0) {
        setDocuments(prev => [...prev, ...newDocs]);
        setResults(prev => [...prev, ...newResults]);
        setCurrentPage('Documents');
    }

    return { success: successCount, failed: failureCount };
  }, [documents, setDocuments, setResults, setCurrentPage]);

  const value = {
    documents,
    setDocuments,
    loadMockData,
    addDocuments,
    query,
    setQuery,
    results,
    setResults,
    processingState,
    setProcessingState,
    currentPage,
    setCurrentPage,
    selectedDocument,
    setSelectedDocument,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};