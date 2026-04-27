import styles from './PredictionCard.module.css';

interface Props {
  icon: string;
  color: string;
  title: string;
  desc: string;
  severity: 'warn' | 'info' | 'ok' | 'danger';
}

const SEVERITY_CLASS: Record<string, string> = {
  warn: 'alert-warn', info: 'alert-info', ok: 'alert-ok', danger: 'alert-danger',
};

export default function PredictionCard({ icon, color, title, desc, severity }: Props) {
  return (
    <div className={`${styles.card} glass`}>
      <div className={styles.top}>
        <span className={styles.icon} style={{ background: `${color}22`, border: `1px solid ${color}44` }}>{icon}</span>
        <span className={SEVERITY_CLASS[severity] + ' badge'} style={{ fontSize: '0.65rem' }}>
          {severity === 'warn' ? '⚠ Warning' : severity === 'ok' ? '✓ Good' : severity === 'danger' ? '🚨 Alert' : 'ℹ Info'}
        </span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
}
