import React from 'react';
import { MaerskLogoIcon } from './icons';

const AboutView: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center h-full">
        <div className="max-w-3xl text-center">
            <MaerskLogoIcon className="h-24 w-24 mb-6 mx-auto" />
            <h2 className="text-3xl font-bold text-slate-700 mb-4">About the AI Data Analyst Copilot</h2>
            <p className="text-slate-600 text-lg mb-4">
                This application is a powerful demonstration of how Generative AI can serve as an intelligent copilot for data analysis. It provides a natural language interface to explore the complex Olist Brazilian e-commerce dataset.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-left">
                <h3 className="font-semibold text-xl text-slate-800 mb-3">Key Features:</h3>
                <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start">
                        <span className="text-[#42B0D5] font-bold mr-2">&#10003;</span>
                        <div>
                            <strong>Conversational Data Analysis:</strong> Ask questions in plain English to get insights from the data, just like talking to a human data analyst.
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#42B0D5] font-bold mr-2">&#10003;</span>
                        <div>
                            <strong>AI-Powered Backend:</strong> The analysis is driven by a powerful backend using Google's Gemini model to interpret natural language queries and generate structured, visualizable insights from the data.
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-[#42B0D5] font-bold mr-2">&#10003;</span>
                        <div>
                            <strong>Google Search Grounding:</strong> For up-to-the-minute accuracy and broader context, the AI is grounded with Google Search, ensuring responses are both relevant to the dataset and informed by real-world information.
                        </div>
                    </li>
                     <li className="flex items-start">
                        <span className="text-[#42B0D5] font-bold mr-2">&#10003;</span>
                         <div>
                            <strong>FastAPI & DuckDB Integration:</strong> The backend is built with FastAPI, providing a robust API layer, and leverages DuckDB for high-performance, in-process analytical queries on the Olist dataset.
                        </div>
                    </li>
                </ul>
            </div>
             <p className="text-sm text-slate-500 mt-8">
                This tool is a proof-of-concept developed to showcase the potential of AI in logistics and data intelligence at Maersk.
            </p>
        </div>
    </div>
  );
};

export default AboutView;