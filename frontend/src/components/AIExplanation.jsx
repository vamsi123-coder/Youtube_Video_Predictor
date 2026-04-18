import { motion } from 'framer-motion';

function generateTips({ formData, extras, result }) {
  const tips = [];
  const seo = extras?.seo_score ?? 0;
  const cb = extras?.clickbait_score ?? 0;
  const sent = extras?.title_sentiment ?? 0;
  const title = formData?.title ?? '';
  const desc = formData?.description ?? '';
  const hour = formData?.upload_hour ?? 18;
  const subs = formData?.channel_subscriber_count ?? 0;
  const vids = formData?.channel_video_count ?? 0;
  const eng = result?.engagement_rate ?? 0;
  const money = result?.monetization;

  // SEO tip
  if (seo < 40)
    tips.push({ icon: '🔍', cls: 'tip-blue', title: 'Boost Your SEO Score', body: `Your SEO score is ${seo.toFixed(1)}/80. Add 5+ more relevant tags, expand your description to 250+ characters, and make sure key phrases appear in both title and description.` });
  else
    tips.push({ icon: '✅', cls: 'tip-green', title: 'Strong SEO Foundation', body: `Great SEO score of ${seo.toFixed(1)}/80! Maintain keyword consistency and keep your description updated for trending terms in your niche.` });

  // Clickbait tip
  if (cb < 2)
    tips.push({ icon: '🎯', cls: 'tip-amber', title: 'Make Your Title More Magnetic', body: `Your clickbait score is only ${cb.toFixed(1)}/10. Try adding a number ("Top 10..."), a power word ("Ultimate", "Secret"), or add "?" to create a curiosity gap.` });
  else if (cb > 6)
    tips.push({ icon: '⚠️', cls: 'tip-amber', title: 'Balance Your Clickbait', body: `Score of ${cb.toFixed(1)}/10 is very aggressive. Overly clickbait-y titles hurt watch time retention. Ensure your content delivers on the promise.` });
  else
    tips.push({ icon: '💡', cls: 'tip-green', title: 'Clickbait Balance is Perfect', body: `Score of ${cb.toFixed(1)}/10 — you've nailed the curiosity gap without being misleading. This is a strong CTR signal.` });

  // Upload time
  if (hour < 14 || hour > 21)
    tips.push({ icon: '⏰', cls: 'tip-purple', title: 'Reschedule Your Upload Time', body: `Uploading at ${hour}:00 is outside peak traffic. The algorithm boosts videos uploaded between 3 PM–8 PM when most viewers are actively browsing. Try scheduling for that window.` });
  else
    tips.push({ icon: '🕐', cls: 'tip-green', title: 'Publishing at Peak Hours', body: `Uploading at ${hour}:00 is within the optimal viewer window (3PM–8PM). Early impressions signal quality to YouTube's algorithm, give you better ranking.` });

  // Sentiment
  if (sent < 0.1)
    tips.push({ icon: '❤️', cls: 'tip-blue', title: 'Add Positive Emotional Tone', body: `Sentiment score of ${sent.toFixed(2)} is neutral/negative. Titles with positive outcomes ("Unlock", "Master", "Transform", "Best") tend to attract more likes and shares.` });

  // Channel authority
  const subsPerVid = vids > 0 ? Math.round(subs / vids) : 0;
  if (subs < 10000)
    tips.push({ icon: '📡', cls: 'tip-purple', title: 'Grow Channel Authority First', body: `With ${(subs/1000).toFixed(1)}K subscribers, your predicted likes will be conservative. Focus on consistency — channels that post weekly grow 3× faster than irregular ones.` });
  else if (subsPerVid > 1000)
    tips.push({ icon: '🏆', cls: 'tip-green', title: 'Strong Channel Authority', body: `Your ${subsPerVid.toLocaleString()} subscribers/video ratio is excellent. Leverage this by publishing during trending topic windows to maximize impressions.` });

  // Monetization cta
  if (money === 'Low' || money === 'Medium')
    tips.push({ icon: '💰', cls: 'tip-amber', title: `Push from ${money} to High Monetization`, body: `The biggest levers: (1) improve your SEO score above 55 (2) upload during 3–8 PM (3) add a mid-roll hook to boost retention past 50% — all three together typically move monetization up one tier.` });

  return tips.slice(0, 4); // Show max 4 tips
}

function parseBold(text) {
  return text.split(/\*\*(.*?)\*\*/g).map((p, i) =>
    i % 2 === 1 ? <strong key={i} style={{ color: 'var(--text)', fontWeight: 700 }}>{p}</strong> : p
  );
}

function generateAIText({ formData, result, extras }) {
  const likes = Number(result.predicted_likes).toLocaleString(undefined, { maximumFractionDigits: 0 });
  const engPct = (result.engagement_rate * 100).toFixed(2);
  const money = result.monetization;
  const seo = extras?.seo_score?.toFixed(1) ?? '—';
  const cat = formData?.category_id ?? 'your category';
  const subs = formData?.channel_subscriber_count ?? 0;
  const subsLabel = subs >= 1_000_000 ? 'top-tier' : subs >= 100_000 ? 'strong authority' : subs >= 10_000 ? 'growing' : 'emerging';
  const hourLabel = formData?.upload_hour >= 15 && formData?.upload_hour <= 20 ? 'peak traffic window' : 'non-peak hours';

  return `Based on your inputs, this video is predicted to receive **${likes} likes** with a **${engPct}% engagement rate** — placing it in the **${money} monetization tier** for the **${cat}** category. Your channel's **${subsLabel}** authority (${(subs/1000).toFixed(1)}K subscribers) ${subs > 50000 ? 'significantly boosts confidence in the prediction' : 'provides a baseline for early traction'}. The SEO score of **${seo}/80** ${Number(seo) >= 40 ? 'reflects solid metadata optimization' : 'suggests room to improve discoverability'}. Publishing at **${formData?.upload_hour}:00** falls in the **${hourLabel}**, which ${hourLabel === 'peak traffic window' ? 'maximizes early algorithmic push' : 'may limit early impressions — consider rescheduling'}.`;
}

export default function AIExplanation({ result, formData, extras }) {
  const tips = generateTips({ formData, extras, result });
  const aiText = generateAIText({ formData, result, extras });

  return (
    <>
      {/* AI Insight Box */}
      <motion.div
        className="ai-section"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.5 }}
      >
        <div className="ai-card">
          <div className="ai-head">
            <div className="ai-avatar">🤖</div>
            <div className="ai-head-info">
              <h3>RevenueIQ AI Analysis</h3>
              <p>Generated from 6 ML signals · Based on your specific inputs</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className={`score-badge ${result.monetization === 'High' ? 'badge-good' : result.monetization === 'Medium' ? 'badge-ok' : 'badge-low'}`}>
                {result.monetization} Potential
              </span>
            </div>
          </div>
          <div className="ai-text">
            {aiText.split(/\*\*(.*?)\*\*/g).map((p, i) =>
              i % 2 === 1 ? <strong key={i}>{p}</strong> : p
            )}
          </div>
        </div>
      </motion.div>

      {/* Tips Grid */}
      <motion.div
        className="tips-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ⚡ Personalized Action Plan
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>— based on your exact scores</div>
        </div>
        <div className="tips-grid">
          {tips.map((tip, i) => (
            <motion.div
              key={tip.title}
              className={`tip-card ${tip.cls}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 + i * 0.1 }}
            >
              <div className="tip-icon">{tip.icon}</div>
              <div className="tip-body">
                <h4>{tip.title}</h4>
                <p>{tip.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
