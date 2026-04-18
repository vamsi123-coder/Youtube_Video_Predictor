import { motion } from 'framer-motion';

const LOAD_STEPS = [
  '📝 Parsing video title and metadata...',
  '🔍 Computing SEO richness score...',
  '💡 Running clickbait & sentiment analysis...',
  '📡 Mapping channel authority signals...',
  '🧠 Feeding data into ML models...',
  '📊 Generating monetization prediction...',
];

export default function LoadingState() {
  return (
    <motion.div
      className="loading-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="ai-rings">
        <div className="ring ring1" />
        <div className="ring ring2" />
        <div className="ring ring3" />
      </div>

      <div>
        <div className="loading-title gradient-text">AI is analyzing your video</div>
        <div className="loading-sub">Running 6 signals through our trained Random Forest model...</div>
      </div>

      <ul className="loading-steps">
        {LOAD_STEPS.map((s, i) => (
          <motion.li
            key={s}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.22, duration: 0.35 }}
          >
            <span className="step-dot" />
            {s}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
