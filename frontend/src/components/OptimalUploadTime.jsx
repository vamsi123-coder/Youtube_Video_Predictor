import { motion } from 'framer-motion';

// Engagement multipliers by hour (normalized 0–1) — based on general YouTube analytics patterns
const HOURLY_DATA = [
  0.18, 0.12, 0.09, 0.08, 0.10, 0.15,  // 0-5
  0.22, 0.35, 0.50, 0.60, 0.65, 0.68,  // 6-11
  0.72, 0.74, 0.76, 0.82, 0.88, 0.92,  // 12-17
  0.95, 0.97, 0.90, 0.78, 0.60, 0.40,  // 18-23
];

// Category-specific peak hour overrides
const CAT_PEAKS = {
  'Gaming':              { peak: [20, 21, 22], good: [18, 19, 23] },
  'Education':           { peak: [16, 17, 18], good: [14, 15, 19] },
  'Science & Technology':{ peak: [17, 18, 19], good: [15, 16, 20] },
  'Music':               { peak: [18, 19, 20], good: [16, 17, 21] },
  'News & Politics':     { peak: [8,  9,  18], good: [7,  10, 19] },
  'Sports':              { peak: [18, 19, 20], good: [16, 17, 21] },
  'Entertainment':       { peak: [19, 20, 21], good: [17, 18, 22] },
  'Howto & Style':       { peak: [14, 15, 16], good: [12, 13, 17] },
  'People & Blogs':      { peak: [17, 18, 19], good: [15, 16, 20] },
  'Comedy':              { peak: [19, 20, 21], good: [16, 17, 22] },
};

const DEFAULT_PEAKS = { peak: [17, 18, 19], good: [15, 16, 20] };

function getCellLevel(hour, cat) {
  const cfg = CAT_PEAKS[cat] || DEFAULT_PEAKS;
  if (cfg.peak.includes(hour)) return 'peak';
  if (cfg.good.includes(hour)) return 'good';
  const base = HOURLY_DATA[hour];
  if (base >= 0.60) return 'moderate';
  if (base >= 0.35) return 'low';
  return 'avoid';
};

const LEVEL_META = {
  peak:     { bg: 'rgba(16,185,129,0.75)',  border: '#10b981', label: '🔥 Peak',     tip: 'Best time to upload' },
  good:     { bg: 'rgba(99,102,241,0.55)',  border: '#6366f1', label: '📈 Good',     tip: 'Strong engagement window' },
  moderate: { bg: 'rgba(245,158,11,0.40)',  border: '#f59e0b', label: '〰 Moderate',  tip: 'Decent traction' },
  low:      { bg: 'rgba(239,68,68,0.25)',   border: '#ef4444', label: '📉 Low',      tip: 'Consider another time' },
  avoid:    { bg: 'rgba(255,255,255,0.04)', border: 'transparent', label: '😴 Avoid', tip: 'Very low viewer activity' },
};

function formatHour(h) {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

export default function OptimalUploadTime({ formData }) {
  const category = formData?.category_id || 'Entertainment';
  const userHour = formData?.upload_hour ?? 18;
  const cfg = CAT_PEAKS[category] || DEFAULT_PEAKS;
  const bestHour = cfg.peak[1];

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <motion.div
      className="card-glass upt-panel"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-tag" style={{ margin: 0 }}>Publishing Strategy</div>
        <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.6rem', marginTop: 6 }}>
          Optimal Upload Time
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: 4 }}>
          Best hours to publish <strong style={{ color: 'var(--primary-lt)' }}>{category}</strong> videos for maximum early engagement.
        </p>
      </div>

      {/* Your hour vs best hour */}
      <div className="upt-compare">
        <div className="upt-compare-card" style={{ borderColor: (() => { const l = getCellLevel(userHour, category); return LEVEL_META[l].border; })() }}>
          <div className="upt-compare-label">Your Upload Hour</div>
          <div className="upt-compare-time" style={{ color: (() => { const l = getCellLevel(userHour, category); return LEVEL_META[l].border; })() }}>
            {formatHour(userHour)}
          </div>
          <div className="upt-compare-sub">{LEVEL_META[getCellLevel(userHour, category)].label}</div>
        </div>
        <div className="upt-compare-arrow">→</div>
        <div className="upt-compare-card" style={{ borderColor: '#10b981' }}>
          <div className="upt-compare-label">Recommended Hour</div>
          <div className="upt-compare-time" style={{ color: '#10b981' }}>
            {formatHour(bestHour)}
          </div>
          <div className="upt-compare-sub">🔥 Peak for {category}</div>
        </div>
      </div>

      {/* Heatmap */}
      <div style={{ marginTop: 32, marginBottom: 12 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
          24-Hour Engagement Heatmap
        </div>
        <div className="upt-heatmap">
          {hours.map((h, i) => {
            const level = getCellLevel(h, category);
            const meta = LEVEL_META[level];
            const isUser = h === userHour;
            return (
              <motion.div
                key={h}
                className={`upt-cell ${isUser ? 'upt-cell-user' : ''}`}
                style={{ background: meta.bg, borderColor: isUser ? '#fff' : meta.border }}
                title={`${formatHour(h)} — ${meta.label}: ${meta.tip}`}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: i * 0.025, duration: 0.3 }}
              >
                <span className="upt-hour-label">{formatHour(h)}</span>
                <span className="upt-bar" style={{ height: `${HOURLY_DATA[h] * 100}%`, background: meta.bg, filter: 'brightness(1.4)' }} />
                {isUser && <span className="upt-user-dot">📍</span>}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="upt-legend">
        {Object.entries(LEVEL_META).map(([k, v]) => (
          <div key={k} className="upt-legend-item">
            <div className="upt-legend-dot" style={{ background: v.bg, borderColor: v.border }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-soft)' }}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Weekly tip */}
      <div style={{ marginTop: 20, padding: '16px 20px', borderRadius: 12, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '0.83rem', color: 'var(--text-soft)', lineHeight: 1.6 }}>
        📅 <strong style={{ color: 'var(--text)' }}>Pro Tip:</strong> For <strong style={{ color: 'var(--primary-lt)' }}>{category}</strong> videos, Tuesday–Thursday between <strong style={{ color: 'var(--good)' }}>{formatHour(cfg.peak[0])}–{formatHour(cfg.peak[cfg.peak.length-1])}</strong> consistently yields the best algorithmic push and early viewer attention.
      </div>
    </motion.div>
  );
}
