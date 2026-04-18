import { motion } from 'framer-motion';

export default function Hero({ onStart, onHowItWorks }) {
  return (
    <section className="hero z1">
      <div className="hero-orb orb1" />
      <div className="hero-orb orb2" />
      <div className="hero-orb orb3" />

      <div className="z1" style={{ maxWidth: 820, width: '100%' }}>
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="badge-dot" />
          AI Trained on 784,000+ Real YouTube Videos
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
        >
          Know Your Channel's
          <br />
          <span className="gradient-text">True Revenue Potential</span>
          <br />
          Before You Publish
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
        >
          RevenueIQ analyzes your video title, description, category, channel authority, 
          and publishing time to predict likes, engagement rate, and monetization potential 
          with machine learning.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <button className="btn-primary" onClick={onStart} id="hero-cta" style={{ fontSize: '1.05rem', padding: '16px 40px' }}>
            🚀 Analyze My Video
          </button>
          <button className="btn-ghost" onClick={onHowItWorks} id="how-it-works-btn">
            📖 How It Works
          </button>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.7 }}
        >
          {[
            { num: '784K+', lbl: 'Videos in training data', color: 'var(--purple)' },
            { num: '88.2%', lbl: 'Model R² accuracy', color: 'var(--blue)' },
            { num: '3 Scores', lbl: 'SEO · Clickbait · Sentiment', color: 'var(--green)' },
            { num: '<1s', lbl: 'Prediction time', color: 'var(--amber)' },
          ].map(({ num, lbl, color }) => (
            <div className="hero-stat" key={lbl}>
              <div className="stat-big" style={{ color }}>{num}</div>
              <div className="stat-lbl">{lbl}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="scroll-hint">
        <span>Scroll down</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
}
