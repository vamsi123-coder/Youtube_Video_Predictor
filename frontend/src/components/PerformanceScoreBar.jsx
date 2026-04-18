import { motion } from 'framer-motion';

function computeOverallScore(extras, result) {
  if (!extras || !result) return 0;
  // SEO: 0–80 → weight 30%
  const seoNorm = Math.min((extras.seo_score / 80) * 100, 100);
  // Clickbait: ideal 3–6 out of 10 → penalise extremes
  const cb = extras.clickbait_score;
  const cbNorm = cb >= 3 && cb <= 6 ? 100 : cb < 3 ? (cb / 3) * 100 : Math.max(0, 100 - (cb - 6) * 20);
  // Sentiment: -1..1 → map positive as good
  const sentNorm = Math.min(100, Math.max(0, (extras.title_sentiment + 1) * 50));
  // Engagement rate: 0.05+ = high, 0 = 0
  const engNorm = Math.min(100, (result.engagement_rate / 0.07) * 100);

  const score = seoNorm * 0.30 + cbNorm * 0.20 + sentNorm * 0.15 + engNorm * 0.35;
  return Math.round(Math.min(100, score));
}

function getTier(score) {
  if (score >= 75) return { label: 'Excellent', color: 'var(--good)', glow: 'rgba(16,185,129,0.4)', cls: 'badge-good' };
  if (score >= 50) return { label: 'Good',      color: 'var(--accent)', glow: 'rgba(245,158,11,0.4)', cls: 'badge-ok' };
  if (score >= 30) return { label: 'Average',   color: '#f97316', glow: 'rgba(249,115,22,0.4)', cls: 'badge-ok' };
  return              { label: 'Needs Work', color: 'var(--bad)', glow: 'rgba(239,68,68,0.4)', cls: 'badge-low' };
}

const DIMENSIONS = [
  { key: 'seo',       label: 'SEO Score',      icon: '🔍', pct: (e) => Math.min(100, (e.seo_score / 80) * 100) },
  { key: 'clickbait', label: 'Clickbait',       icon: '💡', pct: (e) => { const c = e.clickbait_score; return c >= 3 && c <= 6 ? 100 : c < 3 ? (c/3)*100 : Math.max(0,100-(c-6)*20); } },
  { key: 'sentiment', label: 'Sentiment',       icon: '❤️',  pct: (e) => Math.min(100, Math.max(0, (e.title_sentiment + 1) * 50)) },
  { key: 'engage',    label: 'Engagement',      icon: '📈', pct: (_, r) => Math.min(100, (r.engagement_rate / 0.07) * 100) },
];

export default function PerformanceScoreBar({ extras, result }) {
  const score = computeOverallScore(extras, result);
  const tier = getTier(score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      className="card-glass perf-score-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="perf-score-header">
        <div>
          <div className="section-tag" style={{ margin: 0 }}>Overall Assessment</div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.7rem', fontWeight: 800, marginTop: 6 }}>
            Performance Score
          </h2>
          <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: 4 }}>
            Composite score across SEO, Engagement, Clickbait Balance, and Sentiment
          </p>
        </div>
        <span className={`score-badge ${tier.cls}`} style={{ fontSize: '0.9rem', padding: '8px 20px' }}>
          {tier.label}
        </span>
      </div>

      <div className="perf-score-body">
        {/* Circular Gauge */}
        <div className="perf-gauge-wrap">
          <svg className="perf-gauge" viewBox="0 0 120 120" width="180" height="180">
            {/* Track */}
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="var(--border-hi)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            {/* Progress */}
            <motion.circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke={tier.color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              filter={`drop-shadow(0 0 8px ${tier.glow})`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
            />
          </svg>
          <div className="perf-gauge-center">
            <motion.div
              className="perf-gauge-num"
              style={{ color: tier.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
            >
              {score}
            </motion.div>
            <div className="perf-gauge-label">/ 100</div>
          </div>
        </div>

        {/* Dimension bars */}
        <div className="perf-dimensions">
          {DIMENSIONS.map((dim, i) => {
            const pct = Math.round(dim.pct(extras, result));
            const dimColor = pct >= 70 ? 'var(--good)' : pct >= 40 ? 'var(--accent)' : 'var(--bad)';
            return (
              <motion.div
                key={dim.key}
                className="perf-dim-row"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="perf-dim-top">
                  <span className="perf-dim-label">{dim.icon} {dim.label}</span>
                  <span className="perf-dim-val" style={{ color: dimColor }}>{pct}%</span>
                </div>
                <div className="score-bar-track" style={{ height: 8 }}>
                  <motion.div
                    className="score-bar-fill"
                    style={{ background: dimColor, borderRadius: 99 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 1.0, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tier explanation */}
      <div className="perf-score-footer" style={{ borderColor: tier.color + '44' }}>
        <span style={{ fontSize: '1.2rem' }}>
          {tier.label === 'Excellent' ? '🏆' : tier.label === 'Good' ? '✅' : tier.label === 'Average' ? '📊' : '⚠️'}
        </span>
        <div>
          <div style={{ fontWeight: 700, color: tier.color, fontSize: '0.9rem' }}>{tier.label} Performance</div>
          <div style={{ color: 'var(--text-soft)', fontSize: '0.82rem', marginTop: 2 }}>
            {tier.label === 'Excellent' && 'Outstanding! Your video has strong signals across all dimensions. Expect above-average performance.'}
            {tier.label === 'Good' && 'Solid performance potential. A few tweaks to SEO or clickbait balance can push you to Excellent.'}
            {tier.label === 'Average' && 'Decent foundation. Focus on boosting SEO score (add more tags & longer description) and improving engagement signals.'}
            {tier.label === 'Needs Work' && 'Several areas need attention. Start with SEO (tags + description) and ensure your upload time is in the 3PM–8PM window.'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
