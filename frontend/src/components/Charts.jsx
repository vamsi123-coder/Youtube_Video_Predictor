import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, RadialLinearScale,
  PointElement, LineElement, Filler,
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, RadialLinearScale, PointElement, LineElement, Filler,
);

const DARK_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

export default function Charts({ result, extras, formData }) {
  const { predicted_likes, engagement_rate, monetization } = result;

  /* ── Bar: Metrics breakdown ── */
  const barData = {
    labels: ['Predicted Likes (÷1000)', 'Engagement %', 'SEO Score'],
    datasets: [{
      data: [
        Math.round(predicted_likes / 1000),
        parseFloat((engagement_rate * 100).toFixed(2)),
        parseFloat((extras?.seo_score ?? 0).toFixed(1)),
      ],
      backgroundColor: [
        'rgba(139,92,246,0.7)',
        'rgba(16,185,129,0.7)',
        'rgba(59,130,246,0.7)',
      ],
      borderColor: ['#8B5CF6', '#10B981', '#3B82F6'],
      borderWidth: 2,
      borderRadius: 10,
      borderSkipped: false,
    }],
  };

  const barOpts = {
    ...DARK_OPTS,
    plugins: {
      ...DARK_OPTS.plugins,
      tooltip: {
        callbacks: {
          label: (c) => {
            if (c.dataIndex === 0) return ` ${(c.raw * 1000).toLocaleString()} likes`;
            if (c.dataIndex === 1) return ` ${c.raw}% engagement`;
            return ` ${c.raw}/80 SEO`;
          },
        },
        backgroundColor: '#0C0C1D',
        titleColor: '#A78BFA',
        bodyColor: '#C4CCE4',
        borderColor: 'rgba(139,92,246,0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#6B7280', font: { size: 11, family: 'Inter' } },
        grid: { color: 'rgba(255,255,255,0.03)' },
      },
      y: {
        ticks: { color: '#6B7280', font: { size: 11, family: 'Inter' } },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  /* ── Doughnut: Monetization level ── */
  const lvMap = { Low: 25, Medium: 60, High: 92 };
  const lv = lvMap[monetization] ?? 50;
  const colorMap = { Low: '#EF4444', Medium: '#F59E0B', High: '#10B981' };
  const donutData = {
    labels: ['Potential', 'Gap'],
    datasets: [{
      data: [lv, 100 - lv],
      backgroundColor: [colorMap[monetization], 'rgba(255,255,255,0.05)'],
      borderColor: ['transparent', 'transparent'],
      hoverOffset: 6,
    }],
  };
  const donutOpts = {
    ...DARK_OPTS,
    cutout: '75%',
    plugins: {
      ...DARK_OPTS.plugins,
      tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.raw}%` }, backgroundColor: '#0C0C1D', bodyColor: '#C4CCE4', borderColor: 'rgba(139,92,246,0.3)', borderWidth: 1 },
    },
  };

  return (
    <motion.div
      className="charts-grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Bar */}
      <div className="chart-card glass">
        <div className="chart-heading">📊 Performance Metrics Overview</div>
        <div style={{ marginBottom: 8, fontSize: '0.78rem', color: 'var(--muted)' }}>
          Comparing predicted likes (÷1,000), engagement %, and SEO score side-by-side.
        </div>
        <div className="chart-area">
          <Bar data={barData} options={barOpts} />
        </div>
      </div>

      {/* Donut */}
      <div className="chart-card glass">
        <div className="chart-heading">💰 Monetization Potential</div>
        <div style={{ marginBottom: 8, fontSize: '0.78rem', color: 'var(--muted)' }}>
          Based on engagement rate and channel signals.
        </div>
        <div className="donut-area">
          <Doughnut data={donutData} options={donutOpts} />
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: colorMap[monetization], lineHeight: 1 }}>{lv}%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
              {monetization} potential
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
