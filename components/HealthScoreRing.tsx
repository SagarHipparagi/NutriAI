'use client';
import { useEffect, useState } from 'react';
import styles from './HealthScoreRing.module.css';

export default function HealthScoreRing({ score }: { score: number }) {
  const [val, setVal] = useState(0);
  const R = 72;
  const CIRC = 2 * Math.PI * R;
  const dash = CIRC * (val / 100);
  const color = val >= 80 ? '#30d158' : val >= 60 ? '#ff9f0a' : '#ff375f';
  const label = val >= 80 ? 'Excellent' : val >= 60 ? 'Good' : 'Needs Work';

  useEffect(() => {
    let n = 0;
    const step = score / 80;
    const id = setInterval(() => {
      n += step;
      if (n >= score) { setVal(score); clearInterval(id); }
      else setVal(Math.round(n));
    }, 16);
    return () => clearInterval(id);
  }, [score]);

  return (
    <div className={styles.wrap}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff375f" />
            <stop offset="50%" stopColor="#bf5af2" />
            <stop offset="100%" stopColor="#5e5ce6" />
          </linearGradient>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        {/* Fill */}
        <circle
          cx="90" cy="90" r={R} fill="none"
          stroke="url(#rg)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRC}`}
          transform="rotate(-90 90 90)"
          filter="url(#glow2)"
          style={{ transition: 'stroke-dasharray 0.04s' }}
        />
        <text x="90" y="84" textAnchor="middle" fill="#f5f5f7" fontSize="34" fontWeight="800" fontFamily="Inter" letterSpacing="-2">
          {val}
        </text>
        <text x="90" y="102" textAnchor="middle" fill="#6e6e73" fontSize="12" fontWeight="500" fontFamily="Inter">
          out of 100
        </text>
        <text x="90" y="120" textAnchor="middle" fill={color} fontSize="11" fontWeight="700" fontFamily="Inter">
          ● {label}
        </text>
      </svg>
    </div>
  );
}
