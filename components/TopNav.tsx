'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './TopNav.module.css';

const NAV = [
  { href: '/',          label: 'Dashboard'  },
  { href: '/scan',      label: 'Food Scan'  },
  { href: '/coach',     label: 'AI Coach'   },
  { href: '/mood',      label: 'Mood'       },
  { href: '/plan',      label: 'Meal Plan'  },
  { href: '/community', label: 'Community'  },
  { href: '/alerts',    label: 'Alerts'     },
  { href: '/eco',       label: 'Eco'        },
];

export default function TopNav() {
  const path = usePathname();
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} id="nav-logo">
          <span className={styles.logoMark}>N</span>
          <span className={styles.logoText}>NutriAI</span>
        </Link>

        {/* Nav Links */}
        <nav className={styles.links}>
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${path === href ? styles.active : ''}`}
              id={`nav-${label.toLowerCase().replace(/\s/g,'-')}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link href="/scan" className={`btn btn-health btn-sm ${styles.cta}`} id="nav-scan-cta">
          Scan Meal
        </Link>
      </div>
    </header>
  );
}
