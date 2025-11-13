import React, { useState, useRef, useEffect } from 'react';
import { Message, AwaitingInputType } from '../types';
import { runQuery } from '../services/apiService';
import { UpArrowIcon } from './icons';
import ResponseRenderer from './ResponseRenderer';

interface ChatViewProps {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, setMessages }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [awaitingInput, setAwaitingInput] = useState<AwaitingInputType>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleSend = async (messageText?: string) => {
        let currentMessage = typeof messageText === 'string' ? messageText : input;
        if (currentMessage.trim() === '' || isLoading) return;

        // If the AI is waiting for a specific piece of information, format the query contextually
        if (awaitingInput) {
            switch (awaitingInput) {
                case 'order_id_for_status':
                    currentMessage = `status for order ${currentMessage}`;
                    break;
                case 'order_id_for_seller':
                    currentMessage = `seller for order ${currentMessage}`;
                    break;
                case 'customer_id_for_location':
                    currentMessage = `location for customer ${currentMessage}`;
                    break;
                case 'seller_id_for_details':
                    currentMessage = `seller info ${currentMessage}`;
                    break;
            }
            setAwaitingInput(null); // Reset after using it
        }

        const userMessage: Message = { role: 'user', content: currentMessage };
        const newMessages: Message[] = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const modelMessagePlaceholder: Message = { role: 'model', content: '' };
        setMessages(prev => [...prev, modelMessagePlaceholder]);

        const structuredResponse = await runQuery(currentMessage, newMessages);

        // Check if the response is asking for more input and update state accordingly
        if (structuredResponse.awaitingInput) {
            setAwaitingInput(structuredResponse.awaitingInput);
        }

        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === 'model') {
                const updatedMessage: Message = { 
                    ...lastMessage, 
                    content: structuredResponse.summary,
                    structuredContent: structuredResponse 
                };
                return [...prev.slice(0, -1), updatedMessage];
            }
            return prev;
        });

        setIsLoading(false);
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        handleSend(suggestion);
    }

    const suggestedPrompts = [
        "Which state has the most orders?",
        "Show me monthly revenue",
        "What are the top 5 product categories?",
        "What is AOV?",
    ];

    const placeholderText = awaitingInput 
      ? `Please enter the ${awaitingInput.split('_for_')[0].replace(/_/g, ' ')}...`
      : "Ask about the data, or ask me anything...";

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 pr-4">
                <div className="mx-auto max-w-4xl space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''} fade-in`}>
                            {msg.role === 'model' && (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#42B0D5] text-white font-bold shrink-0">AI</div>
                            )}
                             <div className={`rounded-lg px-4 py-3 max-w-2xl prose ${msg.role === 'user' ? 'bg-[#42B0D5] text-white' : 'bg-white shadow-sm'}`}>
                                {msg.structuredContent ? (
                                    <ResponseRenderer response={msg.structuredContent} onSuggestionClick={handleSuggestionClick} />
                                ) : (
                                    <p className="text-base whitespace-pre-wrap">{msg.content}</p>
                                )}
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-4 fade-in">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#42B0D5] text-white font-bold shrink-0">AI</div>
                            <div className="rounded-lg px-4 py-3 bg-white shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:-0.3s]"></div>
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:-0.15s]"></div>
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div id="chat-input-area" className="pt-4 border-t border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-4xl px-4 md:px-0">
                    <div className="mb-2 flex flex-wrap gap-2">
                        {suggestedPrompts.map(prompt => (
                            <button key={prompt} onClick={() => handleSuggestionClick(prompt)} className="px-3 py-1 text-sm bg-white border border-slate-300 text-slate-700 rounded-full hover:bg-slate-100 transition-colors">
                                {prompt}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={placeholderText}
                            className="w-full rounded-lg border border-slate-300 bg-white p-4 pr-16 text-base focus:outline-none focus:ring-2 focus:ring-[#42B0D5]"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-md bg-[#42B0D5] text-white transition-colors hover:bg-[#3695b7] disabled:bg-slate-300"
                        >
                            <UpArrowIcon className="h-5 w-5" />
                        </button>
                    </div>
                     <div className="text-center text-xs text-slate-400 py-2">
                        🧠 Powered by Gemini 2.5 Pro + FastAPI + DuckDB
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ChatView;