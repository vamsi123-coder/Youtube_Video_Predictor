import { motion, AnimatePresence } from 'framer-motion';

const IMPLEMENTED_ITEMS = [
  { id: 'dashboard',     icon: '📊', label: 'Performance Dashboard',  desc: 'Charts & KPIs' },
  { id: 'seo',           icon: '🔍', label: 'SEO Score',               desc: 'Metadata optimization' },
  { id: 'clickbait',     icon: '💡', label: 'Clickbait Score',          desc: 'Title magnetism' },
  { id: 'sentiment',     icon: '❤️', label: 'Sentiment Analysis',       desc: 'Emotional tone' },
  { id: 'ai',            icon: '🤖', label: 'AI Insights',              desc: 'Smart action plan' },
  { id: 'whatif',        icon: '🎛️', label: 'What-If Simulator',        desc: 'Parameter tuning' },
];

const NEW_ITEMS = [
  { id: 'score',         icon: '🏆', label: 'Performance Score',        desc: 'Composite score bar' },
  { id: 'keywords',      icon: '🔑', label: 'SEO Keywords',             desc: 'Keyword suggestions' },
  { id: 'uploadtime',    icon: '⏰', label: 'Optimal Upload Time',       desc: 'Best hours heatmap' },
  { id: 'strategy',      icon: '⚖️', label: 'Strategy Comparison',      desc: 'A/B title tester' },
];

function SidebarItem({ item, active, onClick }) {
  return (
    <motion.button
      className={`sidebar-item ${active ? 'active' : ''}`}
      onClick={() => onClick(item.id)}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.97 }}
      id={`sidebar-${item.id}`}
    >
      <span className="sidebar-icon">{item.icon}</span>
      <span className="sidebar-item-text">
        <span className="sidebar-item-label">{item.label}</span>
        <span className="sidebar-item-desc">{item.desc}</span>
      </span>
      {active && (
        <motion.span
          className="sidebar-active-dot"
          layoutId="activeDot"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

export default function Sidebar({ activePanel, onSelect, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-header-title">
            <div className="sidebar-logo">VB</div>
            <span>Feature Panel</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>×</button>
        </div>

        {/* Implemented */}
        <div className="sidebar-group">
          <div className="sidebar-group-label">
            <span className="sidebar-group-dot implemented" />
            Implemented
          </div>
          {IMPLEMENTED_ITEMS.map(item => (
            <SidebarItem
              key={item.id}
              item={item}
              active={activePanel === item.id}
              onClick={onSelect}
            />
          ))}
        </div>

        {/* New Features */}
        <div className="sidebar-group">
          <div className="sidebar-group-label">
            <span className="sidebar-group-dot new-feat" />
            New Features
          </div>
          {NEW_ITEMS.map(item => (
            <SidebarItem
              key={item.id}
              item={item}
              active={activePanel === item.id}
              onClick={onSelect}
            />
          ))}
        </div>

        {/* Footer hint */}
        <div className="sidebar-footer">
          <span>🤖</span> Powered by ML · ViralBoost
        </div>
      </motion.aside>
    </>
  );
}
