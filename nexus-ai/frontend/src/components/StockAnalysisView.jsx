import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart2, 
  Shield, 
  Gauge, 
  Sliders, 
  FileText, 
  Sparkles, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function StockAnalysisView({ activeSubTab }) {
  const [selectedSymbol, setSelectedSymbol] = useState('NVDA');
  const [livePrices, setLivePrices] = useState([]);
  const [history, setHistory] = useState([]);
  const [technicals, setTechnicals] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [risk, setRisk] = useState(null);
  const [tradeIdeas, setTradeIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLivePrices();
    const timer = setInterval(fetchLivePrices, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchStockDetails(selectedSymbol);
  }, [selectedSymbol]);

  const fetchLivePrices = async () => {
    try {
      const res = await fetch('/api/stocks/live');
      if (res.ok) {
        const data = await res.json();
        setLivePrices(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStockDetails = async (symbol) => {
    setLoading(true);
    try {
      const [histRes, techRes, sentRes, riskRes, tradeRes] = await Promise.all([
        fetch(`/api/stocks/history?symbol=${symbol}`),
        fetch(`/api/stocks/technical?symbol=${symbol}`),
        fetch(`/api/stocks/sentiment?symbol=${symbol}`),
        fetch(`/api/stocks/risk?symbol=${symbol}`),
        fetch(`/api/stocks/trade-ideas?symbol=${symbol}`)
      ]);

      if (histRes.ok) setHistory(await histRes.json());
      if (techRes.ok) setTechnicals(await techRes.json());
      if (sentRes.ok) setSentiment(await sentRes.json());
      if (riskRes.ok) setRisk(await riskRes.json());
      if (tradeRes.ok) setTradeIdeas(await tradeRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Live Ticker Bar */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/20 overflow-x-auto shadow-md">
        <div className="flex items-center space-x-6 min-w-max">
          {livePrices.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => setSelectedSymbol(stock.symbol)}
              className={`p-2.5 rounded-lg font-mono text-xs transition-all flex items-center space-x-3 border ${
                selectedSymbol === stock.symbol
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-emerald-500/30'
              }`}
            >
              <div>
                <span className="font-bold text-white block">{stock.symbol}</span>
                <span className="text-[10px] text-slate-400 font-sans">{stock.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold block">${stock.price.toFixed(2)}</span>
                <span className={`text-[10px] flex items-center justify-end font-bold ${stock.is_up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stock.is_up ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
                  {stock.change_percent}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Stock Analysis Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-black text-white font-mono tracking-wider">{selectedSymbol}</h2>
            <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold">
              {technicals?.overall_technical_bias || 'BULLISH'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">Real-time Stock Technical Indicators & AI Predictive Trade Models</p>
        </div>

        <div className="flex gap-2">
          {['NVDA', 'AAPL', 'TSLA', 'BTC-USD'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSymbol(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                selectedSymbol === s
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price Chart */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-slate-400">
          <span className="text-emerald-400 font-bold uppercase">// 30-DAY PRICE TREND & VOLUME Telemetry</span>
          <span>CURRENCY: USD</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#10b981', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#priceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technical Indicators Cards */}
      {technicals && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* RSI Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span>RSI (14)</span>
              </span>
              <span className="text-emerald-300 font-bold">{technicals.indicators.rsi_14.value}</span>
            </div>
            <div className="text-base font-bold text-white font-mono">{technicals.indicators.rsi_14.signal}</div>
            <p className="text-[11px] text-slate-400 leading-tight">{technicals.indicators.rsi_14.interpretation}</p>
          </div>

          {/* MACD Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>MACD HISTOGRAM</span>
              </span>
              <span className="text-emerald-300 font-bold">+{technicals.indicators.macd.histogram}</span>
            </div>
            <div className="text-base font-bold text-white font-mono">{technicals.indicators.macd.signal}</div>
            <p className="text-[11px] text-slate-400 leading-tight">MACD Line ({technicals.indicators.macd.macd_line}) crossed above Signal Line.</p>
          </div>

          {/* EMA Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>EMA OVERLAY</span>
              </span>
              <span className="text-emerald-300 font-bold">{technicals.indicators.ema.trend_summary}</span>
            </div>
            <div className="text-xs font-mono text-slate-300 space-y-1">
              <div>EMA 20: <span className="text-emerald-400 font-bold">${technicals.indicators.ema.ema_20}</span></div>
              <div>EMA 50: <span className="text-emerald-400 font-bold">${technicals.indicators.ema.ema_50}</span></div>
              <div>EMA 200: <span className="text-emerald-400 font-bold">${technicals.indicators.ema.ema_200}</span></div>
            </div>
          </div>

          {/* Support & Resistance */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>SUPPORT & RESISTANCE</span>
              </span>
            </div>
            <div className="text-xs font-mono space-y-1">
              <div className="text-rose-400">R2: ${technicals.indicators.support_resistance.resistance_2}</div>
              <div className="text-rose-300">R1: ${technicals.indicators.support_resistance.resistance_1}</div>
              <div className="text-emerald-300">S1: ${technicals.indicators.support_resistance.support_1}</div>
              <div className="text-emerald-400">S2: ${technicals.indicators.support_resistance.support_2}</div>
            </div>
          </div>
        </div>
      )}

      {/* AI Trade Ideas Deck */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-emerald-400 font-mono flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>⚡ AI SYNTHESIZED TRADE IDEAS</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tradeIdeas.map((idea, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-4 shadow-lg shadow-emerald-950/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-white font-mono">{idea.symbol}</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold block">{idea.trade_type}</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                  CONFIDENCE {idea.confidence_score}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-400 block">ENTRY ZONE</span>
                  <span className="text-white font-bold">{idea.entry_zone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">STOP LOSS</span>
                  <span className="text-rose-400 font-bold">{idea.stop_loss}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">TARGET 1</span>
                  <span className="text-emerald-400 font-bold">{idea.target_1}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">TARGET 2</span>
                  <span className="text-emerald-300 font-bold">{idea.target_2}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">{idea.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
