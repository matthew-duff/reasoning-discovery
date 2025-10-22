
import React, { useCallback, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { processDocumentWithGemini } from '../services/geminiService';
import { EXAMPLE_QUERIES } from '../constants';
import ProgressBar from './ProgressBar';

const QueryView: React.FC = () => {
    const { documents, query, setQuery, setResults, processingState, setProcessingState, setCurrentPage } = useAppContext();
    const [error, setError] = useState('');

    const handleRunDiscovery = useCallback(async () => {
        if (!query.trim()) {
            setError('Query cannot be empty.');
            return;
        }
        if (documents.length === 0) {
            setError('No documents loaded.');
            return;
        }
        setError('');

        setProcessingState({ status: 'processing', progress: 0, total: documents.length });

        const newResults = [];
        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            const result = await processDocumentWithGemini(doc, query);
            const discoveryResult = {
                docId: doc.id,
                docName: doc.name,
                decision: result.decision,
                reasoning: result.reasoning
            };
            newResults.push(discoveryResult);
            setResults(prev => [...prev.filter(r => r.docId !== doc.id), discoveryResult]);
            setProcessingState(prev => ({ ...prev, progress: i + 1 }));
        }

        setProcessingState(prev => ({ ...prev, status: 'done' }));
        setCurrentPage('Documents');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, documents, setProcessingState, setResults, setCurrentPage]);

    if (documents.length === 0) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold text-black mb-4">No Documents Loaded</h1>
                <p className="text-neutral-600">Please import documents or load mock data first.</p>
                <button
                    onClick={() => setCurrentPage('Import')}
                    className="mt-4 bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                    Go to Import
                </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-black mb-4">Submit Discovery Query</h1>
            <p className="text-lg text-neutral-600 mb-8">Enter your natural language query to begin the AI-powered discovery process.</p>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., 'Documents discussing safety test failures for Project Titan'"
                    className="w-full h-32 p-4 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={processingState.status === 'processing'}
                />

                {error && <p className="text-red-600 font-semibold mt-2">{error}</p>}
                
                <div className="mt-6">
                    <button
                        onClick={handleRunDiscovery}
                        disabled={processingState.status === 'processing'}
                        className="w-full bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-not-allowed"
                    >
                        {processingState.status === 'processing' ? 'Processing...' : 'Run Discovery'}
                    </button>
                </div>
                
                {processingState.status === 'processing' && (
                    <div className="mt-6">
                        <ProgressBar progress={processingState.progress} total={processingState.total} />
                    </div>
                )}
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold text-black mb-4">Example Queries</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EXAMPLE_QUERIES.map((exQuery, index) => (
                        <button
                            key={index}
                            onClick={() => setQuery(exQuery)}
                            className="text-left bg-white p-4 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-700 border border-neutral-200"
                        >
                            "{exQuery}"
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QueryView;