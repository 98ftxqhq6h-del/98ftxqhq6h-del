import React from 'react';
import { 
  Bot, 
  GitBranch, 
  TrendingUp, 
  Layers, 
  MessageSquare, 
  BrainCircuit, 
  Mic, 
  FileText, 
  Code, 
  Search, 
  AlertCircle, 
  PlusCircle, 
  GitPullRequest, 
  CheckSquare, 
  GitCommit, 
  Bookmark, 
  PlayCircle,
  Activity,
  BarChart2,
  Shield,
  Gauge,
  Sliders,
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, activeSubTab, setActiveSubTab }) {
  const navSections = [
    {
      id: 'ai',
      title: '🤖 AI Assistant',
      icon: Bot,
      color: 'text-cyan-400',
      items: [
        { id: 'chat', label: 'Chat', icon: MessageSquare },
        { id: 'memory', label: 'Memory', icon: BrainCircuit },
        { id: 'voice', label: 'Voice', icon: Mic },
        { id: 'summarize', label: 'Summarize', icon: FileText },
        { id: 'codegen', label: 'Code Generation', icon: Code }
      ]
    },
    {
      id: 'github',
      title: '💻 GitHub Assistant',
      icon: GitBranch,
      color: 'text-purple-400',
      items: [
        { id: 'search_repo', label: 'Search Repository', icon: Search },
        { id: 'read_issues', label: 'Read Issues', icon: AlertCircle },
        { id: 'create_issue', label: 'Create Issues', icon: PlusCircle },
        { id: 'create_pr', label: 'Create Pull Requests', icon: GitPullRequest },
        { id: 'review_code', label: 'Review Code', icon: CheckSquare },
        { id: 'commit_suggest', label: 'Commit Suggestions', icon: GitCommit },
        { id: 'release_notes', label: 'Release Notes', icon: Bookmark },
        { id: 'cicd_status', label: 'CI/CD Status', icon: PlayCircle }
      ]
    },
    {
      id: 'stock',
      title: '📈 Stock Market Analysis',
      icon: TrendingUp,
      color: 'text-emerald-400',
      items: [
        { id: 'live_prices', label: 'Live Prices', icon: Activity },
        { id: 'technical', label: 'Technical Analysis', icon: BarChart2 },
        { id: 'support_resistance', label: 'Support & Resistance', icon: Shield },
        { id: 'rsi', label: 'RSI Indicator', icon: Gauge },
        { id: 'macd', label: 'MACD', icon: Sliders },
        { id: 'ema', label: 'EMA (20/50/200)', icon: Activity },
        { id: 'news_sentiment', label: 'News Sentiment', icon: FileText },
        { id: 'risk_analysis', label: 'Risk Analysis', icon: Shield },
        { id: 'trade_ideas', label: 'AI Trade Ideas', icon: Sparkles }
      ]
    },
    {
      id: 'integrations',
      title: '⚡ Integrations Hub',
      icon: Layers,
      color: 'text-amber-400',
      items: [
        { id: 'ollama', label: '🧠 Ollama Local', icon: Zap },
        { id: 'openai', label: '⚡ OpenAI GPT', icon: Zap },
        { id: 'xai', label: '🚀 xAI Grok', icon: Zap },
        { id: 'dropbox', label: '📂 Dropbox', icon: Layers },
        { id: 'notion', label: '📝 Notion', icon: FileText },
        { id: 'slack', label: '💬 Slack', icon: MessageSquare },
        { id: 'outlook', label: '📧 Outlook', icon: Bookmark }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0a0e17]/80 backdrop-blur-lg border-r border-cyan-500/20 flex flex-col h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto">
      <div className="p-4 space-y-6">
        {navSections.map((section) => {
          const SectionIcon = section.icon;
          const isSectionActive = activeTab === section.id;

          return (
            <div key={section.id} className="space-y-1">
              {/* Section Category Header */}
              <button
                onClick={() => {
                  setActiveTab(section.id);
                  setActiveSubTab(section.items[0].id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-mono text-sm font-bold transition-all ${
                  isSectionActive
                    ? 'bg-slate-800/80 border border-cyan-500/30 text-white shadow-md shadow-cyan-950/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <SectionIcon className={`w-4 h-4 ${section.color}`} />
                  <span>{section.title}</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isSectionActive ? 'rotate-90 text-cyan-400' : 'text-slate-600'
                  }`}
                />
              </button>

              {/* Sub-item Links */}
              {isSectionActive && (
                <div className="pl-4 pt-1 space-y-1 border-l-2 border-cyan-500/20 ml-3">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isSubActive = activeSubTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSubTab(item.id)}
                        className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                          isSubActive
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                            : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-900/40'
                        }`}
                      >
                        <ItemIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-auto p-4 border-t border-cyan-500/10 bg-slate-950/60 font-mono text-[10px] text-slate-500">
        <div className="flex justify-between items-center">
          <span>STATUS: ONLINE</span>
          <span className="text-emerald-400">100% LATENCY: 12ms</span>
        </div>
      </div>
    </aside>
  );
}
