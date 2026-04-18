import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const CATEGORY_KEYWORDS = {
  'Science & Technology': [
    'AI tutorial', 'machine learning', 'Python programming', 'tech review 2025',
    'artificial intelligence', 'data science', 'coding tips', 'software development',
    'gadget review', 'smartphone', 'cloud computing', 'cybersecurity', 'automation',
  ],
  'Education': [
    'how to learn', 'study tips', 'online course', 'free tutorial', 'beginner guide',
    'step by step', 'explained simply', 'learn fast', 'crash course', 'for beginners',
    'complete guide', 'masterclass', 'productivity hacks',
  ],
  'Gaming': [
    'gameplay walkthrough', 'best settings', 'pro tips', 'game review', 'speedrun',
    'hidden secrets', 'tier list', 'beginner guide', 'best build', 'update reaction',
    'versus', 'challenge', 'no commentary',
  ],
  'Entertainment': [
    'funny moments', 'reaction video', 'viral trend', 'challenge accepted', 'must watch',
    'compilation', 'best moments', 'behind the scenes', 'full episode', 'top 10',
  ],
  'Howto & Style': [
    'DIY tutorial', 'step by step', 'beginner guide', 'how to make', 'easy recipe',
    'life hack', 'makeover', 'transformation', 'tips and tricks', 'budget friendly',
    'home decor', 'fashion haul', 'outfit ideas',
  ],
  'Music': [
    'official music video', 'lyrics', 'cover song', 'instrumental', 'live performance',
    'reaction', 'beats', 'lo-fi', 'playlist', 'new release 2025', 'remix',
  ],
  'News & Politics': [
    'breaking news', 'analysis', 'explained', 'what happened', 'update today',
    'full interview', 'reaction', 'fact check', 'live coverage',
  ],
  'Sports': [
    'highlights', 'best goals', 'training tips', 'match analysis', 'reaction',
    'top plays', 'workout routine', 'fitness tips', 'championship',
  ],
  'People & Blogs': [
    'day in my life', 'vlog', 'my story', 'Q&A', 'routine', 'morning routine',
    'travel vlog', 'experience', 'honest review', 'life update',
  ],
  'Comedy': [
    'funny', 'hilarious', 'try not to laugh', 'prank', 'parody', 'skit',
    'stand up comedy', 'reaction', 'roast', 'compilation',
  ],
  'Film & Animation': [
    'movie review', 'animation tutorial', 'film analysis', 'trailer reaction',
    'fan theory', 'breakdown', 'top movies 2025', 'short film',
  ],
};

const DEFAULT_KEYWORDS = [
  'top 10', 'how to', 'beginners guide', 'tutorial 2025', 'step by step',
  'explained', 'tips and tricks', 'must watch', 'complete guide', 'free',
];

function extractFromTitle(title) {
  if (!title) return [];
  const words = title.toLowerCase().split(/\s+/);
  const stopwords = new Set(['a','an','the','is','in','on','at','to','for','of','and','or','but','with','by','from','this','that','it','as','are','was','be','have','do','will','my','your','our','their','we','they','he','she','i','you','what','how','why','when','which','who']);
  return words.filter(w => w.length > 3 && !stopwords.has(w)).map(w => w.replace(/[^a-z0-9]/g,''));
}

function getVolumeDot(keyword) {
  // Heuristic pseudo-volume based on keyword length and common patterns
  const k = keyword.toLowerCase();
  if (['how to','tutorial','guide','tips','best','top'].some(p => k.includes(p))) return 'high';
  if (k.length < 6) return 'high';
  if (k.length < 12) return 'medium';
  return 'low';
}

const VOL_META = {
  high:   { label: 'High',   color: 'var(--good)',   dot: '#10b981' },
  medium: { label: 'Medium', color: 'var(--accent)',  dot: '#f59e0b' },
  low:    { label: 'Low',    color: 'var(--bad)',     dot: '#ef4444' },
};

function KeywordChip({ keyword, source }) {
  const vol = getVolumeDot(keyword);
  const meta = VOL_META[vol];
  return (
    <motion.div
      className="kw-chip"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <span className="kw-dot" style={{ background: meta.dot }} />
      <span className="kw-text">{keyword}</span>
      <span className="kw-vol" style={{ color: meta.color }}>{meta.label}</span>
      {source === 'title' && <span className="kw-tag">from title</span>}
    </motion.div>
  );
}

export default function SEOKeywordSuggestions({ formData, extras }) {
  const [search, setSearch] = useState('');

  const categoryKws = CATEGORY_KEYWORDS[formData?.category_id] || DEFAULT_KEYWORDS;
  const titleKws = useMemo(() => extractFromTitle(formData?.title), [formData?.title]);

  const userTags = useMemo(() => {
    if (!formData?.tags) return [];
    return formData.tags.split(',').map(t => t.trim()).filter(Boolean);
  }, [formData?.tags]);

  const missing = categoryKws.filter(k => !userTags.some(t => t.toLowerCase().includes(k.toLowerCase())));
  const filtered = search ? missing.filter(k => k.toLowerCase().includes(search.toLowerCase())) : missing;

  const seo = extras?.seo_score ?? 0;
  const tagCount = userTags.length;

  return (
    <motion.div
      className="card-glass kw-panel"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="kw-header">
        <div>
          <div className="section-tag" style={{ margin: 0 }}>SEO Enhancement</div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.6rem', marginTop: 6 }}>
            SEO Keyword Suggestions
          </h2>
          <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: 4 }}>
            Category-matched keywords your video is missing. Add them to boost discoverability.
          </p>
        </div>
        <div className="kw-seo-score-pill" style={{ borderColor: seo >= 55 ? 'var(--good)' : 'var(--accent)' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: seo >= 55 ? 'var(--good)' : 'var(--accent)' }}>
            {seo.toFixed(0)}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>/ 80 SEO</span>
        </div>
      </div>

      {/* Current Tags */}
      {userTags.length > 0 && (
        <div className="kw-section">
          <div className="kw-section-title">✅ Your Current Tags ({tagCount})</div>
          <div className="kw-chip-wrap">
            {userTags.slice(0, 15).map(t => (
              <span key={t} className="kw-current-tag">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords from title */}
      {titleKws.length > 0 && (
        <div className="kw-section">
          <div className="kw-section-title">📝 Extracted from Your Title</div>
          <div className="kw-chip-wrap">
            {titleKws.map(k => <KeywordChip key={k} keyword={k} source="title" />)}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="kw-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="kw-section-title" style={{ marginBottom: 0 }}>
            🔑 Suggested Keywords for "{formData?.category_id || 'your category'}"
          </div>
          <input
            className="kw-search"
            placeholder="Filter..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 && (
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem', padding: '16px 0' }}>
            🎉 You're already using all suggested keywords!
          </div>
        )}

        <div className="kw-chip-wrap">
          {filtered.map((k, i) => (
            <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
              <KeywordChip keyword={k} source="suggested" />
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(99,102,241,0.07)', border: '1px dashed rgba(99,102,241,0.25)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          💡 Add high-volume keywords to your <strong style={{ color: 'var(--text-soft)' }}>tags field</strong> and sprinkle them naturally into your <strong style={{ color: 'var(--text-soft)' }}>description</strong> to improve SEO score.
        </div>
      </div>

      {/* Volume Legend */}
      <div className="kw-legend">
        {Object.entries(VOL_META).map(([k, v]) => (
          <div key={k} className="kw-legend-item">
            <span className="kw-dot" style={{ background: v.dot }} />
            <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{v.label} Search Volume</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
