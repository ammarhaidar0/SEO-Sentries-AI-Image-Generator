import React from 'react';
import type { AspectRatio } from '../types';
import { aspectRatios } from '../constants';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
  disabled: boolean;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.value}
            onClick={() => onSelect(ratio)}
            disabled={disabled}
            className={`
              p-2 text-center text-sm rounded-md transition-all duration-200
              ${selected.value === ratio.value 
                ? 'bg-green-600 text-white font-semibold ring-2 ring-offset-2 ring-offset-slate-800 ring-green-500' 
                : 'bg-slate-700 hover:bg-slate-600/70 text-slate-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {ratio.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;