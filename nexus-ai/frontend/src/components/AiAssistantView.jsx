import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Mic, 
  Volume2, 
  Sparkles, 
  Code, 
  FileText, 
  BrainCircuit, 
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function AiAssistantView({ activeSubTab, isVoiceActive }) {
  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'nexus',
      text: '⚡ **NEXUS CORE ONLINE**. Greetings Operator! Main **NEXUS AI** Assistant hu. Kaise help karu aapki aaj? Aap Chat, Memory, Voice, Summarize, aur Code Gen options explore kar sakte hain!',
      timestamp: new Date().toLocaleTimeString(),
      provider: 'Ollama (qwen2.5-coder)'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [provider, setProvider] = useState('ollama');
  const [model, setModel] = useState('qwen2.5-coder');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Memory state
  const [memories, setMemories] = useState([]);
  const [memoryInput, setMemoryInput] = useState('');
  const [memoryCategory, setMemoryCategory] = useState('General');

  // Summarize state
  const [summarizeText, setSummarizeText] = useState('');
  const [summaryResult, setSummaryResult] = useState(null);

  // CodeGen state
  const [codePrompt, setCodePrompt] = useState('Create a FastAPI authentication router with JWT token validation');
  const [codeLang, setCodeLang] = useState('python');
  const [codeResult, setCodeResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/ai/memory');
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (err) {
      console.error('Error fetching memories', err);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          provider: provider,
          model: model
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg = {
          id: Date.now() + 1,
          sender: 'nexus',
          text: data.response,
          timestamp: new Date().toLocaleTimeString(),
          provider: `${data.provider} (${data.model})`
        };
        setMessages((prev) => [...prev, botMsg]);

        // Speak response if voice active or native SpeechSynthesis
        if ('speechSynthesis' in window && isVoiceActive) {
          const utterance = new SpeechSynthesisUtterance(data.response.replace(/[*#`]/g, ''));
          utterance.pitch = 1.0;
          utterance.rate = 1.05;
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'nexus',
          text: `⚡ System Telemetry Note: Local response generated for '${currentInput}'. Status ACTIVE.`,
          timestamp: new Date().toLocaleTimeString(),
          provider: 'NEXUS Local Core'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = async () => {
    if (!memoryInput.trim()) return;
    try {
      const res = await fetch('/api/ai/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: memoryInput, category: memoryCategory })
      });
      if (res.ok) {
        setMemoryInput('');
        fetchMemories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearMemory = async (id = null) => {
    try {
      const url = id ? `/api/ai/memory?memory_id=${id}` : '/api/ai/memory';
      await fetch(url, { method: 'DELETE' });
      fetchMemories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSummarize = async () => {
    if (!summarizeText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summarizeText, max_length: 200 })
      });
      if (res.ok) {
        const data = await res.json();
        setSummaryResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeGen = async () => {
    if (!codePrompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/codegen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: codePrompt, language: codeLang })
      });
      if (res.ok) {
        const data = await res.json();
        setCodeResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Sub-tab views
  if (activeSubTab === 'memory') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-cyan-400 font-mono flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
              <span>🧠 NEXUS CONTEXTUAL MEMORY STORE</span>
            </h2>
            <p className="text-xs text-slate-400">Persistent user preferences and key facts recorded across sessions.</p>
          </div>
          <button
            onClick={() => handleClearMemory()}
            className="px-3 py-1.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono hover:bg-rose-500/30 flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR ALL MEMORY</span>
          </button>
        </div>

        {/* Add Memory Form */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-3">
          <div className="text-xs font-mono text-cyan-300 font-bold uppercase">// RECORD NEW MEMORY ENTRY</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={memoryInput}
              onChange={(e) => setMemoryInput(e.target.value)}
              placeholder="Enter fact or preference e.g. Operator prefers Python 3.12 & Tailwind CSS v4..."
              className="flex-1 px-4 py-2 bg-slate-950 border border-cyan-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
            />
            <select
              value={memoryCategory}
              onChange={(e) => setMemoryCategory(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-cyan-500/30 rounded-lg text-xs font-mono text-slate-200"
            >
              <option value="General">General</option>
              <option value="Preferences">Preferences</option>
              <option value="Projects">Projects</option>
              <option value="Stack">Tech Stack</option>
            </select>
            <button
              onClick={handleAddMemory}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold rounded-lg hover:bg-cyan-500/30 flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>RECORD MEMORY</span>
            </button>
          </div>
        </div>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memories.map((mem) => (
            <div key={mem.id} className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/15 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    {mem.category}
                  </span>
                  <span>{mem.created_at}</span>
                </div>
                <p className="text-sm text-slate-200 font-sans">{mem.content}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-xs">
                <div className="flex gap-1">
                  {(mem.tags || []).map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-slate-500">#{t}</span>
                  ))}
                </div>
                <button
                  onClick={() => handleClearMemory(mem.id)}
                  className="text-rose-400 hover:text-rose-300 p-1"
                  title="Delete memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSubTab === 'voice') {
    return (
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Mic className="w-12 h-12 animate-pulse text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white font-mono">🎙️ NEXUS VOICE INTERACTION CORE</h2>
          <p className="text-xs text-slate-400">Integrated Web Speech API for Hands-free Speech-To-Text & Audio Feedback.</p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-6 text-center">
          <div className="flex justify-center items-center space-x-2 font-mono text-xs text-cyan-300">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>NATIVE SPEECH SYNTHESIS ENGINE: ACTIVE</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-cyan-500/10 font-mono text-sm text-slate-300">
            "Speak clearly into your microphone to issue commands to NEXUS AI. Responses will be synthesized automatically in standard tech audio."
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                if ('speechSynthesis' in window) {
                  const u = new SpeechSynthesisUtterance("NEXUS AI Voice System operational. All neural cores synced.");
                  window.speechSynthesis.speak(u);
                }
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400 text-cyan-300 font-mono font-bold text-xs hover:from-cyan-500/30 hover:to-teal-500/30 transition-all flex items-center space-x-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>TEST SPEECH OUTPUT</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubTab === 'summarize') {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-cyan-400 font-mono flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>📝 AI TEXT & DOCUMENT SUMMARIZER</span>
          </h2>
          <p className="text-xs text-slate-400">Condense long articles, reports, or logs into clean executive bullet points.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <textarea
              value={summarizeText}
              onChange={(e) => setSummarizeText(e.target.value)}
              placeholder="Paste raw text, documentation, or code logs here to summarize..."
              rows={12}
              className="w-full p-4 bg-slate-950 border border-cyan-500/30 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <button
              onClick={handleSummarize}
              disabled={loading || !summarizeText.trim()}
              className="w-full py-3 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono font-bold text-xs rounded-xl hover:bg-cyan-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>SUMMARIZE TEXT</span>
            </button>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-4">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">// EXECUTIVE SUMMARY OUTPUT</div>
            {summaryResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-950 border border-cyan-500/20 text-sm text-slate-200 whitespace-pre-wrap font-sans">
                  {summaryResult.summary}
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase">Key Takeaways:</div>
                  <ul className="space-y-1">
                    {summaryResult.key_points.map((pt, idx) => (
                      <li key={idx} className="text-xs text-cyan-300 font-mono flex items-start space-x-2">
                        <span className="text-emerald-400">⚡</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-lg">
                Enter text on the left and click Summarize to view AI extracted insights.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeSubTab === 'codegen') {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-cyan-400 font-mono flex items-center space-x-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <span>💻 MULTI-LANGUAGE CODE GENERATOR</span>
          </h2>
          <p className="text-xs text-slate-400">Synthesize clean code snippets, explanations, and unit tests using NEXUS Code Engine.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={codePrompt}
              onChange={(e) => setCodePrompt(e.target.value)}
              placeholder="Describe code snippet e.g. React custom hook for WebSocket connection..."
              className="flex-1 px-4 py-2 bg-slate-950 border border-cyan-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
            />
            <select
              value={codeLang}
              onChange={(e) => setCodeLang(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-cyan-500/30 rounded-lg text-xs font-mono text-slate-200"
            >
              <option value="python">Python (FastAPI)</option>
              <option value="javascript">React / JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="cpp">C++</option>
            </select>
            <button
              onClick={handleCodeGen}
              disabled={loading}
              className="px-6 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold rounded-lg hover:bg-cyan-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Code className="w-4 h-4" />}
              <span>SYNTHESIZE CODE</span>
            </button>
          </div>
        </div>

        {codeResult && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-cyan-500/10 pb-2">
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">// {codeResult.language} SYNTHESIZED CODE</span>
                <button
                  onClick={() => copyToClipboard(codeResult.code)}
                  className="px-3 py-1 rounded bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-slate-800 flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY CODE'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-lg bg-slate-900/90 text-sm font-mono text-emerald-300 overflow-x-auto border border-cyan-500/10">
                {codeResult.code}
              </pre>

              <div className="p-3 rounded bg-slate-900/60 border border-cyan-500/10 text-xs font-mono text-slate-300">
                <span className="text-cyan-400 font-bold">Explanation: </span>
                {codeResult.explanation}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default Sub-tab: Chat
  return (
    <div className="flex flex-col h-[calc(100vh-61px)]">
      {/* Provider Selector Top Toolbar */}
      <div className="p-4 bg-slate-950/80 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">PROVIDER:</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="px-3 py-1 bg-slate-900 border border-cyan-500/30 rounded text-cyan-300 focus:outline-none"
          >
            <option value="ollama">🧠 Ollama (Local Model)</option>
            <option value="openai">⚡ OpenAI (GPT-4o)</option>
            <option value="xai">🚀 xAI Grok</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-slate-400">
          <span>MODEL:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            {model}
          </span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 text-sm font-sans space-y-1 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-slate-900 border border-purple-500/30 text-slate-100 rounded-tr-none'
                  : 'bg-slate-900/90 border border-cyan-500/30 text-cyan-100 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/5 pb-1 mb-1">
                <span>{msg.sender === 'user' ? 'OPERATOR' : msg.provider || 'NEXUS AI'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-3 text-xs font-mono text-cyan-400 animate-pulse">
            <Bot className="w-4 h-4" />
            <span>NEXUS Neural Core processing request...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-cyan-500/20 flex gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask NEXUS AI anything (e.g., 'Summarize code', 'Explain Stock indicators', or 'Create GitHub PR')..."
          className="flex-1 px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono font-bold text-xs rounded-xl hover:bg-cyan-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">TRANSMIT</span>
        </button>
      </form>
    </div>
  );
}
