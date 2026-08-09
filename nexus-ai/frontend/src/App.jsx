import React, { useState } from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AiAssistantView from './components/AiAssistantView';
import GithubAssistantView from './components/GithubAssistantView';
import StockAnalysisView from './components/StockAnalysisView';
import IntegrationsView from './components/IntegrationsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('ai');
  const [activeSubTab, setActiveSubTab] = useState('chat');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [activeProvider, setActiveProvider] = useState('ollama');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'ai':
        return (
          <AiAssistantView
            activeSubTab={activeSubTab}
            isVoiceActive={isVoiceActive}
            setActiveProvider={setActiveProvider}
          />
        );
      case 'github':
        return <GithubAssistantView activeSubTab={activeSubTab} />;
      case 'stock':
        return <StockAnalysisView activeSubTab={activeSubTab} />;
      case 'integrations':
        return <IntegrationsView activeSubTab={activeSubTab} />;
      default:
        return (
          <AiAssistantView
            activeSubTab={activeSubTab}
            isVoiceActive={isVoiceActive}
            setActiveProvider={setActiveProvider}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100 relative overflow-hidden flex flex-col">
      {/* 3D Cyber Particle Background Canvas */}
      <BackgroundCanvas />

      {/* Top Header Telemetry Bar */}
      <Header
        isVoiceActive={isVoiceActive}
        setIsVoiceActive={setIsVoiceActive}
        activeProvider={activeProvider}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 relative z-10">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
        />

        {/* Dynamic Content Panel */}
        <main className="flex-1 overflow-y-auto bg-[#080b12]/60 backdrop-blur-md">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
