'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

interface Msg { role: 'user'|'assistant'; content: string; }

const CTX = `User: Sagar, 22M, goal: muscle gain + fat loss. Avg kcal 7d: 1850 (goal 2100). Protein avg: 68g (goal 100g). Yesterday: skipped lunch, late biryani at 10pm, 5.5hrs sleep. Today hydration: 1.2L (goal 2.5L). Sodium trend: high. Mood: stressed.`;

const INIT: Msg[] = [{
  role: 'assistant',
  content: "Hey Sagar! 👋 I noticed you skipped lunch yesterday and had a late dinner — that's probably why you felt low energy this morning.\n\nAlso, you're only at 1.2L of water today and it's already 2 PM. Let's fix that first. 💧\n\nWhat can I help you with?",
}];

const QUICK = ['What should I eat for lunch?','Why is my energy low?','Give me a high-protein dinner','How to improve sleep quality?'];

export default function CoachPage() {
  const [msgs, setMsgs] = useState<Msg[]>(INIT);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const um: Msg = { role:'user', content:input.trim() };
    setMsgs(p=>[...p,um]); setInput(''); setLoading(true);
    try {
      const r = await fetch('/api/coach', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ messages:[...msgs,um], context:CTX }) });
      const d = await r.json();
      setMsgs(p=>[...p,{ role:'assistant', content: d.reply || 'Check your API key in .env.local.' }]);
    } catch { setMsgs(p=>[...p,{ role:'assistant', content:'Connection error. Set OPENROUTER_API_KEY in .env.local.' }]); }
    finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.strip}>
        <div>
          <span className="pill pill-purple" style={{ marginBottom:10, display:'inline-flex' }}>Feature 4</span>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,3rem)', letterSpacing:'-0.04em', marginTop:8 }}>AI Health <span className="grad-purple">Coach</span></h1>
          <p style={{ marginTop:8 }}>Context-aware — knows your last 7 days, goals, mood & patterns</p>
        </div>
        <div className={styles.status}>
          <span className={styles.statusDot} />Online · Live context
        </div>
      </div>

      <div className={styles.chatWrap}>
        <div className={styles.context}>
          🧠 Coach has full context of your nutrition history, goals, sleep, and mood
        </div>

        <div className={styles.messages} id="chat-messages">
          {msgs.map((m,i)=>(
            <div key={i} className={`${styles.bubble} ${m.role==='user'?styles.userBubble:''}`}>
              {m.role==='assistant' && <span className={styles.avatar}>🤖</span>}
              <div className={`${styles.bubbleText} ${m.role==='user'?styles.userText:styles.aiText}`}>
                {m.content.split('\n').map((l,j)=><p key={j}>{l}</p>)}
              </div>
            </div>
          ))}
          {loading && (
            <div className={styles.bubble}>
              <span className={styles.avatar}>🤖</span>
              <div className={`${styles.bubbleText} ${styles.aiText} ${styles.typing}`}>
                <span/><span/><span/>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        <div className={styles.quickRow}>
          {QUICK.map(q=><button key={q} className="chip" onClick={()=>setInput(q)} id={`q-${q.slice(0,8)}`}>{q}</button>)}
        </div>
        <div className={styles.inputRow}>
          <input className="input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask your coach anything…" id="coach-input" style={{ flex:1 }}/>
          <button className="btn btn-health" onClick={send} disabled={loading||!input.trim()} id="send-btn">Send →</button>
        </div>
      </div>
    </div>
  );
}
