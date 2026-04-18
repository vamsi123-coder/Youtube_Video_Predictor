import { motion } from 'framer-motion';

const SCORE_META = {
  seo: {
    label: 'SEO Score',
    icon: '🔍',
    max: 80,
    what: 'Measures how well your title, description, and tags are optimized for YouTube\'s search algorithm.',
    thresholds: [
      { min: 55, badge: 'Excellent', cls: 'badge-good', color: 'var(--green)' },
      { min: 35, badge: 'Good',      cls: 'badge-good', color: 'var(--blue)' },
      { min: 15, badge: 'Average',   cls: 'badge-ok',   color: 'var(--amber)' },
      { min: 0,  badge: 'Weak',      cls: 'badge-low',  color: 'var(--red)' },
    ],
    tips: (v) => v < 35 ? 'Add more tags (aim for 10+), write a longer description (250+ chars), and make your title 50–70 characters long.' : 'Your SEO is strong. Keep keyword-rich descriptions and consistent tagging.',
    gradient: 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
  },
  clickbait: {
    label: 'Clickbait Score',
    icon: '💡',
    max: 10,
    what: 'Measures curiosity gap, power words, capitalization, numbers, and emotional triggers in your title. Balanced scores (2–6) perform best.',
    thresholds: [
      { min: 4,  badge: 'High',   cls: 'badge-good', color: 'var(--green)' },
      { min: 2,  badge: 'Medium', cls: 'badge-ok',   color: 'var(--amber)' },
      { min: 0,  badge: 'Low',    cls: 'badge-low',  color: 'var(--red)' },
    ],
    tips: (v) => v < 2 ? 'Your title is too plain. Try adding a number ("10 reasons..."), a power word ("Ultimate", "Secret"), or a question mark.' : v > 7 ? 'Very aggressive clickbait can hurt retention. Deliver on your title\'s promise.' : 'Good clickbait balance — engaging without being misleading.',
    gradient: 'linear-gradient(90deg, #F59E0B, #EF4444)',
  },
  sentiment: {
    label: 'Title Sentiment',
    icon: '❤️',
    max: 1,
    what: 'Analyzes the emotional tone of your title using NLP. Positive sentiment (0.2–0.8) correlates with higher like-to-view ratios.',
    thresholds: [
      { min: 0.2,  badge: 'Positive', cls: 'badge-good', color: 'var(--green)' },
      { min: -0.1, badge: 'Neutral',  cls: 'badge-ok',   color: 'var(--amber)' },
      { min: -1,   badge: 'Negative', cls: 'badge-low',  color: 'var(--red)' },
    ],
    tips: (v) => v < 0.1 ? 'Your title has neutral or negative sentiment. Try adding a positive outcome word like "improve", "achieve", "master", or "unlock".' : 'Great positive sentiment! Viewers respond well to titles that promise a positive outcome.',
    gradient: 'linear-gradient(90deg, #10B981, #059669)',
  },
};

function getBadge(meta, value) {
  return meta.thresholds.find(t => value >= t.min) || meta.thresholds[meta.thresholds.length - 1];
}

function ScoreCard({ type, value, delay }) {
  const meta = SCORE_META[type];
  const badge = getBadge(meta, value);
  const pct = Math.min((Math.abs(value) / meta.max) * 100, 100);
  const displayVal = type === 'sentiment' ? (value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2)) : value.toFixed(2);

  return (
    <motion.div
      className="score-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="score-card-top">
        <div>
          <div className="score-card-label">{meta.icon} {meta.label}</div>
          <div className="score-card-value" style={{ color: badge.color }}>{displayVal}</div>
        </div>
        <span className={`score-badge ${badge.cls}`}>{badge.badge}</span>
      </div>
      <div className="score-bar-track">
        <motion.div
          className="score-bar-fill"
          style={{ background: meta.gradient }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.2, duration: 1.1, ease: 'easeOut' }}
        />
      </div>
      <div className="score-explanation">
        <strong style={{ color: 'var(--text)' }}>What is this?</strong> {meta.what}
      </div>
    </motion.div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.95 },
  show: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.13, type: 'spring', stiffness: 90 } }),
};

const KPI_META = {
  Low:    { icon: '📉', color: 'var(--red)',    glow: '#EF4444', tag: 'Needs improvement' },
  Medium: { icon: '📊', color: 'var(--amber)',  glow: '#F59E0B', tag: 'Good potential' },
  High:   { icon: '💰', color: 'var(--green)',  glow: '#10B981', tag: 'Strong monetization' },
};

export default function PredictionCards({ result, extras, scoreOnly }) {
  const { predicted_likes, engagement_rate, monetization } = result;
  const meta = KPI_META[monetization] || KPI_META.Medium;

  // Single score view (e.g., clicked "SEO Score" in sidebar)
  if (scoreOnly && extras) {
    const scoreTypes = scoreOnly === 'seo' ? ['seo'] : scoreOnly === 'clickbait' ? ['clickbait'] : ['sentiment'];

    return (
      <div className="scores-section" style={{ marginBottom: 0 }}>
        <div className="scores-title" style={{ marginBottom: 24 }}>
          {scoreOnly === 'seo' ? '🔍 SEO Score Analysis' : scoreOnly === 'clickbait' ? '💡 Clickbait Score Analysis' : '❤️ Sentiment Analysis'}
        </div>
        {/* Also show the relevant KPI */}
        <div className="kpi-grid" style={{ marginBottom: 32 }}>
          <motion.div className="kpi-card glass" custom={0} variants={cardVariants} initial="hidden" animate="show">
            <div className="kpi-icon">👍</div>
            <div className="kpi-label">Predicted Likes</div>
            <div className="kpi-value">{Number(predicted_likes).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="kpi-sub">estimated in first 30 days</div>
          </motion.div>
          <motion.div className="kpi-card glass" custom={1} variants={cardVariants} initial="hidden" animate="show">
            <div className="kpi-icon">📈</div>
            <div className="kpi-label">Engagement Rate</div>
            <div className="kpi-value">{(engagement_rate * 100).toFixed(2)}%</div>
            <div className="kpi-sub">{engagement_rate >= 0.05 ? '🔥 Above average' : engagement_rate >= 0.02 ? '✅ Average' : '⚠️ Below average'}</div>
          </motion.div>
          <motion.div className="kpi-card glass" custom={2} variants={cardVariants} initial="hidden" animate="show">
            <div className="kpi-icon">{meta.icon}</div>
            <div className="kpi-label">Monetization Level</div>
            <div className="kpi-value" style={{ color: meta.color }}>{monetization}</div>
            <div className="kpi-sub" style={{ color: meta.color }}>{meta.tag}</div>
          </motion.div>
        </div>
        <div className="scores-grid" style={{ gridTemplateColumns: '1fr' }}>
          {scoreTypes.map(type => (
            <ScoreCard key={type} type={type}
              value={type === 'seo' ? extras.seo_score : type === 'clickbait' ? extras.clickbait_score : extras.title_sentiment}
              delay={0.2}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── KPI Cards ── */}
      <div className="kpi-grid">
        <motion.div className="kpi-card glass kpi-likes" custom={0} variants={cardVariants} initial="hidden" animate="show">
          <div className="kpi-icon">👍</div>
          <div className="kpi-label">Predicted Likes</div>
          <div className="kpi-value">{Number(predicted_likes).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div className="kpi-sub">estimated in first 30 days of publishing</div>
        </motion.div>

        <motion.div className="kpi-card glass kpi-engage" custom={1} variants={cardVariants} initial="hidden" animate="show">
          <div className="kpi-icon">📈</div>
          <div className="kpi-label">Engagement Rate</div>
          <div className="kpi-value">{(engagement_rate * 100).toFixed(2)}%</div>
          <div className="kpi-sub">
            {engagement_rate >= 0.05 ? '🔥 Above average — great content signals' :
             engagement_rate >= 0.02 ? '✅ Average — typical for the category' :
             '⚠️ Below average — boost title & description'}
          </div>
        </motion.div>

        <motion.div className="kpi-card glass kpi-money" custom={2} variants={cardVariants} initial="hidden" animate="show">
          <div className="kpi-icon">{meta.icon}</div>
          <div className="kpi-label">Monetization Level</div>
          <div className="kpi-value" style={{ color: meta.color }}>{monetization}</div>
          <div className="kpi-sub" style={{ color: meta.color }}>{meta.tag}</div>
        </motion.div>
      </div>

      {/* ── Score Breakdown ── */}
      {extras && (
        <div className="scores-section">
          <div className="scores-title">📐 Score Breakdown — What's driving your prediction?</div>
          <div className="scores-grid">
            <ScoreCard type="seo"       value={extras.seo_score}        delay={0.3} />
            <ScoreCard type="clickbait" value={extras.clickbait_score}   delay={0.42} />
            <ScoreCard type="sentiment" value={extras.title_sentiment}   delay={0.54} />
          </div>
        </div>
      )}
    </>
  );
}
