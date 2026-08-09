import React, { useState, useEffect } from 'react';
import { Layers, Zap, CheckCircle2, RefreshCw, AlertCircle, Settings, Play } from 'lucide-react';

export default function IntegrationsView() {
  const [connectors, setConnectors] = useState([]);
  const [testingId, setTestingId] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('/api/integrations/status');
      if (res.ok) {
        const data = await res.json();
        setConnectors(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestConnector = async (id) => {
    setTestingId(id);
    setTestResult(null);
    try {
      const res = await fetch(`/api/integrations/test/${id}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-amber-400 font-mono flex items-center space-x-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>⚡ NEXUS INTEGRATIONS HUB</span>
        </h2>
        <p className="text-xs text-slate-400">Active status and live endpoints for AI Providers, Cloud Storage, Notion, Slack, & Outlook.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {connectors.map((c) => (
          <div key={c.id} className="p-5 rounded-xl bg-slate-900/80 border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{c.icon}</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${c.is_active ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {c.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-wide">{c.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">Endpoint: {c.endpoint}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-amber-500/10 text-xs font-mono">
              {c.models && (
                <div>
                  <span className="text-slate-500 block text-[10px]">AVAILABLE MODELS:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {c.models.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-amber-500/20 text-[10px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {c.features && (
                <div>
                  <span className="text-slate-500 block text-[10px]">CONNECTOR FEATURES:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {c.features.map((f, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleTestConnector(c.id)}
                disabled={testingId === c.id}
                className="w-full py-2 bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold rounded-lg hover:bg-amber-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {testingId === c.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>TEST CONNECTOR</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {testResult && (
        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 font-mono text-xs text-amber-300 space-y-1">
          <div className="font-bold flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>TEST COMPLETED ({testResult.integration_id.toUpperCase()})</span>
          </div>
          <div>{testResult.message}</div>
          <div className="text-slate-500 text-[10px]">Latency: {testResult.latency} • Timestamp: {testResult.tested_at}</div>
        </div>
      )}
    </div>
  );
}
