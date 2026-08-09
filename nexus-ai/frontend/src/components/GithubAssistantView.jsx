import React, { useState, useEffect } from 'react';
import { 
  Search, 
  AlertCircle, 
  PlusCircle, 
  GitPullRequest, 
  CheckSquare, 
  GitCommit, 
  Bookmark, 
  PlayCircle, 
  Star, 
  GitFork, 
  ExternalLink,
  RefreshCw,
  Check,
  Copy
} from 'lucide-react';

export default function GithubAssistantView({ activeSubTab }) {
  // Repo search state
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('98ftxqhq6h-del');

  // Issues state
  const [issues, setIssues] = useState([]);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueBody, setIssueBody] = useState('');

  // PR state
  const [prTitle, setPrTitle] = useState('feat(nexus-ai): add stock market technical indicators suite');
  const [prHead, setPrHead] = useState('feature/stock-indicators');
  const [prResult, setPrResult] = useState(null);

  // Review state
  const [codeToReview, setCodeToReview] = useState(`def process_user_query(query: str):
    try:
        eval(query) # Dynamic evaluation
    except:
        pass
    print("Logged: " + query)`);
  const [reviewResult, setReviewResult] = useState(null);

  // Commit suggestion state
  const [diffInput, setDiffInput] = useState(`diff --git a/backend/main.py b/backend/main.py
+ @app.get("/api/stocks/indicators")
+ def get_stock_indicators():
+     return StockService.get_technical_analysis()`);
  const [commitResult, setCommitResult] = useState(null);

  // Release notes state
  const [version, setVersion] = useState('v2.5.0');
  const [releaseNotesResult, setReleaseNotesResult] = useState(null);

  // CI/CD state
  const [cicdRuns, setCicdRuns] = useState([]);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchRepos();
    fetchIssues();
    fetchCicd();
  }, []);

  const fetchRepos = async () => {
    try {
      const res = await fetch(`/api/github/repos?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await fetch('/api/github/issues');
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCicd = async () => {
    try {
      const res = await fetch('/api/github/cicd');
      if (res.ok) {
        const data = await res.json();
        setCicdRuns(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateIssue = async () => {
    if (!issueTitle.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/github/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo: '98ftxqhq6h-del/98ftxqhq6h-del.github.io',
          title: issueTitle,
          body: issueBody
        })
      });
      if (res.ok) {
        setIssueTitle('');
        setIssueBody('');
        fetchIssues();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePR = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/github/pulls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo: '98ftxqhq6h-del/98ftxqhq6h-del.github.io',
          title: prTitle,
          head: prHead
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPrResult(data.pull_request);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewCode = async () => {
    if (!codeToReview.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/github/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToReview })
      });
      if (res.ok) {
        const data = await res.json();
        setReviewResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommitSuggestion = async () => {
    if (!diffInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/github/commit-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diff: diffInput })
      });
      if (res.ok) {
        const data = await res.json();
        setCommitResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/github/release-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: version })
      });
      if (res.ok) {
        const data = await res.json();
        setReleaseNotesResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (t) => {
    navigator.clipboard.writeText(t);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (activeSubTab === 'read_issues' || activeSubTab === 'create_issue') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-purple-400 font-mono flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-purple-400" />
              <span>💻 GITHUB ISSUES DASHBOARD</span>
            </h2>
            <p className="text-xs text-slate-400">Read open issues and dispatch automated issue tracking.</p>
          </div>
        </div>

        {/* Create Issue Section */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 space-y-3">
          <div className="text-xs font-mono text-purple-300 font-bold uppercase">// CREATE NEW GITHUB ISSUE</div>
          <div className="space-y-3">
            <input
              type="text"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="Issue title e.g. Fix Web Speech API audio buffer overflow..."
              className="w-full px-4 py-2 bg-slate-950 border border-purple-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-purple-400"
            />
            <textarea
              value={issueBody}
              onChange={(e) => setIssueBody(e.target.value)}
              placeholder="Detailed issue description..."
              rows={3}
              className="w-full p-3 bg-slate-950 border border-purple-500/30 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={handleCreateIssue}
              disabled={loading || !issueTitle.trim()}
              className="px-6 py-2 bg-purple-500/20 border border-purple-400 text-purple-300 font-mono text-xs font-bold rounded-lg hover:bg-purple-500/30 flex items-center space-x-2 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>DISPATCH ISSUE</span>
            </button>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-3">
          {issues.map((issue) => (
            <div key={issue.number} className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/15 hover:border-purple-500/30 transition-all flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-purple-400 font-bold">#{issue.number}</span>
                  <span className="text-sm font-semibold text-slate-100">{issue.title}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                  <span>Author: {issue.author}</span>
                  <span>Comments: {issue.comments}</span>
                  <span>{issue.created_at}</span>
                </div>
              </div>
              <a
                href={issue.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded bg-purple-950 border border-purple-500/30 text-xs font-mono text-purple-300 hover:bg-purple-900 flex items-center space-x-1"
              >
                <span>OPEN</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSubTab === 'create_pr') {
    return (
      <div className="p-6 space-y-6 max-w-3xl">
        <div>
          <h2 className="text-xl font-bold text-purple-400 font-mono flex items-center space-x-2">
            <GitPullRequest className="w-5 h-5 text-purple-400" />
            <span>🚀 AUTOMATED PULL REQUEST GENERATOR</span>
          </h2>
          <p className="text-xs text-slate-400">Synthesize Pull Requests with automated description and branch mapping.</p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/80 border border-purple-500/20 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">PR Title:</label>
              <input
                type="text"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-purple-500/30 rounded-lg text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Head Branch:</label>
              <input
                type="text"
                value={prHead}
                onChange={(e) => setPrHead(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-purple-500/30 rounded-lg text-sm text-slate-200 font-mono"
              />
            </div>

            <button
              onClick={handleCreatePR}
              disabled={loading}
              className="w-full py-3 bg-purple-500/20 border border-purple-400 text-purple-300 font-mono font-bold text-xs rounded-xl hover:bg-purple-500/30 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <GitPullRequest className="w-4 h-4" />}
              <span>CREATE PULL REQUEST</span>
            </button>
          </div>

          {prResult && (
            <div className="p-4 rounded-lg bg-slate-950 border border-purple-500/30 space-y-2 font-mono text-xs">
              <div className="text-emerald-400 font-bold">✅ PULL REQUEST SYNTHESIZED SUCCESSFULLY!</div>
              <div className="text-slate-300">PR #{prResult.number}: {prResult.title}</div>
              <div className="text-slate-400">Branch: {prResult.head} → {prResult.base}</div>
              <a
                href={prResult.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-purple-400 underline pt-1"
              >
                <span>View PR on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeSubTab === 'review_code') {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-purple-400 font-mono flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-purple-400" />
            <span>🛡️ AI CODE REVIEWER & AUDITOR</span>
          </h2>
          <p className="text-xs text-slate-400">Automated security scanning, code quality rating, and best-practice recommendations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <textarea
              value={codeToReview}
              onChange={(e) => setCodeToReview(e.target.value)}
              rows={12}
              className="w-full p-4 bg-slate-950 border border-purple-500/30 rounded-xl text-sm font-mono text-purple-200 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={handleReviewCode}
              disabled={loading}
              className="w-full py-3 bg-purple-500/20 border border-purple-400 text-purple-300 font-mono font-bold text-xs rounded-xl hover:bg-purple-500/30 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
              <span>RUN AUTOMATED CODE REVIEW</span>
            </button>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/80 border border-purple-500/20 space-y-4">
            <div className="text-xs font-mono text-purple-400 font-bold uppercase">// CODE REVIEW TELEMETRY REPORT</div>
            {reviewResult ? (
              <div className="space-y-4 font-mono">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-slate-950 border border-purple-500/20">
                    <span className="text-[10px] text-slate-400 block">QUALITY SCORE</span>
                    <span className="text-lg font-bold text-emerald-400">{reviewResult.score} / 100</span>
                  </div>
                  <div className="p-3 rounded bg-slate-950 border border-purple-500/20">
                    <span className="text-[10px] text-slate-400 block">SECURITY RATING</span>
                    <span className="text-lg font-bold text-purple-300">{reviewResult.security_rating}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-300 font-bold">SUGGESTIONS & FINDINGS:</span>
                  <div className="space-y-2">
                    {reviewResult.suggestions.map((s, idx) => (
                      <div key={idx} className="p-3 rounded bg-slate-950 border border-purple-500/20 text-xs text-slate-200">
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-lg">
                Click Run Automated Code Review to inspect code quality and security.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeSubTab === 'commit_suggest') {
    return (
      <div className="p-6 space-y-6 max-w-3xl">
        <div>
          <h2 className="text-xl font-bold text-purple-400 font-mono flex items-center space-x-2">
            <GitCommit className="w-5 h-5 text-purple-400" />
            <span>📝 AI COMMIT MESSAGE SUGGESTER</span>
          </h2>
          <p className="text-xs text-slate-400">Generate Conventional Commits based on git diffs.</p>
        </div>

        <div className="space-y-4">
          <textarea
            value={diffInput}
            onChange={(e) => setDiffInput(e.target.value)}
            rows={8}
            className="w-full p-4 bg-slate-950 border border-purple-500/30 rounded-xl text-xs font-mono text-slate-200"
          />
          <button
            onClick={handleCommitSuggestion}
            disabled={loading}
            className="w-full py-3 bg-purple-500/20 border border-purple-400 text-purple-300 font-mono font-bold text-xs rounded-xl hover:bg-purple-500/30 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <GitCommit className="w-4 h-4" />}
            <span>GENERATE COMMIT MESSAGE</span>
          </button>

          {commitResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-300 font-bold">// SUGGESTED CONVENTIONAL COMMIT</span>
                <button
                  onClick={() => copyText(commitResult.suggested_commit)}
                  className="px-3 py-1 rounded bg-slate-900 border border-purple-500/30 text-xs text-purple-300 hover:bg-slate-800 flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <pre className="p-3 rounded bg-slate-900 text-xs text-emerald-300 whitespace-pre-wrap border border-purple-500/10">
                {commitResult.suggested_commit}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeSubTab === 'release_notes') {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-purple-400 font-mono flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-purple-400" />
            <span>🔖 AUTOMATED RELEASE NOTES SYNTHESIZER</span>
          </h2>
          <p className="text-xs text-slate-400">Generate clean markdown release notes for your target version release.</p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="Version tag e.g. v2.5.0"
            className="px-4 py-2 bg-slate-950 border border-purple-500/30 rounded-lg text-xs font-mono text-slate-200"
          />
          <button
            onClick={handleReleaseNotes}
            disabled={loading}
            className="px-6 py-2 bg-purple-500/20 border border-purple-400 text-purple-300 font-mono text-xs font-bold rounded-lg hover:bg-purple-500/30 flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bookmark className="w-4 h-4" />}
            <span>SYNTHESIZE RELEASE NOTES</span>
          </button>
        </div>

        {releaseNotesResult && (
          <div className="p-6 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
              <span className="text-xs text-purple-300 font-bold">// RELEASE NOTES ({releaseNotesResult.version})</span>
              <button
                onClick={() => copyText(releaseNotesResult.release_notes_md)}
                className="px-3 py-1 rounded bg-slate-900 border border-purple-500/30 text-xs text-purple-300 hover:bg-slate-800 flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED' : 'COPY MARKDOWN'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-slate-900 text-xs text-slate-200 whitespace-pre-wrap overflow-x-auto border border-purple-500/10">
              {releaseNotesResult.release_notes_md}
            </pre>
          </div>
        )}
      </div>
    );
  }

  if (activeSubTab === 'cicd_status') {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-purple-400 font-mono flex items-center space-x-2">
            <PlayCircle className="w-5 h-5 text-purple-400" />
            <span>⚡ GITHUB ACTIONS CI/CD TELEMETRY</span>
          </h2>
          <p className="text-xs text-slate-400">Live workflow runs and build status monitoring.</p>
        </div>

        <div className="space-y-3">
          {cicdRuns.map((run) => (
            <div key={run.id} className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 flex items-center justify-between font-mono">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${run.conclusion === 'success' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400 animate-pulse'}`} />
                  <span className="text-sm font-bold text-slate-100">{run.workflow_name}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Branch: <span className="text-purple-300">{run.branch}</span> ({run.commit}) • Duration: {run.duration}
                </div>
              </div>
              <span className={`px-3 py-1 rounded text-xs uppercase font-bold border ${run.conclusion === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'}`}>
                {run.conclusion || run.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: Search Repository
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-purple-400 font-mono flex items-center space-x-2">
          <Search className="w-5 h-5 text-purple-400" />
          <span>🔍 GITHUB REPOSITORY SEARCH ENGINE</span>
        </h2>
        <p className="text-xs text-slate-400">Explore repositories, star counts, forks, and code branches.</p>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search repositories e.g. 98ftxqhq6h-del..."
          className="flex-1 px-4 py-2 bg-slate-950 border border-purple-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-purple-400"
        />
        <button
          onClick={fetchRepos}
          className="px-6 py-2 bg-purple-500/20 border border-purple-400 text-purple-300 font-mono text-xs font-bold rounded-lg hover:bg-purple-500/30 flex items-center space-x-1"
        >
          <Search className="w-4 h-4" />
          <span>SEARCH</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((repo) => (
          <div key={repo.id} className="p-5 rounded-xl bg-slate-900/80 border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="text-purple-300 font-bold">{repo.language}</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-wide">{repo.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{repo.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-purple-500/10 text-xs font-mono">
              <div className="flex items-center space-x-3 text-slate-300">
                <span className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>{repo.stars}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <GitFork className="w-3.5 h-3.5 text-purple-400" />
                  <span>{repo.forks}</span>
                </span>
              </div>

              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 flex items-center space-x-1"
              >
                <span>REPO</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
