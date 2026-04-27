'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import HealthScoreRing from '@/components/HealthScoreRing';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

const SCORE_HISTORY = [
  { day: 'Mon', score: 74 },
  { day: 'Tue', score: 68 },
  { day: 'Wed', score: 79 },
  { day: 'Thu', score: 82 },
  { day: 'Fri', score: 77 },
  { day: 'Sat', score: 85 },
  { day: 'Sun', score: 82 },
];

const VITALS = [
  { label: 'Calories', value: '1,905', unit: 'kcal today', delta: '+8%', up: true, color: '#ff375f', icon: '🔥' },
  { label: 'Protein',  value: '68',    unit: 'g / 100g goal',  delta: '−32g to go', up: false, color: '#bf5af2', icon: '💪' },
  { label: 'Hydration', value: '1.2',  unit: 'L / 2.5L goal', delta: '−52%',   up: false, color: '#5ac8fa', icon: '💧' },
  { label: 'Health Score', value: '82', unit: '/ 100 · Excellent', delta: '+7 today', up: true, color: '#30d158', icon: '⚡' },
];

const PREDICTIONS = [
  { icon: '⚡', color: '#ff9f0a', gradient: 'card-amber', tag: 'Predicted · 4 PM', title: 'Energy dip incoming', desc: "Based on your last 3 days, low energy typically hits around 4 PM. Have a protein-rich snack at 3:30 PM to prevent this." },
  { icon: '🩸', color: '#ff375f', gradient: 'card-red',   tag: 'Risk in ~5 days',  title: 'Iron deficiency risk', desc: "Your diet lacks iron-rich foods this week. Current intake: 6mg vs 17mg required. Add spinach or lentils today." },
  { icon: '💧', color: '#5ac8fa', gradient: 'card-blue',  tag: 'Right now',       title: 'Hydration lag',  desc: "You're 40% behind your water goal. At this rate you'll end the day at 1.6L. Drink 300ml before your next meal." },
  { icon: '✨', color: '#30d158', gradient: 'card-green', tag: 'Opportunity',     title: 'Ideal recovery day', desc: "Sleep + activity pattern today is perfect for muscle repair. Aim for 100g protein and light movement." },
];

const BREAKDOWN = [
  { label: 'Diet Quality',  value: 88, color: '#ff375f', delta: '+4' },
  { label: 'Hydration',     value: 63, color: '#5ac8fa', delta: '-8' },
  { label: 'Activity',      value: 74, color: '#30d158', delta: '+2' },
  { label: 'Sleep Quality', value: 81, color: '#bf5af2', delta: '+5' },
];

const TODAY_MEALS = [
  { name: 'Masala Oats + 2 Eggs', kcal: 380, time: '8:30 AM', p: 22, c: 42, f: 9 },
  { name: 'Dal Chawal',           kcal: 520, time: '1:00 PM', p: 18, c: 74, f: 8 },
  { name: 'Banana',               kcal: 105, time: '4:15 PM', p: 1,  c: 27, f: 0 },
];

const TOTAL = TODAY_MEALS.reduce((s, m) => s + m.kcal, 0);
const GOAL = 2100;

const Tooltip_ = ({ active, payload }: any) => active && payload?.length ? (
  <div style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px' }}>
    <p style={{ color: '#f5f5f7', fontWeight: 700, fontSize: '0.9rem' }}>{payload[0].value}</p>
    <p style={{ color: '#6e6e73', fontSize: '0.72rem' }}>Health Score</p>
  </div>
) : null;

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setScore(82), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={styles.page}>

      {/* ── HERO SECTION ── */}
      <section className={styles.hero}>
        <div className={styles.heroOrb1} />
        <div className={styles.heroOrb2} />
        <div className={styles.heroOrb3} />

        <div className={styles.heroContent}>
          <p className={`${styles.heroEyebrow} fade-up`}>Sunday, 27 April 2026</p>
          <h1 className={`${styles.heroTitle} fade-up-2`}>
            Good afternoon,<br />
            <span className="grad-health">Sagar.</span>
          </h1>
          <p className={`${styles.heroSub} fade-up-3`}>
            Your health score improved <strong style={{color:'#30d158'}}>+7 points</strong> today. AI found 4 actionable insights for you.
          </p>
          <div className={`${styles.heroActions} fade-up-4`}>
            <a href="/scan" className="btn btn-health btn-lg" id="hero-scan-btn">📷 Scan a Meal</a>
            <a href="/coach" className="btn btn-ghost btn-lg" id="hero-coach-btn">Talk to Coach →</a>
          </div>
        </div>
      </section>

      <div className={styles.content}>

        {/* ── VITAL STATS ── */}
        <section className={`${styles.section} fade-up`}>
          <div className={styles.vitalsGrid}>
            {VITALS.map((v, i) => (
              <div key={v.label} className={`${styles.vitalCard} card fade-up-${i+1}`}>
                <div className={styles.vitalIcon} style={{ color: v.color }}>{v.icon}</div>
                <p className="stat-eyebrow">{v.label}</p>
                <p className={styles.vitalNumber} style={{ color: v.color }}>{v.value}</p>
                <p className={styles.vitalUnit}>{v.unit}</p>
                <p className={`stat-delta ${v.up ? 'delta-up' : 'delta-down'}`}>{v.up ? '▲' : '▼'} {v.delta}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SCORE + CHART ── */}
        <section className={`${styles.section} fade-up-2`}>
          <div className={styles.scoreRow}>

            {/* Score Card */}
            <div className={`${styles.scoreCard} card`}>
              <p className="eyebrow" style={{ marginBottom: 20 }}>Daily Health Score</p>
              {mounted && <HealthScoreRing score={score} />}

              <div className={styles.breakdown}>
                {BREAKDOWN.map(b => (
                  <div key={b.label} className={styles.breakdownItem}>
                    <div className={styles.breakdownRow}>
                      <span className={styles.blabel}>{b.label}</span>
                      <span style={{ fontSize: '0.72rem', color: parseInt(b.delta) > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                        {parseInt(b.delta) > 0 ? '▲' : '▼'} {b.delta.replace('-','').replace('+','')}
                      </span>
                    </div>
                    <div className="progress">
                      <div className="progress-fill" style={{ width: `${b.value}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.whyBox}>
                <p className="eyebrow" style={{ marginBottom: 12 }}>Why did it change?</p>
                <div className={styles.whyList}>
                  <div className={styles.whyItem}><span className={`pill pill-green`}>+4</span><span>All 3 macros hit at breakfast</span></div>
                  <div className={styles.whyItem}><span className={`pill pill-red`}>−3</span><span>Only 4.8 hrs sleep last night</span></div>
                  <div className={styles.whyItem}><span className={`pill pill-amber`}>+6</span><span>Reached 8,000 steps target</span></div>
                </div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className={`${styles.chartCard} card`}>
              <div className={styles.chartHeader}>
                <div>
                  <p className="eyebrow">7-Day Trend</p>
                  <h3 style={{ marginTop: 6 }}>Weekly Overview</h3>
                </div>
                <span className="pill pill-green">▲ Improving</span>
              </div>
              {mounted && (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={SCORE_HISTORY}>
                    <defs>
                      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#bf5af2" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#bf5af2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" stroke="none" tick={{ fill: '#6e6e73', fontSize: 12, fontFamily: 'Inter' }} />
                    <YAxis domain={[60,100]} stroke="none" tick={{ fill: '#6e6e73', fontSize: 12, fontFamily: 'Inter' }} />
                    <Tooltip content={<Tooltip_ />} />
                    <Area type="monotone" dataKey="score" stroke="#bf5af2" strokeWidth={2.5} fill="url(#sg)" dot={{ fill: '#bf5af2', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#f5f5f7' }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {/* Today's Meals Summary */}
              <div className={styles.mealSummary}>
                <div className={styles.mealSummaryTop}>
                  <p className="eyebrow">Today's Nutrition</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{TOTAL} / {GOAL} kcal</span>
                </div>
                <div className="progress" style={{ height: 6, marginBottom: 16 }}>
                  <div className="progress-fill" style={{ width: `${(TOTAL/GOAL)*100}%`, background: 'linear-gradient(90deg, #ff375f, #bf5af2)' }} />
                </div>
                {TODAY_MEALS.map((m, i) => (
                  <div key={i} className={styles.mealRow}>
                    <div className={styles.mealDot} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>{m.name}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{m.time}</p>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-2)', fontWeight: 600 }}>{m.kcal} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PREDICTIONS ── */}
        <section className={`${styles.section} fade-up-3`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow">AI-powered</p>
              <h2 style={{ marginTop: 8, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>Predictive Insights</h2>
            </div>
            <span className="pill pill-purple">4 active predictions</span>
          </div>
          <div className={styles.predGrid}>
            {PREDICTIONS.map((p, i) => (
              <div key={i} className={`${styles.predCard} ${p.gradient}`} style={{ borderRadius: 'var(--r-xl)' }}>
                <div className={styles.predTop}>
                  <span className={styles.predIcon}>{p.icon}</span>
                  <span className="pill pill-dim">{p.tag}</span>
                </div>
                <h3 className={styles.predTitle}>{p.title}</h3>
                <p className={styles.predDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
