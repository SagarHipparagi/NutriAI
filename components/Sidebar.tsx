'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const NAV = [
  { href: '/',           icon: '⚡', label: 'Dashboard'  },
  { href: '/scan',       icon: '📷', label: 'Food Scan'  },
  { href: '/coach',      icon: '🤖', label: 'AI Coach'   },
  { href: '/mood',       icon: '🧠', label: 'Mood'       },
  { href: '/plan',       icon: '📅', label: 'Meal Plan'  },
  { href: '/community',  icon: '🏆', label: 'Community'  },
  { href: '/alerts',     icon: '🔔', label: 'Alerts'     },
  { href: '/eco',        icon: '🌱', label: 'Eco'        },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>N</span>
      </div>
      <nav className={styles.nav}>
        {NAV.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${path === href ? styles.active : ''}`}
            title={label}
          >
            <span className={styles.navIcon}>{icon}</span>
            <span className={styles.navLabel}>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
