import React, { useState, useEffect } from 'react';
import { TrendsIcon } from './icons';
import ChartComponent from './ChartComponent';
import { getRevenueTrend } from '../services/apiService';
import { ChartData } from '../types';

const TrendsView: React.FC = () => {
    const [trendData, setTrendData] = useState<ChartData | null>(null);
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getRevenueTrend();
                if (response.visualization === 'chart') {
                    setTrendData(response.data as ChartData);
                    setSummary(response.summary);
                } else {
                     setError("Could not load trend data in the correct format.");
                }
            } catch (err) {
                setError("Failed to fetch trend data.");
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
                    <TrendsIcon className="h-24 w-24 text-[#42B0D5] animate-pulse mb-6" />
                    <p className="text-slate-500 text-lg">Loading Revenue Trends...</p>
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
        if (trendData) {
            return (
                 <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start h-full overflow-y-auto">
                    <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                        <ChartComponent {...trendData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendsIcon className="h-8 w-8 text-[#42B0D5]" />
                            <h2 className="text-2xl font-bold text-slate-700">AI Summary</h2>
                        </div>
                        <p className="text-slate-600 prose">{summary}</p>
                    </div>
                </div>
            )
        }
        return null;
    };

    return (
        <div className="h-full bg-slate-50">
            {renderContent()}
        </div>
    );
};

export default TrendsView;