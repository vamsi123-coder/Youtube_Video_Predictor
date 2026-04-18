import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import InputForm from './components/InputForm';
import LoadingState from './components/LoadingState';
import PredictionCards from './components/PredictionCards';
import Charts from './components/Charts';
import AIExplanation from './components/AIExplanation';
import WhatIfPanel from './components/WhatIfPanel';
import Sidebar from './components/Sidebar';
import PerformanceScoreBar from './components/PerformanceScoreBar';
import SEOKeywordSuggestions from './components/SEOKeywordSuggestions';
import OptimalUploadTime from './components/OptimalUploadTime';
import StrategyComparison from './components/StrategyComparison';
import { predictVideo } from './api/predict';

function computeLocalExtras(formData, scaleRatio = 1) {
  const title = formData.title || '';
  const description = formData.description || '';
  const tags = formData.tags || '';
  const lower = title.toLowerCase();
  
  // Sentiment
  const pos = ['amazing','best','great','awesome','top','ultimate','new','incredible','master','unlock','transform','how to','guide','easy','fast','quick','pro','expert','viral','boost','grow','success','win','proven','secret','tips','tricks','strategies','perfect'];
  const neg = ['worst','bad','fail','never','stop','avoid','terrible','scam','warning','danger','mistake','lose','ruin','horrible','hate','don\'t','stop','dumb'];
  let sent = 0.05;
  pos.forEach(w => { if (lower.includes(w)) sent += 0.25; });
  neg.forEach(w => { if (lower.includes(w)) sent -= 0.25; });
  sent = Math.max(-1, Math.min(1, sent));

  // Clickbait
  const power = ['shocking','unbelievable','secret','exposed','amazing','insane','ultimate','truth','never','must watch', 'reasons', 'top', 'why'];
  let cb = 0;
  const words = title.split(' ');
  const caps = words.filter(w => w === w.toUpperCase() && w.length > 1).length / (words.length || 1);
  cb += caps * 2;
  if (/\d/.test(title)) cb += 1.5;
  cb += (title.match(/!/g) || []).length * 1.0;
  power.forEach(w => { if (lower.includes(w)) cb += 2; });
  if (title.includes('?')) cb += 1.5;
  const tl = title.length;
  cb += Math.max(0, 1 - Math.abs(tl - 60) / 60);
  cb = Math.min(10, Math.round(cb * 10) / 10);

  // SEO
  let seo = 0;
  if (tl >= 50 && tl <= 70) seo += 25; else seo += Math.max(0, 25 - Math.abs(tl - 60) / 2);
  const dl = description.length;
  seo += dl > 250 ? 25 : (dl / 250) * 25;
  const tagList = tags.includes('|') ? tags.split('|') : tags.split(',');
  seo += Math.min(tagList.filter(t => t.trim()).length, 12) * 1.5;
  const tSet = new Set(lower.split(' '));
  const dSet = new Set(description.toLowerCase().split(' '));
  const overlap = [...tSet].filter(w => dSet.has(w)).length;
  if (tSet.size > 0) seo += (overlap / tSet.size) * 15;
  seo = Math.min(80, Math.round(seo * 10) / 10);

  return { title_sentiment: sent, clickbait_score: cb, seo_score: seo };
}

// Panel content renderer
function PanelContent({ activePanel, result, extras, formData, isLight }) {
  const panels = {
    // ── Implemented ──
    dashboard: (
      <>
        <PredictionCards result={result} extras={extras} />
        <Charts result={result} extras={extras} formData={formData} isLight={isLight} />
      </>
    ),
    seo: (
      <div className="panel-single-score">
        <PredictionCards result={result} extras={extras} scoreOnly="seo" />
      </div>
    ),
    clickbait: (
      <div className="panel-single-score">
        <PredictionCards result={result} extras={extras} scoreOnly="clickbait" />
      </div>
    ),
    sentiment: (
      <div className="panel-single-score">
        <PredictionCards result={result} extras={extras} scoreOnly="sentiment" />
      </div>
    ),
    ai: <AIExplanation result={result} formData={formData} extras={extras} />,
    whatif: <WhatIfPanel baseLikes={result.predicted_likes} baseEngagement={result.engagement_rate} formData={formData} />,

    // ── New Features ──
    score:      <PerformanceScoreBar extras={extras} result={result} />,
    keywords:   <SEOKeywordSuggestions formData={formData} extras={extras} />,
    uploadtime: <OptimalUploadTime formData={formData} />,
    strategy:   <StrategyComparison baseFormData={formData} />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activePanel}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35 }}
        style={{ width: '100%' }}
      >
        {panels[activePanel] || panels.dashboard}
      </motion.div>
    </AnimatePresence>
  );
}

const PANEL_TITLES = {
  dashboard:  { icon: '📊', title: 'Performance Dashboard',   sub: 'Charts, KPI cards & metrics overview' },
  seo:        { icon: '🔍', title: 'SEO Score',               sub: 'Metadata optimization analysis' },
  clickbait:  { icon: '💡', title: 'Clickbait Score',          sub: 'Title magnetism & curiosity gap analysis' },
  sentiment:  { icon: '❤️', title: 'Sentiment Analysis',       sub: 'Emotional tone of your title' },
  ai:         { icon: '🤖', title: 'AI Insights',              sub: 'Smart action plan & personalized tips' },
  whatif:     { icon: '🎛️', title: 'What-If Simulator',        sub: 'Drag sliders to explore performance changes' },
  score:      { icon: '🏆', title: 'Performance Score',        sub: 'Composite 0–100 score across all dimensions' },
  keywords:   { icon: '🔑', title: 'SEO Keyword Suggestions',  sub: 'Discover keywords your video is missing' },
  uploadtime: { icon: '⏰', title: 'Optimal Upload Time',       sub: '24-hour engagement heatmap by category' },
  strategy:   { icon: '⚖️', title: 'Strategy Comparison',      sub: 'A/B test up to 3 title variants side-by-side' },
};

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [extras, setExtras] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [activePanel, setActivePanel] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Theme Toggle State
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (isLight) document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
  }, [isLight]);

  const howRef  = useRef(null);
  const formRef = useRef(null);
  const resRef  = useRef(null);

  const scrollHow  = () => howRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleSubmit = async (data) => {
    setFormData(data); setLoading(true); setResult(null);
    setExtras(computeLocalExtras(data));
    setActivePanel('dashboard');

    setTimeout(() => resRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);

    try {
      const payload = {
        title: data.title, description: data.description, tags: data.tags,
        video_length: Number(data.video_length), category_id: data.category_id,
        upload_hour: Number(data.upload_hour),
      };

      const res = await predictVideo(payload);
      const subsRatio = Math.max(1, data.channel_subscriber_count / 100000);
      res.predicted_likes *= subsRatio;

      await new Promise(r => setTimeout(r, 1500));
      setResult(res); setLoading(false);
      setTimeout(() => resRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: 'error', title: 'Analysis Failed', text: err?.response?.data?.detail || 'Could not reach backend.',
        background: isLight ? '#fff' : '#1A1A1A', color: isLight ? '#000' : '#fff', confirmButtonColor: '#E11D48',
      });
    }
  };

  const handleReset = () => {
    setResult(null); setFormData(null); setExtras(null);
    setFormKey(k => k + 1); setActivePanel('dashboard');
    setTimeout(() => scrollForm(), 100);
  };

  const handlePanelSelect = (id) => {
    setActivePanel(id);
    setSidebarOpen(false);
  };

  const panelMeta = PANEL_TITLES[activePanel] || PANEL_TITLES.dashboard;

  return (
    <>
      <nav className="navbar">
        <a href="#" className="nav-logo">
          <div className="logo-icon">IQ</div>
          ViralBoost
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <ul className="nav-links">
            <li><a onClick={scrollHow}>How it Works</a></li>
            <li><a onClick={scrollForm}>Analyzer</a></li>
          </ul>
          <button className="theme-toggle" onClick={() => setIsLight(!isLight)} title="Toggle Dark/Light Mode">
            {isLight ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      <Hero onStart={scrollForm} onHowItWorks={scrollHow} />
      <div ref={howRef}><HowItWorks /></div>
      <div ref={formRef}><InputForm key={formKey} onSubmit={handleSubmit} loading={loading} /></div>

      <div ref={resRef} style={{ minHeight: loading || result ? '100vh' : 0 }}>
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingState />
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="results"
              className="results-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Sidebar */}
              <Sidebar
                activePanel={activePanel}
                onSelect={handlePanelSelect}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />

              {/* Main Panel */}
              <main className="results-main">
                {/* Panel Topbar */}
                <div className="panel-topbar card-glass">
                  <div className="panel-topbar-left">
                    <button
                      className="sidebar-menu-btn"
                      onClick={() => setSidebarOpen(o => !o)}
                      title="Toggle sidebar"
                    >
                      ☰
                    </button>
                    <div className="panel-topbar-icon">{panelMeta.icon}</div>
                    <div>
                      <div className="panel-topbar-title">{panelMeta.title}</div>
                      <div className="panel-topbar-sub">{panelMeta.sub}</div>
                    </div>
                  </div>
                  <button className="btn-ghost" onClick={handleReset} style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
                    ↩ New Analysis
                  </button>
                </div>

                {/* Title context banner */}
                <div className="panel-context-banner">
                  <span className="panel-context-label">Analyzing:</span>
                  <span className="panel-context-title">"{formData?.title}"</span>
                  <span className="panel-context-meta">
                    {formData?.category_id} · {formData?.upload_hour}:00 upload
                  </span>
                </div>

                {/* Dynamic Panel Content */}
                <div className="panel-content-area">
                  <PanelContent
                    activePanel={activePanel}
                    result={result}
                    extras={extras}
                    formData={formData}
                    isLight={isLight}
                  />
                </div>
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer style={{ padding: '48px 60px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.9rem' }}>
        <div>
          <strong style={{ color: 'var(--text)', fontFamily: 'Space Grotesk' }}>ViralBoost</strong>
          <div style={{ marginTop: 4 }}>© 2026 AI-Powered Creator Tools. Predict your potential.</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a style={{ cursor: 'pointer' }}>Privacy</a>
          <a style={{ cursor: 'pointer' }}>Terms</a>
        </div>
      </footer>
    </>
  );
}
