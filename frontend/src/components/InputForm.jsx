import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const CATEGORIES = [
  'Film & Animation','Autos & Vehicles','Music','Pets & Animals','Sports',
  'Travel & Events','Gaming','People & Blogs','Comedy','Entertainment',
  'News & Politics','Howto & Style','Education','Science & Technology','Nonprofits & Activism',
];

const SAMPLES = {
  title: '10 AI Tools That Will Change Your Life in 2025',
  description: 'In this video, I break down the 10 most powerful AI tools available right now that can transform the way you work, create, and learn. From writing assistants to code generators and design tools — these are the apps top creators use daily. Watch until the end for a bonus tool that most people don\'t know about!\n\n⏱ Timestamps:\n0:00 Intro\n1:30 Tool #1 - ChatGPT\n3:15 Tool #2 - Midjourney\n...\n\n🔔 Subscribe for weekly AI content!\n#AI #productivity #tools #technology #2025',
  tags: 'AI tools, productivity, machine learning, ChatGPT, best AI apps, technology 2025, artificial intelligence, how to use AI',
  video_length: 720,
  category_id: 'Science & Technology',
  upload_hour: 17,
  channel_subscriber_count: 50000,
  channel_video_count: 120,
};

const STEP_INFO = [
  { label: 'Video Content', icon: '📝' },
  { label: 'Channel Info',  icon: '📡' },
  { label: 'Publishing',   icon: '⏰' },
];

const slide = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
};

function RangeRow({ id, min, max, step, value, onChange, unit = '' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="range-row">
      <input
        id={id} type="range"
        min={min} max={max} step={step}
        value={value}
        style={{ '--val': `${pct}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="range-val">{value}{unit}</span>
    </div>
  );
}

function formatNum(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export default function InputForm({ onSubmit, loading }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', description: '', tags: '',
    video_length: 300, category_id: 'Entertainment',
    upload_hour: 18,
    channel_subscriber_count: 10000,
    channel_video_count: 50,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const fillSample = () => setForm(f => ({ ...f, ...SAMPLES }));

  const titleLen = form.title.length;
  const titlePct = Math.min((titleLen / 100) * 100, 100);
  const titleColor = titleLen >= 50 && titleLen <= 70 ? 'var(--green)' : titleLen > 70 ? 'var(--amber)' : 'var(--purple)';
  const titleHint = titleLen >= 50 && titleLen <= 70 ? '✓ Optimal' : titleLen > 70 ? '⚠ Too long' : `${70 - titleLen} chars to optimal`;

  const validate = () => {
    if (step === 1) {
      if (!form.title.trim()) return 'Please enter a video title.';
      if (!form.description.trim()) return 'Please add a video description.';
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: err, background: '#07070F', color: '#F0F4FF', confirmButtonColor: '#8B5CF6' });
      return;
    }
    setStep(s => Math.min(s + 1, 3));
  };

  const submit = () => {
    onSubmit(form);
  };

  return (
    <section className="form-section z1" id="form-section">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="section-tag">Step-by-Step Analyzer</div>
        <h2 className="section-title">
          Tell us about your <span className="gradient-text">video & channel</span>
        </h2>
        <p className="section-sub" style={{ marginBottom: 36 }}>
          The more accurate your inputs, the sharper the predictions. Provide real channel stats for best results.
        </p>

        {/* Step Nav */}
        <div className="step-nav">
          {STEP_INFO.map((s, i) => {
            const n = i + 1;
            const state = step > n ? 'done' : step === n ? 'active' : '';
            return (
              <button key={n} className={`step-btn ${state}`} onClick={() => step > n && setStep(n)} id={`step-${n}-btn`}>
                <span className="step-num-badge">
                  {step > n ? '✓' : n}
                </span>
                {s.icon} {s.label}
              </button>
            );
          })}
        </div>

        {/* Sample Data Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button className="sample-btn" onClick={fillSample} id="sample-btn">
            ✨ Fill with sample data
          </button>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>— see how a high-performing video looks</span>
        </div>

        <div className="form-card glass">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Video Content ── */}
            {step === 1 && (
              <motion.div key="s1" variants={slide} initial="hidden" animate="visible" exit="exit">
                <div className="step-header">
                  <h3>📝 Video Content Details</h3>
                  <p>These signals directly impact your SEO Score, Clickbait Score, and Sentiment Score.</p>
                </div>
                <div className="form-grid">
                  <div className="field full">
                    <div className="field-label">
                      Video Title
                      <span className="field-hint">Aim for 50–70 characters for best SEO</span>
                    </div>
                    <input id="title" type="text" maxLength={100}
                      placeholder='e.g. "10 AI Tools That Will Change Your Life in 2025"'
                      value={form.title} onChange={e => set('title', e.target.value)} />
                    <div className="char-bar-wrap">
                      <div className="char-bar-track">
                        <div className="char-bar-fill" style={{ width: `${titlePct}%`, background: titleColor }} />
                      </div>
                      <span className={`char-txt ${titleLen >= 50 && titleLen <= 70 ? 'ok' : titleLen > 70 ? 'warn' : ''}`}>
                        {titleLen}/100 · {titleHint}
                      </span>
                    </div>
                  </div>

                  <div className="field full">
                    <div className="field-label">
                      Video Description
                      <span className="field-hint">250+ chars boosts SEO by up to 20 points</span>
                    </div>
                    <textarea id="description" rows={5}
                      placeholder="Describe your video content in detail. Include keywords, timestamps, hashtags like #AI #productivity..."
                      value={form.description} onChange={e => set('description', e.target.value)} />
                    <div style={{ textAlign: 'right', fontSize: '0.72rem', color: form.description.length > 250 ? 'var(--green)' : 'var(--muted)' }}>
                      {form.description.length} chars {form.description.length > 250 ? '✓ Great length' : `— ${250 - form.description.length} more for max SEO`}
                    </div>
                  </div>

                  <div className="field full">
                    <div className="field-label">
                      Tags
                      <span className="field-hint">Separate by commas — aim for 8–12 tags</span>
                    </div>
                    <input id="tags" type="text"
                      placeholder="AI, productivity, machine learning, how to, tutorial, 2025..."
                      value={form.tags} onChange={e => set('tags', e.target.value)} />
                    <div style={{ textAlign: 'right', fontSize: '0.72rem', color: 'var(--muted)' }}>
                      {form.tags.split(',').filter(t => t.trim()).length} tags detected
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Channel Info ── */}
            {step === 2 && (
              <motion.div key="s2" variants={slide} initial="hidden" animate="visible" exit="exit">
                <div className="step-header">
                  <h3>📡 Channel Authority Details</h3>
                  <p>Channel size directly affects predicted likes. Bigger channels generate more early traction.</p>
                </div>
                <div className="form-grid">
                  <div className="field">
                    <div className="field-label">
                      Subscribers
                      <span className="field-hint">Your total subscriber count</span>
                    </div>
                    <input id="subscribers" type="number" min={0}
                      placeholder="e.g. 50000"
                      value={form.channel_subscriber_count}
                      onChange={e => set('channel_subscriber_count', Number(e.target.value))} />
                    {form.channel_subscriber_count > 0 && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--purple)', marginTop: 4 }}>
                        ≈ {formatNum(form.channel_subscriber_count)} subscribers ·{' '}
                        {form.channel_subscriber_count >= 1_000_000 ? '🏆 Top tier' :
                         form.channel_subscriber_count >= 100_000 ? '🥇 Strong authority' :
                         form.channel_subscriber_count >= 10_000 ? '🥈 Growing channel' :
                         form.channel_subscriber_count >= 1_000 ? '🥉 Emerging creator' : '🌱 New channel'}
                      </span>
                    )}
                  </div>

                  <div className="field">
                    <div className="field-label">
                      Total Videos Published
                      <span className="field-hint">How many videos on your channel?</span>
                    </div>
                    <input id="video-count" type="number" min={1}
                      placeholder="e.g. 120"
                      value={form.channel_video_count}
                      onChange={e => set('channel_video_count', Number(e.target.value))} />
                    {form.channel_video_count > 0 && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4 }}>
                        Avg subscribers/video: {Math.round(form.channel_subscriber_count / form.channel_video_count).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="field full">
                    <div className="field-label">Video Category</div>
                    <select id="category" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4 }}>
                      Category determines niche competition and expected engagement benchmarks.
                    </span>
                  </div>

                  <div className="full">
                    <div className="range-field">
                      <label htmlFor="video_length">
                        Video Length
                        <span style={{ color: 'var(--purple)', fontSize: '0.72rem', marginLeft: 8 }}>
                          ({Math.floor(form.video_length / 60)}m {form.video_length % 60}s) — 
                          {form.video_length >= 480 && form.video_length <= 1200 ? ' ✓ Sweet spot for monetization' :
                           form.video_length > 1200 ? ' Good for long-form engagement' : ' Short-form high click-through'}
                        </span>
                      </label>
                      <RangeRow id="video_length" min={30} max={3600} step={30} value={form.video_length} onChange={v => set('video_length', v)} unit="s" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Publishing ── */}
            {step === 3 && (
              <motion.div key="s3" variants={slide} initial="hidden" animate="visible" exit="exit">
                <div className="step-header">
                  <h3>⏰ Publishing Strategy</h3>
                  <p>When you publish affects early views and algorithmic push. Choose your upload time strategically.</p>
                </div>
                <div className="form-grid">
                  <div className="full">
                    <div className="range-field">
                      <label htmlFor="upload_hour">
                        Upload Hour (24h)
                        <span style={{ color: 'var(--purple)', fontSize: '0.72rem', marginLeft: 8 }}>
                          {form.upload_hour}:00 ·{' '}
                          {form.upload_hour >= 15 && form.upload_hour <= 20 ? '🔥 Peak traffic window — excellent!' :
                           form.upload_hour >= 8 && form.upload_hour < 15 ? '📈 Good afternoon window' :
                           '🌙 Low traffic — consider rescheduling'}
                        </span>
                      </label>
                      <RangeRow id="upload_hour" min={0} max={23} step={1} value={form.upload_hour} onChange={v => set('upload_hour', v)} unit=":00" />
                    </div>
                    <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {[
                        { hours: [15, 16, 17, 18, 19, 20], label: '3pm–8pm', badge: '🔥 Best', color: 'var(--green)' },
                        { hours: [8, 9, 10, 11, 12, 13, 14], label: '8am–2pm', badge: '📈 Good', color: 'var(--amber)' },
                        { hours: [], label: 'Late night / early morning', badge: '😴 Avoid', color: 'var(--red)' },
                      ].map(({ label, badge, color }) => (
                        <div key={label} style={{ fontSize: '0.75rem', padding: '5px 12px', borderRadius: 99, background: `${color}18`, border: `1px solid ${color}33`, color }}>
                          {badge} {label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Review */}
                  <div className="full" style={{ marginTop: 8 }}>
                    <div style={{ padding: '28px 32px', borderRadius: 16, background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                        📋 Submission Summary
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 32px' }}>
                        {[
                          ['Title', form.title ? form.title.slice(0, 40) + (form.title.length > 40 ? '…' : '') : '—'],
                          ['Category', form.category_id],
                          ['Duration', `${Math.floor(form.video_length / 60)}m ${form.video_length % 60}s`],
                          ['Upload at', `${form.upload_hour}:00`],
                          ['Subscribers', formatNum(form.channel_subscriber_count)],
                          ['Videos', form.channel_video_count],
                          ['Tags', `${form.tags.split(',').filter(t => t.trim()).length} tags`],
                          ['Desc', `${form.description.length} chars`],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', gap: 8, fontSize: '0.83rem' }}>
                            <span style={{ color: 'var(--muted)', minWidth: 90 }}>{k}:</span>
                            <span style={{ color: 'var(--text)', fontWeight: 600 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation */}
          <div className="form-footer">
            <button className="btn-ghost" onClick={() => setStep(s => Math.max(s - 1, 1))} disabled={step === 1} style={{ opacity: step === 1 ? 0.3 : 1 }} id="prev-btn">
              ← Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[1,2,3].map(n => (
                <div key={n} style={{
                  width: step === n ? 24 : 8, height: 8, borderRadius: 99,
                  background: step >= n ? 'var(--purple)' : 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s'
                }} />
              ))}
            </div>
            {step < 3 ? (
              <button className="btn-primary" onClick={next} id="next-btn">
                Continue →
              </button>
            ) : (
              <button className="btn-primary" onClick={submit} disabled={loading} id="submit-btn" style={{ padding: '16px 36px', fontSize: '1.05rem', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                {loading ? '⏳ Analyzing...' : '🤖 Analyze My Video'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
