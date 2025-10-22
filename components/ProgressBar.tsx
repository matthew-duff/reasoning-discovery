
import React from 'react';

interface ProgressBarProps {
  progress: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total }) => {
  const percentage = total > 0 ? (progress / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-neutral-700">Processing Documents</span>
        <span className="text-sm font-medium text-neutral-700">{progress} / {total}</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2.5">
        <div
          className="bg-black h-2.5 rounded-full"
          style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;