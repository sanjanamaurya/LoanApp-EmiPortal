import React, { useState, useEffect } from 'react';
import { maskPan } from '../../utils/pan';
import { Eye, EyeOff } from 'lucide-react';

export interface PanCellProps {
  pan: string;
  globalShowPan?: boolean;
}

export const PanCell: React.FC<PanCellProps> = ({ pan, globalShowPan }) => {
  const [showLocal, setShowLocal] = useState<boolean>(false);

  useEffect(() => {
    if (globalShowPan !== undefined) {
      setShowLocal(globalShowPan);
    }
  }, [globalShowPan]);

  const displayPan = showLocal ? pan : maskPan(pan);

  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs font-bold">
      <span className={showLocal ? 'text-slate-900' : 'text-slate-600 tracking-wider'}>
        {displayPan}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowLocal(!showLocal);
        }}
        className="p-1 text-slate-400 hover:text-brand-600 rounded-md hover:bg-slate-100 transition-colors"
        title={showLocal ? 'Mask PAN' : 'Reveal PAN'}
        aria-label={showLocal ? 'Mask PAN' : 'Reveal PAN'}
      >
        {showLocal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
