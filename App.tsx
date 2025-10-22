
import React from 'react';
import Sidebar from './components/Sidebar';
import ImportView from './components/ImportView';
import QueryView from './components/QueryView';
import ResultsView from './components/ResultsView';
import ExportView from './components/ExportView';
import { useAppContext } from './context/AppContext';
import Modal from './components/Modal';

const App: React.FC = () => {
  const { currentPage, selectedDocument, setSelectedDocument } = useAppContext();

  const renderContent = () => {
    switch (currentPage) {
      case 'Import':
        return <ImportView />;
      case 'Query':
        return <QueryView />;
      case 'Documents':
        return <ResultsView />;
      case 'Export':
        return <ExportView />;
      default:
        return <ImportView />;
    }
  };

  return (
    <div className="flex h-screen bg-white text-neutral-900">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto bg-neutral-50">
        {renderContent()}
      </main>

      {selectedDocument && (
        <Modal isOpen={!!selectedDocument} onClose={() => setSelectedDocument(null)}>
          <h2 className="text-2xl font-bold mb-4 text-black">{selectedDocument.name}</h2>
          <h3 className="text-lg font-semibold mb-2 text-neutral-600">{selectedDocument.id}</h3>
          <div className="max-h-96 overflow-y-auto bg-neutral-100 p-4 rounded-md text-neutral-800 whitespace-pre-wrap border border-neutral-200">
              {selectedDocument.content}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default App;