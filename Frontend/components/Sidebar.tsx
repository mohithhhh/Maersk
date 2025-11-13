
import React from 'react';
import { View } from '../types';
import { MaerskLogoIcon, ChatIcon, GeoIcon, TrendsIcon, AboutIcon, PdfIcon } from './icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClasses = isActive
    ? 'bg-[#42B0D5] text-white'
    : 'text-slate-600 hover:bg-slate-100';
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-semibold transition-all duration-200 ${activeClasses}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 p-4">
        <MaerskLogoIcon className="h-9 w-9" />
        <span className="text-2xl font-bold text-slate-800 tracking-tighter">MAERSK</span>
      </div>
      <nav className="mt-8 flex flex-col gap-2">
        <NavItem
          icon={<ChatIcon />}
          label="Chat with Data"
          isActive={activeView === View.Chat}
          onClick={() => setActiveView(View.Chat)}
        />
        <NavItem
          icon={<GeoIcon />}
          label="Geo Insights"
          isActive={activeView === View.Geo}
          onClick={() => setActiveView(View.Geo)}
        />
        <NavItem
          icon={<TrendsIcon />}
          label="Trends & Forecasts"
          isActive={activeView === View.Trends}
          onClick={() => setActiveView(View.Trends)}
        />
        <NavItem
          icon={<AboutIcon />}
          label="About"
          isActive={activeView === View.About}
          onClick={() => setActiveView(View.About)}
        />
      </nav>
      
      <div className="mt-auto">
        <button
            onClick={() => window.print()}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-200"
        >
            <PdfIcon />
            <span>Export PDF</span>
        </button>
      </div>

      <div className="text-center text-xs text-slate-400 pt-4">
        <p>&copy; {new Date().getFullYear()} Maersk</p>
        <p>Logistics AI Division</p>
      </div>
    </aside>
  );
};

export default Sidebar;