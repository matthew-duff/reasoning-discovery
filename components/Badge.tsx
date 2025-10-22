
import React from 'react';
import { RelevanceDecision } from '../types';

interface BadgeProps {
  decision: RelevanceDecision;
}

const Badge: React.FC<BadgeProps> = ({ decision }) => {
  const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-semibold";
  
  if (decision === 'Relevant') {
    return (
      <span className={`${baseClasses} bg-black text-white`}>
        Relevant
      </span>
    );
  }

  if (decision === 'Not Relevant') {
    return (
      <span className={`${baseClasses} bg-neutral-200 text-neutral-700`}>
        Not Relevant
      </span>
    );
  }

  return (
     <span className={`${baseClasses} bg-white text-neutral-600 border border-neutral-300`}>
        Pending
     </span>
  );
};

export default Badge;