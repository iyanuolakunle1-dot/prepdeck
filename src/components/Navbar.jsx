import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-primary-600' : 'text-ink/70 hover:text-primary-600'
  }`;

const moreLinks = [
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/blog', label: 'Blog' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100/60 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
            <GraduationCap size={20} />
          </span>
          Prep<span className="text-gradient">Deck</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/features" className={navLinkClass}>Features</NavLink>
          <NavLink to="/pricing" className={navLinkClass}>Pricing</NavLink>
          {user && <NavLink to="/dashboard" className={navLinkClass}>Practice</NavLink>}
          <NavLink to="/leaderboard" className={navLinkClass}>Leaderboard</NavLink>

          <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button className="flex items-center gap-1 text-sm font-medium text-ink/70 hover:text-primary-600">
              More <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 top-full w-48 -translate-x-1/2 rounded-xl border border-primary-100 bg-white p-2 shadow-card"
                >
                  {moreLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-ink/70 hover:bg-primary-50 hover:text-primary-600"
                    >
                      {l.label}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <NavLink to="/profile" className="text-sm font-medium text-ink/70 hover:text-primary-600">
                {user.user_metadata?.full_name?.split(' ')[0] || 'Profile'}
              </NavLink>
              <button
                onClick={handleSignOut}
                className="rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink/70 hover:text-primary-600">
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button className="text-ink md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-primary-100 bg-white md:hidden"
          >
            <div className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto px-5 py-5">
              <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClass} end>Home</NavLink>
              <NavLink to="/features" onClick={() => setOpen(false)} className={navLinkClass}>Features</NavLink>
              <NavLink to="/pricing" onClick={() => setOpen(false)} className={navLinkClass}>Pricing</NavLink>
              {user && <NavLink to="/dashboard" onClick={() => setOpen(false)} className={navLinkClass}>Practice</NavLink>}
              {user && <NavLink to="/history" onClick={() => setOpen(false)} className={navLinkClass}>History</NavLink>}
              {user && <NavLink to="/bookmarks" onClick={() => setOpen(false)} className={navLinkClass}>Bookmarks</NavLink>}
              {user && <NavLink to="/achievements" onClick={() => setOpen(false)} className={navLinkClass}>Achievements</NavLink>}
              <NavLink to="/leaderboard" onClick={() => setOpen(false)} className={navLinkClass}>Leaderboard</NavLink>
              {moreLinks.map((l) => (
                <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={navLinkClass}>{l.label}</NavLink>
              ))}
              {user && <NavLink to="/profile" onClick={() => setOpen(false)} className={navLinkClass}>Profile</NavLink>}
              {user && <NavLink to="/settings" onClick={() => setOpen(false)} className={navLinkClass}>Settings</NavLink>}

              <div className="mt-3 border-t border-primary-50 pt-4">
                {user ? (
                  <button onClick={handleSignOut} className="w-full rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow">
                    Sign out
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-primary-200 px-5 py-2.5 text-center text-sm font-semibold text-primary-600">
                      Log in
                    </Link>
                    <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-brand-gradient px-5 py-2.5 text-center text-sm font-semibold text-white shadow-glow">
                      Get started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
