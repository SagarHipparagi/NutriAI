'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WEEKLY = [
  {day:'Mon',co2:1.2,eco:0.7},{day:'Tue',co2:0.8,eco:0.6},{day:'Wed',co2:2.1,eco:1.1},
  {day:'Thu',co2:0.6,eco:0.5},{day:'Fri',co2:1.8,eco:0.9},{day:'Sat',co2:1.4,eco:0.8},{day:'Sun',co2:1.1,eco:0.7},
];
const MEALS = [
  {name:'Masala Oats + Eggs',co2:0.3,high:false,swap:null},
  {name:'Chicken Biryani',co2:1.8,high:true,swap:'Vegetable Biryani (0.4 kg CO₂) — saves 77%'},
  {name:'Dal Chawal',co2:0.4,high:false,swap:null},
];
const TIPS = [
  {icon:'🥦',t:'Eat More Plants',d:'Replacing one meat meal daily with legumes saves ~0.8 kg CO₂. That\'s 4× your current impact.'},
  {icon:'🐄',t:'Dairy Swaps',d:'Try oat milk in chai 3× a week. Saves ~0.2 kg CO₂ per swap with minimal taste difference.'},
  {icon:'🛒',t:'Buy Local & Seasonal',d:'Local produce has 5-10× lower transport emissions. Prefer sabzimandi over supermarket.'},
  {icon:'🌾',t:'Millets > White Rice',d:'Jowar, bajra, ragi need 70% less water and have a much lower carbon footprint.'},
];
const total = WEEKLY.reduce((s,d)=>s+d.co2,0);
const saved = +(14.7-total).toFixed(1);

export default function EcoPage() {
  const [unit,setUnit] = useState<'co2'|'eco'>('co2');
  return (
    <div className={styles.page}>
      <div>
        <span className="pill pill-green fade-up">Feature 10</span>
        <h1 className="fade-up-2" style={{ marginTop:12, fontSize:'clamp(2.4rem,5vw,4.5rem)', fontWeight:800, letterSpacing:'-0.04em' }}>
          Sustainability <span className="grad-green">Insights</span> 🌱
        </h1>
        <p className="fade-up-3" style={{ marginTop:12, maxWidth:480, fontSize:'1.05rem' }}>Track your food's environmental impact and make choices that are good for you and the planet.</p>
      </div>

      {/* Stats */}
      <div className="grid-3 fade-up">
        <div className="stat-block" style={{ border:'1px solid rgba(48,209,88,0.25)', background:'rgba(48,209,88,0.06)' }}>
          <p className="stat-eyebrow">This Week</p>
          <p className="stat-number" style={{ color:'var(--green)', fontSize:'2rem' }}>{total.toFixed(1)} <span className="stat-unit">kg CO₂</span></p>
          <p className="stat-delta delta-up">↓ {saved} kg vs average person</p>
        </div>
        <div className="stat-block">
          <p className="stat-eyebrow">Daily Average</p>
          <p className="stat-number" style={{ color:'var(--teal)', fontSize:'2rem' }}>{(total/7).toFixed(1)} <span className="stat-unit">kg</span></p>
          <p style={{ fontSize:'0.75rem', color:'var(--text-3)' }}>Avg person: 2.1 kg/day</p>
        </div>
        <div className="stat-block">
          <p className="stat-eyebrow">Trees Saved</p>
          <p className="stat-number" style={{ color:'var(--orange)', fontSize:'2rem' }}>0.6</p>
          <p style={{ fontSize:'0.75rem', color:'var(--text-3)' }}>Trees equivalent this week</p>
        </div>
      </div>

      {/* Chart */}
      <div className={`${styles.chartCard} card fade-up-2`}>
        <div className={styles.chartTop}>
          <div>
            <p className="eyebrow">Carbon Footprint</p>
            <h3 style={{ marginTop:6 }}>Weekly Breakdown</h3>
          </div>
          <div className={styles.toggle}>
            <button className={`${styles.toggleBtn} ${unit==='co2'?styles.toggleActive:''}`} onClick={()=>setUnit('co2')}>Actual</button>
            <button className={`${styles.toggleBtn} ${unit==='eco'?styles.toggleActive:''}`} onClick={()=>setUnit('eco')}>With Eco Swaps</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={WEEKLY} margin={{top:8,right:8,left:-16,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" stroke="none" tick={{fill:'#6e6e73',fontSize:11}} />
            <YAxis stroke="none" tick={{fill:'#6e6e73',fontSize:11}} />
            <Tooltip contentStyle={{background:'#1c1c1e',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12}} formatter={(v:any)=>[`${v} kg CO₂`,unit==='eco'?'Eco Swaps':'Actual']} />
            <Bar dataKey={unit} fill={unit==='eco'?'#30d158':'#bf5af2'} fillOpacity={0.8} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        {unit==='eco' && (
          <div className="alert alert-ok" style={{ marginTop:16 }}>
            🌱 Eco swaps could save <strong>{(total-WEEKLY.reduce((s,d)=>s+d.eco,0)).toFixed(1)} kg CO₂</strong> this week — a <strong>~{Math.round((1-WEEKLY.reduce((s,d)=>s+d.eco,0)/total)*100)}%</strong> reduction!
          </div>
        )}
      </div>

      {/* Meals */}
      <div className="fade-up-3">
        <h2 style={{ marginBottom:20, fontSize:'clamp(1.6rem,3vw,2.2rem)' }}>🍽️ Today&apos;s Meal Carbon</h2>
        <div className={styles.mealList}>
          {MEALS.map((m,i)=>(
            <div key={i} className={`${styles.mealCard} card`}>
              <div className={styles.mealTop}>
                <h3 style={{ fontSize:'0.95rem', letterSpacing:'-0.02em' }}>{m.name}</h3>
                <div className={styles.mealRight}>
                  <span style={{ fontWeight:800, fontSize:'1.1rem', letterSpacing:'-0.03em', color:m.high?'var(--red)':'var(--green)' }}>{m.co2} kg</span>
                  <span className={`pill ${m.high?'pill-red':'pill-green'}`}>{m.high?'High':'Low'} Impact</span>
                </div>
              </div>
              {m.swap && <div className={styles.swapRow}><span>🔄</span><span><strong>Eco Swap:</strong> {m.swap}</span></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="fade-up-4">
        <h2 style={{ marginBottom:20, fontSize:'clamp(1.6rem,3vw,2.2rem)' }}>💡 Eco Tips</h2>
        <div className="grid-2">
          {TIPS.map((t,i)=>(
            <div key={i} className={`${styles.tipCard} card`}>
              <span className={styles.tipIcon}>{t.icon}</span>
              <div>
                <h3 style={{ fontSize:'0.95rem', marginBottom:8 }}>{t.t}</h3>
                <p style={{ fontSize:'0.85rem' }}>{t.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
