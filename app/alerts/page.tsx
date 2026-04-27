'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const ALERTS_DATA = [
  {id:'sodium',sev:'danger',icon:'🧂',title:'Sodium Intake Consistently High',desc:'Your sodium has been above 2,300mg for 6 of the last 7 days — associated with hypertension risk. Current average: 2,840mg/day.',trend:[2100,2400,2900,2700,3100,2600,2840],label:'Sodium (mg)',safe:2300,action:'Reduce pickles, papad, and processed snacks. Add potassium-rich foods like banana and sweet potato.',dismissed:false},
  {id:'sugar',sev:'warn',icon:'🍬',title:'Sugar Pattern Elevated',desc:'Added sugar is trending upward over 2 weeks. Correlates with your low-mood days. Average: 48g (recommended: <25g).',trend:[22,28,35,32,45,52,48],label:'Sugar (g)',safe:25,action:'Replace sweet chai with plain chai. Avoid biscuits as snacks — try nuts instead.',dismissed:false},
  {id:'iron',sev:'warn',icon:'🩸',title:'Iron Deficiency Risk — ~5 Days',desc:'Estimated iron intake: 6mg/day (requirement: 17mg for active males). Fatigue pattern detected in your usage.',trend:[8,7,6,6,5,6,6],label:'Iron (mg)',safe:17,action:'Add spinach, masoor dal, or fortified cereal. Pair with Vitamin C foods for better absorption.',dismissed:false},
  {id:'glucose',sev:'info',icon:'🩺',title:'Preventive: Glucose Pattern Watch',desc:'Your diet pattern (high refined carbs, low fiber, irregular meals) resembles early-risk profiles. Preventive alert — not a diagnosis.',trend:[68,72,74,71,76,75,74],label:'Est. Glucose Index',safe:70,action:'Increase fiber (sabzi, pulses). Reduce maida/white rice. Eat at consistent times daily.',dismissed:false},
];

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const SEV = { danger:{bar:'#ff375f',pill:'pill-red',label:'🚨 Critical'}, warn:{bar:'#ff9f0a',pill:'pill-amber',label:'⚠️ Warning'}, info:{bar:'#bf5af2',pill:'pill-purple',label:'ℹ️ Preventive'} };

export default function AlertsPage() {
  const [alerts,setAlerts] = useState(ALERTS_DATA);
  const [open,setOpen] = useState<string|null>('sodium');
  const dismiss = (id:string) => setAlerts(p=>p.map(a=>a.id===id?{...a,dismissed:true}:a));
  const active = alerts.filter(a=>!a.dismissed);

  return (
    <div className={styles.page}>
      <div>
        <span className="pill pill-red fade-up">Feature 8</span>
        <h1 className="fade-up-2" style={{ marginTop:12, fontSize:'clamp(2.4rem,5vw,4.5rem)', fontWeight:800, letterSpacing:'-0.04em' }}>
          Preventive <span className="grad-health">Health Alerts</span>
        </h1>
        <p className="fade-up-3" style={{ marginTop:12, maxWidth:480, fontSize:'1.05rem' }}>Early warning system that identifies risk patterns before they become problems.</p>
      </div>

      <div className="grid-3 fade-up">
        {[{l:'Critical',v:active.filter(a=>a.sev==='danger').length,c:'#ff375f'},{l:'Warnings',v:active.filter(a=>a.sev==='warn').length,c:'#ff9f0a'},{l:'Preventive',v:active.filter(a=>a.sev==='info').length,c:'#bf5af2'}].map(s=>(
          <div key={s.l} className="stat-block">
            <p className="stat-eyebrow">{s.l} Alerts</p>
            <p className="stat-number" style={{ color:s.c, fontSize:'2.5rem' }}>{s.v}</p>
          </div>
        ))}
      </div>

      <div className={`${styles.alertList} fade-up-2`}>
        {active.length===0 && <div className="alert alert-ok" style={{ justifyContent:'center' }}>🎉 All clear! No active health alerts. Keep going!</div>}
        {active.map(a=>{
          const cfg = SEV[a.sev as keyof typeof SEV];
          const data = a.trend.map((v,i)=>({day:DAYS[i],v}));
          return (
            <div key={a.id} className={`${styles.alertCard} card`}>
              <div className={styles.alertHeader} onClick={()=>setOpen(open===a.id?null:a.id)} id={`al-${a.id}`}>
                <div className={styles.aLeft}>
                  <span className={styles.aIcon}>{a.icon}</span>
                  <div style={{ flex:1 }}>
                    <div className={styles.aTitleRow}>
                      <h3 style={{ fontSize:'1rem', letterSpacing:'-0.02em' }}>{a.title}</h3>
                      <span className={`pill ${cfg.pill}`}>{cfg.label}</span>
                    </div>
                    <p style={{ fontSize:'0.85rem', marginTop:4 }}>{a.desc}</p>
                  </div>
                </div>
                <span className={styles.aChevron}>{open===a.id?'▲':'▼'}</span>
              </div>

              {open===a.id && (
                <div className={styles.alertBody}>
                  <div>
                    <p className={styles.trendLabel}>{a.label} — Last 7 Days</p>
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={data} margin={{top:8,right:8,left:-16,bottom:0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="day" stroke="none" tick={{fill:'#6e6e73',fontSize:11}} />
                        <YAxis stroke="none" tick={{fill:'#6e6e73',fontSize:11}} />
                        <Tooltip contentStyle={{background:'#1c1c1e',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12}} />
                        <ReferenceLine y={a.safe} stroke={cfg.bar} strokeDasharray="4 4" label={{value:'Safe',fill:cfg.bar,fontSize:10,position:'insideTopRight'}} />
                        <Bar dataKey="v" fill={cfg.bar} fillOpacity={0.75} radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={`${styles.actionBox} alert alert-${a.sev==='danger'?'crit':a.sev==='warn'?'warn':'info'}`}>
                    <strong>💡 Action: </strong>{a.action}
                  </div>
                  <div className={styles.alertFooter}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>dismiss(a.id)} id={`dis-${a.id}`}>Dismiss</button>
                    <button className="btn btn-health btn-sm" id={`act-${a.id}`}>Get Meal Suggestions</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
