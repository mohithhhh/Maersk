import React, { useState, useEffect } from 'react';
import { GeoIcon } from './icons';
// FIX: Switched to a named import for BrazilMap as the module does not have a default export.
import { BrazilMap } from './BrazilMap';
import { getGeoOverview } from '../services/apiService';
import { MapData } from '../types';

const GeoView: React.FC = () => {
  const [geoData, setGeoData] = useState<MapData | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getGeoOverview();
        if (response.visualization === 'map') {
          setGeoData(response.data as MapData);
          setSummary(response.summary);
        } else {
          setError("Could not load geographical data in the correct format.");
        }
      } catch (err) {
        setError("Failed to fetch geographical data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
            <GeoIcon className="h-24 w-24 text-[#42B0D5] animate-pulse mb-6" />
            <p className="text-slate-500 text-lg">Loading Geographical Insights...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="p-8 text-center text-red-600">
          <p>{error}</p>
        </div>
      );
    }
    if (geoData) {
      return (
        <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start h-full overflow-y-auto">
            <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <BrazilMap title={geoData.title} data={geoData.highlightedStates} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    <GeoIcon className="h-8 w-8 text-[#42B0D5]" />
                    <h2 className="text-2xl font-bold text-slate-700">AI Summary</h2>
                </div>
                <p className="text-slate-600 prose">{summary}</p>
            </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="h-full bg-slate-50">
        {renderContent()}
    </div>
  );
};

export default GeoView;