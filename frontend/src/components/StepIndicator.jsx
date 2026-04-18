import { motion } from 'framer-motion';

const STEPS = [
  { label: 'Video Details', num: 1 },
  { label: 'Channel Info', num: 2 },
  { label: 'Publishing', num: 3 },
];

export default function StepIndicator({ current }) {
  return (
    <div className="steps">
      {STEPS.map((s) => {
        const state = current > s.num ? 'done' : current === s.num ? 'active' : '';
        return (
          <motion.div
            key={s.num}
            className={`step-pill ${state}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: s.num * 0.1 }}
          >
            <span className="step-num">
              {current > s.num ? '✓' : s.num}
            </span>
            {s.label}
          </motion.div>
        );
      })}
    </div>
  );
}
