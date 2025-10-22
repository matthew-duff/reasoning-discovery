
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { generatePdfReport } from '../services/reportService';
import Icon from './Icon';

const ExportView: React.FC = () => {
    const { results, query, processingState, setCurrentPage } = useAppContext();
    const canExport = processingState.status === 'done' && results.length > 0;

    const handleExport = () => {
        if (canExport) {
            generatePdfReport(results, query);
        }
    };

    if (processingState.status !== 'done') {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold text-black mb-4">No Report to Export</h1>
                <p className="text-neutral-600">Please run a discovery query to generate a report.</p>
                <button
                    onClick={() => setCurrentPage('Query')}
                    className="mt-4 bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                    Go to Query
                </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Export Report</h1>
            <p className="text-lg text-neutral-600 mb-8">
                Generate a court-ready "AI Methodology Report" in PDF format, detailing the discovery query,
                each document's relevance decision, and the AI's explicit reasoning.
            </p>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
                <Icon name="download" className="w-16 h-16 mx-auto text-black mb-4" />
                <h2 className="text-2xl font-semibold text-black mb-2">Report Ready</h2>
                <p className="text-neutral-600 mb-6">Your report with {results.length} processed documents is ready for download.</p>
                <button
                    onClick={handleExport}
                    disabled={!canExport}
                    className="w-full bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-not-allowed"
                >
                    Download PDF Report
                </button>
            </div>
        </div>
    );
};

export default ExportView;