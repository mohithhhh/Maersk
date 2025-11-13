import React from 'react';
import { MaerskLogoIcon } from './icons';

interface HomepageProps {
  onStart: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-slate-100 text-center p-4">
      <div className="animate-slideUpFadeIn">
        <MaerskLogoIcon className="h-24 w-24 mx-auto mb-6" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tighter">
          Maersk AI Data Copilot
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Unlock powerful insights from your e-commerce data.
          <br />
          Ask questions in plain English and get answers in seconds.
        </p>
        <button
          onClick={onStart}
          className="mt-8 px-8 py-4 bg-[#42B0D5] text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-[#3695b7] transition-all duration-300 transform hover:scale-105"
        >
          Start Analyzing
        </button>
      </div>
    </div>
  );
};

export default Homepage;
