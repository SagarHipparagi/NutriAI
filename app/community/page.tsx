'use client';
import { useState } from 'react';
import styles from './page.module.css';

const CHALLENGES = [
  {id:'sugar',icon:'🍬',title:'7-Day No Sugar Challenge',desc:'Eliminate added sugars for 7 days. Boost energy, mood, and insulin sensitivity.',duration:'7',participants:1284,progress:0,joined:false,diff:'Medium',reward:'🏅 Sugar Crusher'},
  {id:'hydra',icon:'💧',title:'Hydration Streak — 14 Days',desc:'Hit your daily water goal for 14 days straight. Your skin, energy, and kidneys will thank you.',duration:'14',participants:3421,progress:5,joined:true,diff:'Easy',reward:'💎 Hydro Hero'},
  {id:'protein',icon:'💪',title:'Protein King — 21 Days',desc:'Hit 80g+ protein every day for 21 days. Build the habit that builds muscle.',duration:'21',participants:876,progress:0,joined:false,diff:'Hard',reward:'🥇 Protein Champ'},
  {id:'steps',icon:'🚶',title:'10K Steps × 7 Days',desc:'Walk 10,000 steps daily. Proven to reduce cardiovascular risk by 40%.',duration:'7',participants:2109,progress:3,joined:true,diff:'Medium',reward:'🏃 Step Master'},
];
const BOARD = [
  {rank:1,name:'Aryan S.',city:'Mumbai',score:94,streak:21,a:'🧑🏻'},
  {rank:2,name:'Priya K.',city:'Bengaluru',score:91,streak:18,a:'👩🏽'},
  {rank:3,name:'Rohan M.',city:'Delhi',score:88,streak:15,a:'🧔🏼'},
  {rank:4,name:'You',city:'Your city',score:82,streak:7,a:'😊',you:true},
  {rank:5,name:'Sneha P.',city:'Pune',score:79,streak:12,a:'👩🏻'},
];

export default function CommunityPage() {
  const [ch,setCh] = useState(CHALLENGES);
  const toggle = (id:string) => setCh(p=>p.map(c=>c.id===id?{...c,joined:!c.joined,participants:c.joined?c.participants-1:c.participants+1}:c));

  return (
    <div className={styles.page}>
      <div>
        <span className="pill pill-amber fade-up">Feature 7</span>
        <h1 className="fade-up-2" style={{ marginTop:12, fontSize:'clamp(2.4rem,5vw,4.5rem)', fontWeight:800, letterSpacing:'-0.04em' }}>
          Community <span className="grad-warm">Challenges</span>
        </h1>
        <p className="fade-up-3" style={{ marginTop:12, maxWidth:480, fontSize:'1.05rem' }}>Compete, collaborate, and stay accountable with the NutriAI community.</p>
      </div>

      {/* Stats */}
      <div className="grid-4 fade-up">
        {[{l:'Your Streak',v:'7 🔥',c:'#ff9f0a'},{l:'Active',v:'2',c:'#ff375f'},{l:'Global Rank',v:'#4',c:'#5ac8fa'},{l:'Points',v:'1,240',c:'#30d158'}].map(s=>(
          <div key={s.l} className="stat-block">
            <p className="stat-eyebrow">{s.l}</p>
            <p className="stat-number" style={{ color:s.c, fontSize:'2rem' }}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Challenges */}
      <div className="fade-up-2">
        <h2 style={{ marginBottom:20, fontSize:'clamp(1.6rem,3vw,2.2rem)' }}>🏆 Active Challenges</h2>
        <div className={styles.challengeGrid}>
          {ch.map(c=>(
            <div key={c.id} className={`${styles.challengeCard} card ${c.joined?styles.joined:''}`}>
              <div className={styles.cTop}>
                <span className={styles.cIcon}>{c.icon}</span>
                <div className={styles.cMeta}>
                  <span className={`pill ${c.diff==='Easy'?'pill-green':c.diff==='Medium'?'pill-amber':'pill-red'}`}>{c.diff}</span>
                  <span className={styles.cParticipants}>{c.participants.toLocaleString()} joined</span>
                </div>
              </div>
              <h3 style={{ fontSize:'1rem', letterSpacing:'-0.02em' }}>{c.title}</h3>
              <p style={{ fontSize:'0.85rem' }}>{c.desc}</p>
              <div className={styles.rewardRow}>
                <span className={styles.reward}>{c.reward}</span>
                <span className={styles.duration}>{c.duration} days</span>
              </div>
              {c.joined && c.progress > 0 && (
                <div className={styles.progressSection}>
                  <p className={styles.progressLabel}>Day {c.progress} / {c.duration} complete</p>
                  <div className="progress" style={{ height:5 }}>
                    <div className="progress-fill" style={{ width:`${(c.progress/parseInt(c.duration))*100}%`, background:'linear-gradient(90deg,#ff375f,#bf5af2)' }}/>
                  </div>
                </div>
              )}
              <button className={`btn ${c.joined?'btn-ghost':'btn-health'} btn-sm`} onClick={()=>toggle(c.id)} id={`c-${c.id}`}>
                {c.joined ? '✓ Joined · Leave' : '+ Join Challenge'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="fade-up-3">
        <h2 style={{ marginBottom:20, fontSize:'clamp(1.6rem,3vw,2.2rem)' }}>📊 Global Leaderboard</h2>
        <div className={`${styles.leaderboard} card`}>
          {BOARD.map(u=>(
            <div key={u.rank} className={`${styles.lRow} ${u.you?styles.youRow:''}`}>
              <div className={styles.lRank}>{u.rank===1?'🥇':u.rank===2?'🥈':u.rank===3?'🥉':<span className={styles.lRankNum}>{u.rank}</span>}</div>
              <span className={styles.lAvatar}>{u.a}</span>
              <div className={styles.lInfo}>
                <div className={styles.lName}>{u.name} {u.you&&<span className="pill pill-red">You</span>}</div>
                <div className={styles.lCity}>{u.city}</div>
              </div>
              <div className={styles.lStats}>
                <span className={styles.lStreak}>🔥 {u.streak}d</span>
                <span className={styles.lScore}>{u.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
