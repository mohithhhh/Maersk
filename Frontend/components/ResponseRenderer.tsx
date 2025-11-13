import React from 'react';
import { StructuredResponse } from '../types';
import KpiCard from './KpiCard';
import ChartComponent from './ChartComponent';
// FIX: Switched to a named import for BrazilMap as the module does not have a default export.
import { BrazilMap } from './BrazilMap';

interface ResponseRendererProps {
  response: StructuredResponse;
  onSuggestionClick: (suggestion: string) => void;
}

const ResponseRenderer: React.FC<ResponseRendererProps> = ({ response, onSuggestionClick }) => {
  const renderVisualization = () => {
    switch (response.visualization) {
      case 'kpi':
        return (
          <div className="flex flex-wrap gap-4 my-4">
            {(response.data as any[]).map((kpi, index) => (
              <KpiCard key={index} title={kpi.title} value={kpi.value} change={kpi.change} />
            ))}
          </div>
        );
      case 'chart':
        const chartData = response.data as any;
        return <ChartComponent title={chartData.title} type={chartData.type} labels={chartData.labels} values={chartData.values} forecastValues={chartData.forecastValues} />;
      case 'map':
        const mapData = response.data as any;
        return <BrazilMap title={mapData.title} data={mapData.highlightedStates} />;
      case 'text':
        const textData = response.data as any;
        return (
          <div className="space-y-2">
            {textData.insights.map((p: string, i: number) => <p key={i}>{p}</p>)}
          </div>
        );
       case 'error':
        const errorData = response.data as any;
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700">{errorData.message}</p>
            </div>
        );
      default:
        return <p>{response.summary}</p>;
    }
  };

  return (
    <div className="space-y-4">
      {renderVisualization()}
      {response.summary && response.visualization !== 'text' && (
        <div className="mt-4 pt-4 border-t border-slate-200">
           <h4 className="font-semibold text-sm text-slate-600 mb-2">AI Insight Summary</h4>
           <p className="text-sm text-slate-700">{response.summary}</p>
        </div>
      )}
      {response.followUpSuggestions && response.followUpSuggestions.length > 0 && (
        <div className="mt-4">
            <h4 className="font-semibold text-sm text-slate-600 mb-2">Ask a follow-up</h4>
            <div className="flex flex-wrap gap-2">
                {response.followUpSuggestions.map((suggestion, index) => (
                    <button 
                        key={index} 
                        onClick={() => onSuggestionClick(suggestion)}
                        className="px-3 py-1 text-sm bg-sky-100 border border-sky-200 text-sky-800 rounded-full hover:bg-sky-200 transition-colors"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ResponseRenderer;