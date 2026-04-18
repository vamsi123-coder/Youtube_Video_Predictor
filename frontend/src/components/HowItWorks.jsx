import { motion } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    icon: '📝',
    title: 'Enter Your Video Details',
    desc: 'Fill in your video title, description, tags, and channel info. Each field directly influences your prediction score.',
  },
  {
    num: '02',
    icon: '🧠',
    title: 'AI Runs 6 ML Signals',
    desc: 'Our model computes SEO Score, Clickbait Score, Sentiment, Subscriber Authority, and timing signals before predicting.',
  },
  {
    num: '03',
    icon: '📊',
    title: 'Get Actionable Insights',
    desc: 'See predicted likes, engagement rate, monetization probability, and personalised tips to improve your video performance.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' } }),
};

export default function HowItWorks() {
  return (
    <section className="hiw-section" id="how-it-works">
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-tag">How It Works</div>
          <h2 className="section-title">
            Three steps to unlock your{' '}
            <span className="gradient-text">video's potential</span>
          </h2>
          <p className="section-sub">
            No guesswork. Our Random Forest ML model was trained on hundreds of thousands of trending videos
            to give you a data-driven edge.
          </p>
        </motion.div>

        <div className="hiw-grid">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              className="hiw-card glass"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="hiw-num">{s.num}</div>
              <div className="hiw-icon">{s.icon}</div>
              <div className="hiw-title">{s.title}</div>
              <div className="hiw-desc">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Pills */}
      <div style={{ maxWidth: 980, margin: '60px auto 0', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        {[
          ['🎯', 'SEO Score Explained'],
          ['💡', 'Clickbait Intelligence'],
          ['❤️', 'Sentiment Analysis'],
          ['📡', 'Channel Authority Index'],
          ['⏰', 'Upload Timing Optimizer'],
          ['📈', 'What-If Simulator'],
          ['🤖', 'AI Written Insights'],
          ['🏷️', 'Category Benchmarking'],
        ].map(([icon, text]) => (
          <div className="feature-pill" key={text}>
            <span className="pill-icon">{icon}</span>
            {text}
          </div>
        ))}
      </div>
    </section>
  );
}
