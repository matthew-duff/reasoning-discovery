
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Document } from '../types';
import Badge from './Badge';
import Icon from './Icon';

const ITEMS_PER_PAGE = 10;

const ResultsView: React.FC = () => {
    const { results, documents, setCurrentPage, setSelectedDocument } = useAppContext();
    const [filter, setFilter] = useState<'all' | 'Relevant' | 'Not Relevant' | 'Pending'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [paginationPage, setPaginationPage] = useState(1);
    const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);

    const handleFilterChange = (newFilter: 'all' | 'Relevant' | 'Not Relevant' | 'Pending') => {
        setFilter(newFilter);
        setPaginationPage(1);
    };

    const filteredResults = useMemo(() => {
        let intermediateResults = results;

        if (filter !== 'all') {
            intermediateResults = intermediateResults.filter(result => result.decision === filter);
        }

        if (searchTerm.trim() !== '') {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            intermediateResults = intermediateResults.filter(result =>
                result.docId.toLowerCase().includes(lowercasedSearchTerm) ||
                result.docName.toLowerCase().includes(lowercasedSearchTerm) ||
                result.reasoning.toLowerCase().includes(lowercasedSearchTerm)
            );
        }
        
        return intermediateResults;
    }, [results, filter, searchTerm]);
    
    const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);

    const paginatedResults = useMemo(() => {
        const startIndex = (paginationPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredResults.slice(startIndex, endIndex);
    }, [filteredResults, paginationPage]);


    const handleViewDocument = (docId: string) => {
        const doc = documents.find(d => d.id === docId);
        if (doc) {
            setSelectedDocument(doc);
        }
    };
    
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
        <div>
            <h1 className="text-4xl font-bold text-black mb-4">Documents</h1>
            <p className="text-lg text-neutral-600 mb-6">View the status of your documents. After running a query, you can review the AI's relevance decisions and reasoning here.</p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleFilterChange('all')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'}`}>All ({results.length})</button>
                    <button onClick={() => handleFilterChange('Pending')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'Pending' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'}`}>Pending ({results.filter(r => r.decision === 'Pending').length})</button>
                    <button onClick={() => handleFilterChange('Relevant')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'Relevant' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'}`}>Relevant ({results.filter(r => r.decision === 'Relevant').length})</button>
                    <button onClick={() => handleFilterChange('Not Relevant')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'Not Relevant' ? 'bg-black text-white' : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'}`}>Not Relevant ({results.filter(r => r.decision === 'Not Relevant').length})</button>
                </div>
                 <div className="relative sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon name="search" className="w-5 h-5 text-neutral-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPaginationPage(1);
                        }}
                        className="w-full p-2 pl-10 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-700">
                        <thead className="text-xs text-neutral-600 uppercase bg-neutral-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Doc ID</th>
                                <th scope="col" className="px-6 py-3">Filename</th>
                                <th scope="col" className="px-6 py-3">Decision</th>
                                <th scope="col" className="px-6 py-3">Reasoning</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedResults.length > 0 ? (
                                paginatedResults.map((result) => (
                                    <tr key={result.docId} className="bg-white border-b border-neutral-200 hover:bg-neutral-50">
                                        <td className="px-6 py-4 font-mono text-neutral-900">{result.docId}</td>
                                        <td className="px-6 py-4 text-neutral-900">{result.docName}</td>
                                        <td className="px-6 py-4">
                                            <div className="relative group flex items-center">
                                                <Badge decision={result.decision} />
                                                {result.decision === 'Relevant' && result.relevanceDetails && Object.keys(result.relevanceDetails).length > 0 && (
                                                    <div
                                                        className="absolute z-10 w-80 p-3 invisible group-hover:visible bg-black text-white text-sm rounded-lg shadow-lg bottom-full left-1/2 -translate-x-1/2 mb-2
                                                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        role="tooltip"
                                                    >
                                                        <h4 className="font-bold mb-2 border-b border-neutral-600 pb-1">Relevance Breakdown</h4>
                                                        <ul className="space-y-1 mt-2">
                                                            {Object.entries(result.relevanceDetails)
                                                                .sort(([, aIsRelevant], [, bIsRelevant]) => (bIsRelevant ? 1 : 0) - (aIsRelevant ? 1 : 0))
                                                                .map(([category, isRelevant]) => (
                                                                <li key={category} className="flex items-start justify-between">
                                                                    <span className="text-neutral-300 text-xs flex-1 pr-2">{category.replace('Relevant with ', '')}</span>
                                                                    <span className={`font-bold text-xs ${isRelevant ? 'text-green-400' : 'text-red-500'}`}>
                                                                        {isRelevant ? '✓ Relevant' : '✗ Not Relevant'}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-md">
                                            <p
                                                className="cursor-pointer hover:text-black"
                                                onClick={() => setExpandedReasoning(expandedReasoning === result.docId ? null : result.docId)}
                                            >
                                                {expandedReasoning === result.docId ? result.reasoning : `${result.reasoning.substring(0, 100)}${result.reasoning.length > 100 ? '...' : ''}`}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleViewDocument(result.docId)} className="font-medium text-black hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))
                             ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-neutral-500">
                                        No documents match your criteria.
                                    </td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center p-4 text-neutral-600 text-sm">
                    {filteredResults.length > 0 ? (
                        <span>
                            Showing <span className="font-semibold text-neutral-900">{(paginationPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-neutral-900">{Math.min(paginationPage * ITEMS_PER_PAGE, filteredResults.length)}</span> of <span className="font-semibold text-neutral-900">{filteredResults.length}</span> results
                        </span>
                    ) : (
                        <span>No documents found</span>
                    )}
                    
                    {totalPages > 1 && (
                        <div className="inline-flex items-center">
                            <button 
                                onClick={() => setPaginationPage(p => Math.max(1, p - 1))}
                                disabled={paginationPage === 1}
                                className="px-3 py-1 font-medium text-black bg-white border border-neutral-300 rounded-l-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-1 text-black bg-neutral-100 border-y border-neutral-300">
                                {paginationPage} / {totalPages}
                            </span>
                            <button 
                                onClick={() => setPaginationPage(p => Math.min(totalPages, p + 1))}
                                disabled={paginationPage === totalPages}
                                className="px-3 py-1 font-medium text-black bg-white border border-neutral-300 rounded-r-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsView;
