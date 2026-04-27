'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MOOD_LABELS: Record<number,string> = {1:'😞',2:'😕',3:'😐',4:'🙂',5:'😄'};
const LOG = [
  {day:'Mon',mood:3,sugar:42,protein:58},{day:'Tue',mood:4,sugar:28,protein:74},
  {day:'Wed',mood:2,sugar:68,protein:45},{day:'Thu',mood:5,sugar:18,protein:92},
  {day:'Fri',mood:3,sugar:55,protein:62},{day:'Sat',mood:4,sugar:32,protein:80},
  {day:'Sun',mood:4,sugar:25,protein:85},
];
const INSIGHTS = [
  {icon:'🍬',title:'Sugar ↔ Mood',desc:'High sugar (>50g) correlates with low mood on 4 of your 5 worst days. The link is clear.',color:'#ff375f',gradient:'card-red'},
  {icon:'🥚',title:'Protein = Focus',desc:'Days with 75g+ protein show a 0.8 mood point uplift. High-protein breakfasts boost focus ~20%.',color:'#30d158',gradient:'card-green'},
  {icon:'💧',title:'Hydration + Energy',desc:'On days you hit 2L water, energy self-rating is 34% higher. Current 7-day avg: 1.4L.',color:'#5ac8fa',gradient:'card-blue'},
  {icon:'🌙',title:'Sleep → Next Day Mood',desc:'Under 6 hrs sleep predicts 1.5 lower mood the following day. Last night: 5.5 hrs.',color:'#ff9f0a',gradient:'card-amber'},
];

export default function MoodPage() {
  const [today, setToday] = useState<number|null>(null);
  const [note, setNote] = useState('');
  const [logged, setLogged] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className="pill pill-amber fade-up">Feature 3</span>
        <h1 className="fade-up-2" style={{ marginTop:12, fontSize:'clamp(2.4rem,5vw,4.5rem)', fontWeight:800, letterSpacing:'-0.04em' }}>
          Mood <span className="grad-warm">↔ Food</span>
        </h1>
        <p className="fade-up-3" style={{ marginTop:12, maxWidth:480, fontSize:'1.05rem' }}>
          Discover how your diet shapes your mental state, energy, and focus every single day.
        </p>
      </div>

      {/* Mood Logger */}
      <div className={`${styles.moodLogger} card fade-up`}>
        <h3 style={{ fontSize:'1.1rem' }}>How are you feeling right now?</h3>
        {!logged ? (
          <>
            <div className={styles.emojiRow}>
              {[1,2,3,4,5].map(m=>(
                <button key={m} className={`${styles.emojiBtn} ${today===m?styles.emojiActive:''}`} onClick={()=>setToday(m)} id={`mood-${m}`}>
                  {MOOD_LABELS[m]}
                </button>
              ))}
            </div>
            <input className="input" placeholder="Add a note (optional)…" value={note} onChange={e=>setNote(e.target.value)} id="mood-note" />
            <button className="btn btn-health" onClick={()=>setLogged(true)} disabled={!today} id="log-mood" style={{ width:'fit-content' }}>Log Mood</button>
          </>
        ) : (
          <div className={styles.loggedRow}>
            <span style={{ fontSize:'2.8rem' }}>{MOOD_LABELS[today!]}</span>
            <div>
              <p style={{ fontWeight:700, color:'var(--text)', fontSize:'1rem' }}>
                {today!>=4 ? "You're doing great today! 🎉" : today===3 ? "Hang in there — checked your protein?" : "Rough day? High sugar can amplify stress."}
              </p>
              {note && <p style={{ color:'var(--text-3)', fontSize:'0.85rem', marginTop:4 }}>&ldquo;{note}&rdquo;</p>}
            </div>
          </div>
        )}
      </div>

      {/* Scatter */}
      <div className={`${styles.chartCard} card fade-up-2`}>
        <h3 className={styles.chartTitle}>Mood vs. Sugar Intake — 7 days</h3>
        <p className={styles.chartSub}>Lower sugar consistently correlates with higher mood scores</p>
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="sugar" name="Sugar (g)" stroke="none" tick={{fill:'#6e6e73',fontSize:11}} label={{value:'Sugar (g)',fill:'#6e6e73',position:'insideBottom',offset:-4}}/>
            <YAxis dataKey="mood" name="Mood" domain={[1,5]} stroke="none" tick={{fill:'#6e6e73',fontSize:11}}/>
            <Tooltip contentStyle={{background:'#1c1c1e',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12}} />
            <Scatter data={LOG} fill="#ff375f" fillOpacity={0.85} r={6}/>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Area */}
      <div className={`${styles.chartCard} card fade-up-3`}>
        <h3 className={styles.chartTitle}>7-Day Mood Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={LOG}>
            <defs>
              <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff9f0a" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ff9f0a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" stroke="none" tick={{fill:'#6e6e73',fontSize:11}}/>
            <YAxis domain={[1,5]} stroke="none" tick={{fill:'#6e6e73',fontSize:11}}/>
            <Tooltip contentStyle={{background:'#1c1c1e',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12}} formatter={(v:any)=>[MOOD_LABELS[v]+' '+v+'/5','Mood']}/>
            <Area type="monotone" dataKey="mood" stroke="#ff9f0a" fill="url(#mg)" strokeWidth={2.5} dot={{fill:'#ff9f0a',r:4,strokeWidth:0}} activeDot={{r:6,fill:'#f5f5f7'}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="fade-up-4">
        <h2 style={{ marginBottom:20, fontSize:'clamp(1.6rem,3vw,2.2rem)' }}>🧠 Personalised Insights</h2>
        <div className="grid-2">
          {INSIGHTS.map((ins,i)=>(
            <div key={i} className={`${styles.insightCard} ${ins.gradient}`} style={{ borderRadius:'var(--r-xl)' }}>
              <div className={styles.insightTop}>
                <span className={styles.insightIcon} style={{background:`${ins.color}18`}}>{ins.icon}</span>
                <span className="pill pill-dim">Pattern</span>
              </div>
              <h3 style={{ fontSize:'1rem', letterSpacing:'-0.02em' }}>{ins.title}</h3>
              <p style={{ fontSize:'0.85rem' }}>{ins.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
