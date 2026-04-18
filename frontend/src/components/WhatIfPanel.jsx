import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// Simple sensitivity model — rough linear multipliers based on ML feature importance
function simulate(base, formData, videoLen, uploadHour, titleLen, subs) {
  let m = 1;
  // Upload hour impact
  if (uploadHour >= 15 && uploadHour <= 20) m += 0.14;
  else if (uploadHour >= 8 && uploadHour < 15) m += 0.04;
  else m -= 0.10;
  // Video length sweet spot
  if (videoLen >= 480 && videoLen <= 1200) m += 0.08;
  else if (videoLen > 1800) m -= 0.04;
  else if (videoLen < 120) m += 0.05;
  // Title length
  if (titleLen >= 50 && titleLen <= 70) m += 0.09;
  else if (titleLen < 30) m -= 0.08;
  else if (titleLen > 80) m -= 0.04;
  // Subscriber impact (channel authority)
  const baseSubsRatio = (subs / (formData?.channel_subscriber_count || 10000));
  m *= Math.pow(baseSubsRatio, 0.3);

  return Math.max(0, Math.round(base * m));
}

function SimSlider({ id, label, min, max, step, value, onChange, unit, description }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="wi-slider">
      <label htmlFor={id}>
        {label}
        <span>{value}{unit}</span>
      </label>
      <input
        id={id} type="range"
        min={min} max={max} step={step}
        value={value}
        style={{ '--val': `${pct}%`, width: '100%', marginBottom: 6 }}
        onChange={e => onChange(Number(e.target.value))}
        className=""
      />
      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.5 }}>{description}</div>
    </div>
  );
}

export default function WhatIfPanel({ baseLikes, baseEngagement, formData }) {
  const [videoLen, setVideoLen] = useState(formData?.video_length ?? 300);
  const [uploadHour, setUploadHour] = useState(formData?.upload_hour ?? 18);
  const [titleLen, setTitleLen] = useState(formData?.title?.length ?? 50);
  const [subs, setSubs] = useState(formData?.channel_subscriber_count ?? 10000);

  const simLikes = simulate(baseLikes, formData, videoLen, uploadHour, titleLen, subs);
  const likeDiff = simLikes - Math.round(baseLikes);
  const positive = likeDiff >= 0;

  // Simulate engagement adjustment
  let engM = 1;
  if (videoLen < 180) engM = 1.08;
  else if (videoLen > 1800) engM = 0.94;
  const simEng = Math.max(0, baseEngagement * engM);
  const simMoney = simEng >= 0.05 ? 'High' : simEng >= 0.02 ? 'Medium' : 'Low';
  const moneyColor = { High: 'var(--green)', Medium: 'var(--amber)', Low: 'var(--red)' }[simMoney];

  return (
    <motion.div
      className="whatif-card glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
    >
      <div className="whatif-head">
        <div className="whatif-avatar">🎛️</div>
        <div className="whatif-head-info">
          <h3>What-If Simulator</h3>
          <p>Drag sliders to instantly see how changing key video parameters might shift your predicted performance and monetization outcome.</p>
        </div>
      </div>

      <div className="whatif-sliders">
        <SimSlider
          id="wi-len" label="Video Length" unit="s"
          min={30} max={3600} step={30}
          value={videoLen} onChange={setVideoLen}
          description={videoLen >= 480 && videoLen <= 1200 ? '✓ Sweet spot for monetization (8–20 min)' : videoLen > 1200 ? 'Long-form — great for watch time but higher drop-off risk' : 'Short-form — high CTR, lower watch time scoring'}
        />
        <SimSlider
          id="wi-hour" label="Upload Hour" unit=":00"
          min={0} max={23} step={1}
          value={uploadHour} onChange={setUploadHour}
          description={uploadHour >= 15 && uploadHour <= 20 ? '🔥 Peak viewer traffic window — maximum early boost' : uploadHour >= 8 && uploadHour < 15 ? '📈 Good window, moderate early traction' : '😴 Off-peak — consider repositioning to 3PM–8PM'}
        />
        <SimSlider
          id="wi-title" label="Title Length" unit=" chars"
          min={10} max={100} step={1}
          value={titleLen} onChange={setTitleLen}
          description={titleLen >= 50 && titleLen <= 70 ? '✓ Optimal title length for YouTube search' : titleLen > 70 ? '⚠ Too long — gets truncated in search results' : `${70 - titleLen} chars to reach optimal range`}
        />
        <SimSlider
          id="wi-subs" label="Subscribers" unit=""
          min={0} max={5000000} step={1000}
          value={subs} onChange={setSubs}
          description={`${subs >= 1_000_000 ? '🏆 Top tier creator — strong algorithmic priority' : subs >= 100_000 ? '🥇 Established channel — solid authority signals' : subs >= 10_000 ? '🥈 Growing creator — building authority' : '🌱 Emerging — early growth stage'}`}
        />
      </div>

      {/* Simulated Outputs */}
      <div className="whatif-outputs">
        <div className="wi-output">
          <div className="wi-num" style={{ color: 'var(--purple)' }}>
            {simLikes.toLocaleString()}
          </div>
          <div className="wi-label">Simulated Likes</div>
          <div className="wi-diff" style={{ color: positive ? 'var(--green)' : 'var(--red)' }}>
            {positive ? '▲ +' : '▼ '}{Math.abs(likeDiff).toLocaleString()} vs original
          </div>
        </div>
        <div className="wi-output">
          <div className="wi-num" style={{ color: 'var(--green)' }}>
            {(simEng * 100).toFixed(2)}%
          </div>
          <div className="wi-label">Simulated Engagement</div>
          <div className="wi-diff" style={{ color: simEng >= baseEngagement ? 'var(--green)' : 'var(--red)' }}>
            {simEng >= baseEngagement ? '▲' : '▼'} {Math.abs((simEng - baseEngagement) * 100).toFixed(2)}% shift
          </div>
        </div>
        <div className="wi-output">
          <div className="wi-num" style={{ color: moneyColor }}>
            {simMoney}
          </div>
          <div className="wi-label">Simulated Monetization</div>
          <div className="wi-diff" style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
            {simMoney !== formData?.monetization ? `↑ Changed from ${formData?.monetization ?? '—'}` : 'Same tier as original'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, padding: '14px 20px', borderRadius: 10, background: 'rgba(139,92,246,0.07)', border: '1px dashed rgba(139,92,246,0.2)', fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.6 }}>
        💡 <strong style={{ color: 'var(--text-soft)' }}>Tip:</strong> This simulator uses feature sensitivity coefficients derived from our ML model's feature importance. It's an approximation — not a re-run of the model. Use it to explore directional improvements.
      </div>
    </motion.div>
  );
}
