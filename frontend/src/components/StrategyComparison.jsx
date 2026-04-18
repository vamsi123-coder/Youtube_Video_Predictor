import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Re-used scoring logic (mirrors App.jsx computeLocalExtras) ──
function computeScores(title) {
  const lower = title.toLowerCase();

  // Sentiment
  const pos = ['amazing','best','great','awesome','top','ultimate','new','incredible','master','unlock','transform','how to','guide','easy','fast','quick','pro','expert','viral','boost','grow','success','win','proven','secret','tips','tricks','strategies','perfect'];
  const neg = ['worst','bad','fail','never','stop','avoid','terrible','scam','warning','danger','mistake','lose','ruin','horrible','hate','dumb'];
  let sent = 0.05;
  pos.forEach(w => { if (lower.includes(w)) sent += 0.25; });
  neg.forEach(w => { if (lower.includes(w)) sent -= 0.25; });
  sent = Math.max(-1, Math.min(1, sent));

  // Clickbait
  const power = ['shocking','unbelievable','secret','exposed','amazing','insane','ultimate','truth','never','must watch','reasons','top','why'];
  let cb = 0;
  const words = title.split(' ');
  const caps = words.filter(w => w === w.toUpperCase() && w.length > 1).length / (words.length || 1);
  cb += caps * 2;
  if (/\d/.test(title)) cb += 1.5;
  cb += (title.match(/!/g) || []).length * 1.0;
  power.forEach(w => { if (lower.includes(w)) cb += 2; });
  if (title.includes('?')) cb += 1.5;
  cb += Math.max(0, 1 - Math.abs(title.length - 60) / 60);
  cb = Math.min(10, Math.round(cb * 10) / 10);

  // SEO (title-level: length only, since no desc/tags)
  const tl = title.length;
  let seo = tl >= 50 && tl <= 70 ? 40 : Math.max(0, 40 - Math.abs(tl - 60) / 2);
  // add clickbait signal
  if (cb >= 2 && cb <= 7) seo += 10;
  seo = Math.round(Math.min(80, seo));

  // Overall
  const seoN = (seo / 80) * 100;
  const cbN = cb >= 3 && cb <= 6 ? 100 : cb < 3 ? (cb / 3) * 100 : Math.max(0, 100 - (cb - 6) * 20);
  const sN = Math.min(100, Math.max(0, (sent + 1) * 50));
  const overall = Math.round(seoN * 0.35 + cbN * 0.35 + sN * 0.30);

  return { seo, clickbait: cb, sentiment: sent, overall };
}

const SCORE_COLORS = {
  seo:       '#6366f1',
  clickbait: '#f59e0b',
  sentiment: '#10b981',
  overall:   '#ec4899',
};

const PLACEHOLDER_TITLES = [
  'Enter first title variant...',
  'Enter second title variant...',
  'Enter third title variant (optional)...',
];

function ScorePill({ value, max, color, label }) {
  const pct = Math.round((Math.abs(value) / max) * 100);
  return (
    <div className="strat-score-pill" style={{ borderColor: color + '44' }}>
      <div className="strat-pill-label" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="strat-pill-num" style={{ color }}>{typeof value === 'number' && max === 1 ? (value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2)) : value.toFixed ? value.toFixed(1) : value}</div>
      <div className="score-bar-track" style={{ height: 5, marginTop: 6 }}>
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: color, borderRadius: 99, height: '100%' }} />
      </div>
    </div>
  );
}

export default function StrategyComparison({ baseFormData }) {
  const [titles, setTitles] = useState([
    baseFormData?.title || '',
    '',
    '',
  ]);
  const [showThird, setShowThird] = useState(false);

  const setTitle = (i, v) => setTitles(t => { const n = [...t]; n[i] = v; return n; });

  const scores = useMemo(() =>
    titles.map(t => t.trim() ? computeScores(t) : null),
    [titles]
  );

  const activeScores = scores.filter(Boolean);
  const winnerIdx = activeScores.length > 0
    ? scores.reduce((best, s, i) => (s && (!scores[best] || s.overall > scores[best].overall) ? i : best), 0)
    : -1;

  const VARIANT_COLORS = ['#6366f1', '#ec4899', '#10b981'];

  return (
    <motion.div
      className="card-glass strat-panel"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-tag" style={{ margin: 0 }}>A/B Testing</div>
        <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.6rem', marginTop: 6 }}>
          Strategy Comparison
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: 4 }}>
          Test up to 3 title variants side-by-side. The tool scores SEO, Clickbait balance, Sentiment, and an Overall score.
        </p>
      </div>

      {/* Title inputs */}
      <div className="strat-inputs">
        {[0, 1, ...(showThird ? [2] : [])].map(i => (
          <div key={i} className="strat-input-row">
            <div className="strat-variant-badge" style={{ background: VARIANT_COLORS[i] + '22', color: VARIANT_COLORS[i], borderColor: VARIANT_COLORS[i] + '55' }}>
              {String.fromCharCode(65 + i)}
            </div>
            <input
              className="strat-title-input"
              id={`strat-title-${i}`}
              placeholder={PLACEHOLDER_TITLES[i]}
              value={titles[i]}
              onChange={e => setTitle(i, e.target.value)}
              maxLength={100}
              style={{ borderColor: titles[i] ? VARIANT_COLORS[i] + '66' : undefined }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', minWidth: 48, textAlign: 'right' }}>
              {titles[i].length}/100
            </span>
          </div>
        ))}
        {!showThird && (
          <button className="strat-add-btn" onClick={() => setShowThird(true)}>
            + Add 3rd variant
          </button>
        )}
      </div>

      {/* Comparison Table */}
      <AnimatePresence>
        {activeScores.length > 0 && (
          <motion.div
            className="strat-table-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Overall score bar comparison */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
                Overall Score Comparison
              </div>
              {[0, 1, ...(showThird ? [2] : [])].map(i => {
                const s = scores[i];
                if (!titles[i].trim()) return null;
                const isWinner = i === winnerIdx;
                return (
                  <motion.div
                    key={i}
                    className="strat-bar-row"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="strat-bar-label">
                      <span className="strat-variant-badge-sm" style={{ background: VARIANT_COLORS[i] + '22', color: VARIANT_COLORS[i] }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span style={{ fontSize: '0.83rem', color: 'var(--text-soft)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {titles[i] || '—'}
                      </span>
                      {isWinner && <span className="strat-winner-badge">🏆 Winner</span>}
                    </div>
                    <div className="strat-bar-track">
                      <motion.div
                        className="strat-bar-fill"
                        style={{ background: VARIANT_COLORS[i] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${s?.overall ?? 0}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="strat-bar-num" style={{ color: VARIANT_COLORS[i] }}>
                      {s?.overall ?? 0}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Detailed grid */}
            <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${showThird ? 3 : 2}, 1fr)`, gap: 12 }}>
              {/* Header row */}
              <div />
              {[0, 1, ...(showThird ? [2] : [])].map(i => (
                <div key={i} className="strat-col-head" style={{ color: VARIANT_COLORS[i], borderColor: VARIANT_COLORS[i] + '44' }}>
                  Variant {String.fromCharCode(65 + i)}
                  {i === winnerIdx && titles[i].trim() && <span style={{ fontSize: '0.8rem' }}> 🏆</span>}
                </div>
              ))}

              {/* Rows */}
              {[
                { label: '🔍 SEO Score', key: 'seo', max: 80, color: SCORE_COLORS.seo },
                { label: '💡 Clickbait', key: 'clickbait', max: 10, color: SCORE_COLORS.clickbait },
                { label: '❤️ Sentiment', key: 'sentiment', max: 1, color: SCORE_COLORS.sentiment },
                { label: '🏆 Overall', key: 'overall', max: 100, color: SCORE_COLORS.overall },
              ].map(row => (
                <>
                  <div key={row.key + '-label'} className="strat-row-label">{row.label}</div>
                  {[0, 1, ...(showThird ? [2] : [])].map(i => {
                    const s = scores[i];
                    const val = s ? s[row.key] : null;
                    const pct = val !== null ? Math.round((Math.abs(val) / row.max) * 100) : 0;
                    return (
                      <div key={i} className="strat-cell">
                        {val !== null ? (
                          <>
                            <div className="strat-cell-val" style={{ color: row.color }}>
                              {row.key === 'sentiment' ? (val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)) : val.toFixed ? val.toFixed(1) : val}
                            </div>
                            <div className="score-bar-track" style={{ height: 4 }}>
                              <div className="score-bar-fill" style={{ width: `${pct}%`, background: row.color, borderRadius: 99, height: '100%' }} />
                            </div>
                          </>
                        ) : (
                          <span style={{ color: 'var(--border-hi)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>

            {/* Winner recommendation */}
            {winnerIdx >= 0 && titles[winnerIdx].trim() && (
              <motion.div
                className="strat-winner-box"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ borderColor: VARIANT_COLORS[winnerIdx] + '55', background: VARIANT_COLORS[winnerIdx] + '0d' }}
              >
                <span style={{ fontSize: '1.4rem' }}>🏆</span>
                <div>
                  <div style={{ fontWeight: 700, color: VARIANT_COLORS[winnerIdx], marginBottom: 2 }}>
                    Variant {String.fromCharCode(65 + winnerIdx)} is your best title
                  </div>
                  <div style={{ fontSize: '0.83rem', color: 'var(--text-soft)' }}>
                    "{titles[winnerIdx]}" — Overall score: <strong style={{ color: VARIANT_COLORS[winnerIdx] }}>{scores[winnerIdx]?.overall}/100</strong>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {activeScores.length === 0 && (
        <div className="strat-empty">
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚖️</div>
          <div style={{ color: 'var(--text-soft)', fontWeight: 600 }}>Enter title variants above to see the comparison</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 6 }}>
            Each variant gets scored on SEO, Clickbait balance, Sentiment, and an Overall composite score.
          </div>
        </div>
      )}
    </motion.div>
  );
}
