
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { NAV_ITEMS } from '../constants';
import Icon from './Icon';

const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, documents, processingState } = useAppContext();

  const isNavItemDisabled = (name: string): boolean => {
    if (name === 'Import') return false;
    if (documents.length === 0) return true;
    if (name === 'Export' && processingState.status !== 'done') return true;
    return false;
  };

  return (
    <aside className="w-64 bg-white p-4 flex flex-col border-r border-neutral-200">
      <div className="text-2xl font-bold mb-10 text-black">eDiscovery AI</div>
      <nav className="flex flex-col space-y-2">
        {NAV_ITEMS.map(item => {
          const isDisabled = isNavItemDisabled(item.name);
          return (
            <button
              key={item.name}
              disabled={isDisabled}
              onClick={() => setCurrentPage(item.name)}
              className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                currentPage === item.name
                  ? 'bg-neutral-100 text-black'
                  : 'text-neutral-600 hover:bg-neutral-100'
              } ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Icon name={item.icon} className="w-6 h-6" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto p-3 bg-neutral-100 rounded-lg">
        <h3 className="font-semibold text-black">Status</h3>
        <p className="text-sm text-neutral-600 mt-2">Documents: {documents.length}</p>
        <p className="text-sm text-neutral-600">Processing: {processingState.status}</p>
      </div>
    </aside>
  );
};

export default Sidebar;