import styles from './MacroBar.module.css';

export default function MacroBar({ eaten, goal }: { eaten: number; goal: number }) {
  const pct = Math.min((eaten / goal) * 100, 100);
  const color = pct > 95 ? '#f43f5e' : pct > 75 ? '#f59e0b' : '#7c6af7';
  return (
    <div className={styles.wrap}>
      <div className={styles.labels}>
        <span className={styles.eaten}>{eaten} kcal eaten</span>
        <span className={styles.remaining}>{Math.max(goal - eaten, 0)} kcal remaining</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>
      <div className={styles.goal}>Goal: {goal} kcal · {Math.round(pct)}% reached</div>
    </div>
  );
}
