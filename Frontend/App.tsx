import React, { useState, useEffect } from 'react';
import { View, Message } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatView from './components/ChatView';
import GeoView from './components/GeoView';
import TrendsView from './components/TrendsView';
import AboutView from './components/AboutView';
import Homepage from './components/Homepage';

const App: React.FC = () => {
  const [showMainApp, setShowMainApp] = useState(false);
  const [activeView, setActiveView] = useState<View>(View.Chat);
  
  const initialMessages: Message[] = [
    { role: 'model', content: "Hello! I am the Maersk AI Data Analyst. How can I help you explore the Olist e-commerce dataset or answer your questions today?", structuredContent: { visualization: 'text', data: { insights: ["Hello! I am the Maersk AI Data Analyst. How can I help you explore the Olist e-commerce dataset or answer your questions today?"]}, summary: ""}}
  ];
  
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem('maersk-chat-messages');
      return savedMessages ? JSON.parse(savedMessages) : initialMessages;
    } catch (error) {
      console.error("Could not parse messages from localStorage", error);
      return initialMessages;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('maersk-chat-messages', JSON.stringify(messages));
    } catch (error)      {
      console.error("Could not save messages to localStorage", error);
    }
  }, [messages]);


  const handleClearChat = () => {
    setMessages(initialMessages);
  };

  const renderView = () => {
    switch (activeView) {
      case View.Chat:
        return <ChatView messages={messages} setMessages={setMessages} />;
      case View.Geo:
        return <GeoView />;
      case View.Trends:
        return <TrendsView />;
      case View.About:
        return <AboutView />;
      default:
        return <ChatView messages={messages} setMessages={setMessages} />;
    }
  };

  if (!showMainApp) {
    return <Homepage onStart={() => setShowMainApp(true)} />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-100 font-sans text-slate-800 fade-in-app">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onClearChat={handleClearChat} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;