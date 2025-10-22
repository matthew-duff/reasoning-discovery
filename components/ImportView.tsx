import React, { useCallback, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Icon from './Icon';

const ImportView: React.FC = () => {
  const { loadMockData, addDocuments } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    setMessage(null);
    
    const fileArray = Array.from(files);
    const { success, failed } = await addDocuments(fileArray);

    setIsLoading(false);
    if (success > 0 && failed === 0) {
        // No message needed on success, as user is redirected.
    } else if (success > 0 && failed > 0) {
        setMessage({type: 'error', text: `Uploaded ${success} document(s). Failed to upload ${failed} document(s). Check console for details.`});
    } else if (failed > 0) {
        setMessage({type: 'error', text: `Failed to upload ${failed} document(s). Unsupported file type or file read error.`});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addDocuments]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files);
     // Reset file input to allow uploading the same file again
    if (event.target) {
        event.target.value = '';
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };
  
  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    processFiles(event.dataTransfer.files);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-black mb-4">Import Documents</h1>
      <p className="text-lg text-neutral-600 mb-8">Upload your document set or use our built-in mock data to begin.</p>
      
      {message && (
        <div className={`p-4 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800`}>
            {message.text}
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200 mb-8">
        <h2 className="text-2xl font-semibold text-black mb-4">Upload Files</h2>
        <label
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`flex justify-center w-full h-32 px-4 transition bg-neutral-50 border-2 border-neutral-300 border-dashed rounded-md appearance-none ${isLoading ? 'cursor-wait' : 'cursor-pointer hover:border-neutral-400'} focus:outline-none`}>
            {isLoading ? (
                <span className="flex items-center space-x-2 text-neutral-600">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </span>
            ) : (
                <span className="flex items-center space-x-2">
                    <Icon name="upload" className="w-6 h-6 text-neutral-500" />
                    <span className="font-medium text-neutral-600">
                        Drop files to Attach, or <span className="text-black underline">browse</span>
                    </span>
                </span>
            )}
            <input type="file" name="file_upload" className="hidden" multiple onChange={handleFileChange} disabled={isLoading} accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" />
        </label>
        <p className="text-sm text-neutral-500 mt-2">Supports PDF, DOCX, TXT.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
        <h2 className="text-2xl font-semibold text-black mb-4">Use Demo Data</h2>
        <p className="text-neutral-600 mb-4">
            No documents handy? Load a pre-built set of 100 mock documents to see the platform in action.
        </p>
        <button
          onClick={loadMockData}
          disabled={isLoading}
          className="w-full bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-neutral-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-not-allowed"
        >
          Load 100 Mock Documents
        </button>
      </div>
    </div>
  );
};

export default ImportView;