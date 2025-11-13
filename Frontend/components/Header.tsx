
import React from 'react';
import { ClearIcon, FullscreenIcon } from './icons';

interface HeaderProps {
  onClearChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClearChat }) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-slate-700">AI Data Analyst Copilot</h1>
      <div className="flex items-center gap-4">
        <button onClick={onClearChat} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ClearIcon />
          <span className="text-sm">Clear</span>
        </button>
        <button className="text-slate-600 hover:text-slate-900">
          <FullscreenIcon />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#42B0D5] text-base font-bold text-white">
          M
        </div>
      </div>
    </header>
  );
};

export default Header;
