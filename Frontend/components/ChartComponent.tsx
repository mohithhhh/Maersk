import React from 'react';
import { ChartData } from '../types';

interface ChartComponentProps extends ChartData {}

const ChartComponent: React.FC<ChartComponentProps> = ({ title, type, labels, values, forecastValues }) => {
    const chartHeight = 200;
    const chartWidth = 500; // Increased width for better line chart visibility
    const padding = 40;
    const allValues = forecastValues ? [...values, ...forecastValues] : values;
    const maxValue = Math.max(...allValues, 0);
    const scale = (value: number) => (value / maxValue) * (chartHeight - padding);
    const xStep = (chartWidth - padding) / (labels.length - 1);

    const renderBarChart = () => {
        const barWidth = (chartWidth - padding) / values.length * 0.8;
        const barGap = (chartWidth - padding) / values.length * 0.2;

        return values.map((value, index) => {
            const barHeight = scale(value);
            const x = padding + index * (barWidth + barGap);
            const y = chartHeight - padding - barHeight;
            return (
                <g key={index}>
                    <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill="#42B0D5"
                        rx="2"
                    >
                        <title>{`${labels[index]}: ${value.toLocaleString()}`}</title>
                    </rect>
                </g>
            );
        });
    };

    const renderLineChart = () => {
        const actualPath = values.map((val, i) => `${padding + i * xStep},${chartHeight - padding - scale(val)}`).join(' ');
        
        let forecastPath = '';
        if (forecastValues && forecastValues.length > 0) {
            const lastActualPoint = `${padding + (values.length - 1) * xStep},${chartHeight - padding - scale(values[values.length - 1])}`;
            const firstForecastPoint = `${padding + values.length * xStep},${chartHeight - padding - scale(forecastValues[0])}`;
            
            const forecastPoints = forecastValues.map((val, i) => `${padding + (values.length + i) * xStep},${chartHeight - padding - scale(val)}`).join(' ');
            forecastPath = `${lastActualPoint} ${firstForecastPoint} ${forecastPoints}`;
        }

        return (
            <>
                <polyline fill="none" stroke="#42B0D5" strokeWidth="2" points={actualPath} />
                {forecastPath && (
                     <polyline fill="none" stroke="#42B0D5" strokeWidth="2" strokeDasharray="4 4" points={forecastPath} />
                )}
                {values.map((val, i) => (
                    <circle key={`p-${i}`} cx={padding + i * xStep} cy={chartHeight - padding - scale(val)} r="3" fill="#42B0D5">
                         <title>{`${labels[i]}: ${val.toLocaleString()}`}</title>
                    </circle>
                ))}
                 {forecastValues && forecastValues.map((val, i) => (
                    <circle key={`fp-${i}`} cx={padding + (values.length + i) * xStep} cy={chartHeight - padding - scale(val)} r="3" fill="white" stroke="#42B0D5" strokeWidth="2">
                         <title>{`${labels[values.length + i]}: ${val.toLocaleString()}`}</title>
                    </circle>
                ))}
            </>
        )
    };
    
    return (
        <div className="my-4">
            <h4 className="font-semibold text-slate-700 mb-2">{title}</h4>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto" aria-labelledby="title" role="img">
                <title id="title">{title}</title>
                {/* Y-Axis Line */}
                <line x1={padding} y1={0} x2={padding} y2={chartHeight - padding} stroke="#e2e8f0" strokeWidth="1"/>
                {/* X-Axis Line */}
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth} y2={chartHeight - padding} stroke="#e2e8f0" strokeWidth="1"/>
                
                {/* Y-Axis Labels */}
                {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                    <g key={tick}>
                        <text 
                            x={padding - 5} 
                            y={(1-tick) * (chartHeight - padding)} 
                            textAnchor="end" 
                            alignmentBaseline="middle" 
                            fontSize="10" 
                            fill="#6b7280"
                        >
                            {(tick * maxValue).toLocaleString()}
                        </text>
                        {tick > 0 && <line x1={padding} y1={(1-tick) * (chartHeight - padding)} x2={chartWidth} y2={(1-tick) * (chartHeight - padding)} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />}
                    </g>
                ))}

                {/* Chart content */}
                {type === 'bar' ? renderBarChart() : renderLineChart()}

                {/* X-Axis Labels */}
                {labels.map((label, index) => {
                     const x = padding + (type === 'bar' ? (index * ((chartWidth - padding) / values.length)) + ((chartWidth - padding) / values.length * 0.8) / 2 : index * xStep);
                    return (
                        <text
                            key={index}
                            x={x}
                            y={chartHeight - padding + 15}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#6b7280"
                        >
                            {label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

export default ChartComponent;