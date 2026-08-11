import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [
      { to: '/features', label: 'Features' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/how-it-works', label: 'How it works' },
      { to: '/leaderboard', label: 'Leaderboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/testimonials', label: 'Testimonials' },
      { to: '/blog', label: 'Blog' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: 'Help center' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms & Conditions' },
      { to: '/cookies', label: 'Cookie Policy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-primary-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr,1fr,1fr,1fr,1fr]">
          <div>
            <div className="flex items-center gap-2 font-display text-base font-bold text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                <GraduationCap size={16} />
              </span>
              Prep<span className="text-gradient">Deck</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Free CBT-style practice for JAMB, WAEC, NECO and POST-UTME, across 13 Nigerian school
              subjects — timed, tracked, and always improving.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-sm text-muted hover:text-primary-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-primary-50 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} PrepDeck. Not affiliated with JAMB, WAEC, or NECO. Built with React, Tailwind CSS, Node.js &amp; Supabase.
      </div>
    </footer>
  );
}
