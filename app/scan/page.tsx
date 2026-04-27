'use client';
import { useState, useRef, useCallback } from 'react';
import styles from './page.module.css';

interface FoodResult {
  name: string; cuisine: string; calories: number; protein: number;
  carbs: number; fat: number; fiber: number; healthScore: number;
  swaps: { item: string; benefit: string }[];
  insights: string[];
  sustainability: string;
}

const DEMO: FoodResult = {
  name: 'Dal Tadka with Jeera Rice', cuisine: '🇮🇳 North Indian',
  calories: 520, protein: 22, carbs: 78, fat: 11, fiber: 8, healthScore: 76,
  swaps: [
    { item: 'Replace white rice with brown rice', benefit: 'Reduces glycaemic index by 25%, adds 3g fiber' },
    { item: 'Add a cucumber-tomato salad on the side', benefit: 'Adds vitamins A & C for only +20 kcal' },
  ],
  insights: [
    'High plant protein — excellent for muscle synthesis',
    'Turmeric in dal reduces inflammation markers by up to 30%',
    'This meal will keep you satiated for approximately 3.5 hours',
  ],
  sustainability: 'Low carbon footprint — 0.8 kg CO₂ equivalent. One of the best ecological choices!',
};

export default function ScanPage() {
  const [mode, setMode] = useState<'camera'|'text'>('camera');
  const [cameraOn, setCameraOn] = useState(false);
  const [captured, setCaptured] = useState<string|null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodResult|null>(null);
  const [err, setErr] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream|null>(null);

  const startCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
      setCameraOn(true);
    } catch { setErr('Camera access denied. Use text mode.'); setMode('text'); }
  };
  const stopCam = () => { streamRef.current?.getTracks().forEach(t=>t.stop()); setCameraOn(false); };
  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    setCaptured(canvasRef.current.toDataURL('image/jpeg', 0.85));
    stopCam();
  };
  const analyze = async () => {
    setLoading(true); setErr(''); setResult(null);
    try {
      const res = await fetch('/api/analyze-food', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(captured ? {image:captured} : {text:query}) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e:any) { setErr(e.message); setResult(DEMO); }
    finally { setLoading(false); }
  };
  const reset = () => { setCaptured(null); setResult(null); setQuery(''); setErr(''); };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroOrb} />
        <div className={styles.heroContent}>
          <span className="pill pill-red fade-up">Feature 2</span>
          <h1 className="fade-up-2" style={{ marginTop: 12, fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.04em' }}>
            Food <span className="grad-health">Scanner</span>
          </h1>
          <p className="fade-up-3" style={{ marginTop: 12, maxWidth: 480, fontSize: '1.05rem' }}>
            Point your camera at any dish. AI identifies it, breaks down macros, and suggests smarter alternatives.
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {!result && (
          <div className="fade-up">
            {/* Mode Toggle */}
            <div className={styles.modeBar}>
              <button className={`${styles.modeBtn} ${mode==='camera'?styles.modeActive:''}`} onClick={()=>{setMode('camera');setCaptured(null);}}>📷 Camera</button>
              <button className={`${styles.modeBtn} ${mode==='text'?styles.modeActive:''}`} onClick={()=>{setMode('text');stopCam();}}>✍️ Describe</button>
            </div>

            {mode==='camera' && (
              <div style={{ marginTop: 20, display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                {!cameraOn && !captured && (
                  <div className={styles.cameraZone} onClick={startCam} id="start-cam">
                    <span className={styles.cameraIcon}>📷</span>
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>Click to start camera</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>Recognises 500+ Indian & global dishes</p>
                    <button className="btn btn-health" style={{ marginTop: 8 }}>Start Camera</button>
                  </div>
                )}
                {cameraOn && (
                  <div className={styles.videoWrap}>
                    <video ref={videoRef} autoPlay playsInline className={styles.video} />
                    <div className={styles.scanOverlay} />
                    <div style={{ display:'flex', justifyContent:'center', marginTop:12 }}>
                      <button className="btn btn-health" onClick={capture} id="capture-btn">📸 Capture Meal</button>
                    </div>
                  </div>
                )}
                {captured && (
                  <div style={{ display:'flex', flexDirection:'column', gap:12, alignItems:'center', width:'100%', maxWidth:560 }}>
                    <img src={captured} alt="meal" className={styles.previewImg} />
                    <div style={{ display:'flex', gap:10 }}>
                      <button className="btn btn-ghost" onClick={reset}>Retake</button>
                      <button className="btn btn-health" onClick={analyze} disabled={loading} id="analyze-btn">
                        {loading ? '🔍 Analysing…' : '🔍 Analyse Meal'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode==='text' && (
              <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:14 }}>
                <textarea className="input" placeholder="Describe your meal e.g. 'Dal makhani with 2 rotis and onion salad'" value={query} onChange={e=>setQuery(e.target.value)} id="food-text" rows={4} />
                <button className="btn btn-health" onClick={analyze} disabled={loading||!query.trim()} id="analyze-text-btn" style={{ width:'fit-content' }}>
                  {loading ? '🔍 Analysing…' : '🔍 Analyse Meal'}
                </button>
              </div>
            )}

            {err && <div className="alert alert-warn" style={{ marginTop:16 }}>⚠ {err} — showing demo result below.</div>}
            <canvas ref={canvasRef} style={{ display:'none' }} />
          </div>
        )}

        {result && (
          <div className="fade-up" style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Result Hero */}
            <div className={styles.resultHero}>
              <div>
                <p style={{ fontSize:'0.8rem', color:'var(--text-3)', marginBottom:6 }}>{result.cuisine}</p>
                <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', letterSpacing:'-0.03em' }}>{result.name}</h2>
              </div>
              <div className={styles.scoreCircle} style={{ background: `conic-gradient(#30d158 0deg ${result.healthScore * 3.6}deg, rgba(255,255,255,0.06) ${result.healthScore * 3.6}deg)` }}>
                <span className={styles.scoreNum}>{result.healthScore}</span>
                <span className={styles.scoreLbl}>SCORE</span>
              </div>
            </div>

            {/* Macros */}
            <div className="grid-4">
              {[
                {l:'Calories', v:result.calories, u:'kcal', c:'#ff375f'},
                {l:'Protein',  v:result.protein,  u:'g',    c:'#bf5af2'},
                {l:'Carbs',    v:result.carbs,    u:'g',    c:'#ff9f0a'},
                {l:'Fat',      v:result.fat,      u:'g',    c:'#5ac8fa'},
              ].map(m=>(
                <div key={m.l} className="stat-block">
                  <p className="stat-eyebrow">{m.l}</p>
                  <p className="stat-number" style={{ color:m.c, fontSize:'1.9rem' }}>{m.v}<span className="stat-unit"> {m.u}</span></p>
                </div>
              ))}
            </div>

            {/* Swaps */}
            <div className={`${styles.swapCard} card`}>
              <h3 style={{ marginBottom:16 }}>🔄 Healthier Swaps</h3>
              {result.swaps.map((s,i)=>(
                <div key={i} className={styles.swapItem}>
                  <span style={{ color:'var(--teal)', fontSize:'0.8rem', marginTop:2 }}>✦</span>
                  <div>
                    <p style={{ fontSize:'0.9rem', fontWeight:600, color:'var(--text)' }}>{s.item}</p>
                    <p style={{ fontSize:'0.8rem', color:'var(--green)', marginTop:3 }}>{s.benefit}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Insights */}
            <div className={`${styles.insightCard} card`}>
              <h3 style={{ marginBottom:16 }}>💡 AI Insights</h3>
              {result.insights.map((ins,i)=>(
                <div key={i} className={styles.insightItem}>
                  <span style={{ color:'var(--purple)', flexShrink:0 }}>◆</span>
                  <span>{ins}</span>
                </div>
              ))}
            </div>

            <div className="alert alert-ok">🌱 {result.sustainability}</div>
            <button className="btn btn-ghost" onClick={reset} id="scan-again">← Scan Another Meal</button>
          </div>
        )}
      </div>
    </div>
  );
}
