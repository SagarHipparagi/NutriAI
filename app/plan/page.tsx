'use client';
import { useState } from 'react';
import styles from './page.module.css';

type Goal = 'loss'|'gain'|'maintain';
type Budget = 'low'|'mid'|'high';

const DEMO = {
  days: [
    { day:'Monday', meals: [
      {time:'Breakfast',name:'Masala Oats + Boiled Eggs',kcal:380,protein:22,tags:['High Protein','Quick']},
      {time:'Lunch',name:'Dal + Brown Rice + Salad',kcal:520,protein:20,tags:['Balanced']},
      {time:'Snack',name:'Greek Yogurt + Almonds',kcal:180,protein:12,tags:['High Protein']},
      {time:'Dinner',name:'Grilled Chicken + Sabzi + Phulka',kcal:560,protein:38,tags:['High Protein']},
    ]},
    { day:'Tuesday', meals: [
      {time:'Breakfast',name:'Moong Dal Chilla + Mint Chutney',kcal:320,protein:18,tags:['Indian','Protein']},
      {time:'Lunch',name:'Rajma Chawal + Cucumber Raita',kcal:580,protein:22,tags:['Balanced']},
      {time:'Snack',name:'Sprouts Chaat',kcal:150,protein:9,tags:['Light']},
      {time:'Dinner',name:'Paneer Bhurji + Phulka + Dal Soup',kcal:540,protein:32,tags:['Vegetarian']},
    ]},
    { day:'Wednesday', meals: [
      {time:'Breakfast',name:'Besan Chilla + Curd',kcal:340,protein:20,tags:['Indian','Quick']},
      {time:'Lunch',name:'Chicken Biryani (Brown Rice) + Salad',kcal:600,protein:36,tags:['High Protein']},
      {time:'Snack',name:'Banana + Peanut Butter',kcal:200,protein:6,tags:['Energy']},
      {time:'Dinner',name:'Vegetable Khichdi + Ghee',kcal:420,protein:14,tags:['Light']},
    ]},
  ],
  grocery: {
    'Proteins':['Chicken breast (500g)','Paneer (200g)','Eggs (12)','Greek yogurt (500g)','Moong dal (500g)'],
    'Grains':['Brown rice (1kg)','Oats (500g)','Whole wheat atta (1kg)'],
    'Vegetables':['Spinach','Tomatoes','Onions','Cucumber','Mixed sabzi'],
    'Fruits':['Bananas (6)','Apples (4)'],
    'Pantry':['Peanut butter','Almonds (100g)','Ghee','Olive oil'],
  }
};

export default function PlanPage() {
  const [goal,setGoal] = useState<Goal>('gain');
  const [budget,setBudget] = useState<Budget>('mid');
  const [pref,setPref] = useState<'veg'|'non-veg'|'both'>('both');
  const [plan,setPlan] = useState<typeof DEMO|null>(null);
  const [loading,setLoading] = useState(false);
  const [activeDay,setActiveDay] = useState(0);
  const [grocery,setGrocery] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/generate-plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({goal,budget,preference:pref})});
      const d = await r.json();
      setPlan(d.plan||DEMO);
    } catch { setPlan(DEMO); }
    finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className="pill pill-teal fade-up">Feature 5</span>
        <h1 className="fade-up-2" style={{ marginTop:12, fontSize:'clamp(2.4rem,5vw,4.5rem)', fontWeight:800, letterSpacing:'-0.04em' }}>
          Smart <span className="grad-green">Meal Planner</span>
        </h1>
        <p className="fade-up-3" style={{ marginTop:12, maxWidth:480, fontSize:'1.05rem' }}>
          AI generates your personalised weekly plan with a grocery list — tailored to your goals.
        </p>
      </div>

      {/* Config */}
      <div className={`${styles.configCard} card fade-up`}>
        <h3>Customise Your Plan</h3>
        <div className={styles.configGrid}>
          <div>
            <p className={styles.cLabel}>Goal</p>
            <div className="chip-row">
              {(['loss','gain','maintain'] as Goal[]).map(g=><button key={g} className={`chip ${goal===g?'active':''}`} onClick={()=>setGoal(g)} id={`g-${g}`}>{g==='loss'?'🔥 Fat Loss':g==='gain'?'💪 Muscle Gain':'⚖️ Maintain'}</button>)}
            </div>
          </div>
          <div>
            <p className={styles.cLabel}>Budget</p>
            <div className="chip-row">
              {(['low','mid','high'] as Budget[]).map(b=><button key={b} className={`chip ${budget===b?'active':''}`} onClick={()=>setBudget(b)} id={`b-${b}`}>{b==='low'?'₹ Budget':b==='mid'?'₹₹ Mid-range':'₹₹₹ Premium'}</button>)}
            </div>
          </div>
          <div>
            <p className={styles.cLabel}>Preference</p>
            <div className="chip-row">
              {(['veg','non-veg','both'] as const).map(p=><button key={p} className={`chip ${pref===p?'active':''}`} onClick={()=>setPref(p)} id={`p-${p}`}>{p==='veg'?'🥦 Vegetarian':p==='non-veg'?'🍗 Non-Veg':'🍱 Both'}</button>)}
            </div>
          </div>
        </div>
        <button className="btn btn-health" onClick={generate} disabled={loading} id="gen-plan" style={{ width:'fit-content' }}>
          {loading ? '⏳ Generating…' : '✨ Generate My Plan'}
        </button>
      </div>

      {plan && (
        <div className="fade-up">
          <div className={styles.tabs}>
            {plan.days.map((d,i)=>(
              <button key={i} className={`${styles.tab} ${activeDay===i?styles.tabActive:''}`} onClick={()=>setActiveDay(i)} id={`d-${i}`}>{d.day}</button>
            ))}
          </div>
          <div className={styles.mealGrid} style={{ marginTop:14 }}>
            {plan.days[activeDay].meals.map((m,i)=>(
              <div key={i} className={`${styles.mealCard} card`}>
                <p className={styles.mealTime}>{m.time}</p>
                <h3 className={styles.mealName}>{m.name}</h3>
                <p className={styles.mealMeta}>{m.kcal} kcal · {m.protein}g protein</p>
                <div className="chip-row" style={{ marginTop:4 }}>
                  {m.tags.map(t=><span key={t} className="pill pill-purple" style={{ fontSize:'0.62rem' }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>

          <div className={`${styles.groceryBox} card`} style={{ marginTop:16 }}>
            <button className={styles.groceryToggle} onClick={()=>setGrocery(!grocery)} id="grocery-toggle">
              <span>🛒 Auto-Generated Grocery List</span>
              <span style={{ color:'var(--text-3)', fontSize:'0.9rem' }}>{grocery?'▲':'▼'}</span>
            </button>
            {grocery && (
              <div className={styles.groceryInner}>
                {Object.entries(plan.grocery).map(([cat,items])=>(
                  <div key={cat} className={styles.groceryCat}>
                    <p className={styles.groceryCatLabel}>{cat}</p>
                    <ul className={styles.groceryList}>{items.map(it=><li key={it}>✓ {it}</li>)}</ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
