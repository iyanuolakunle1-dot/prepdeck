import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap, Bell, ChevronDown, LogOut, Crown, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { sidebarNav } from '../data/sidebarNav';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  async function handleLogout() {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';
  const fullName = user?.user_metadata?.full_name || 'Student';

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <NavLink to="/dashboard" className="flex items-center gap-2 px-6 py-6 font-display text-lg font-bold text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
          <GraduationCap size={20} />
        </span>
        Prep<span className="text-gold-400">Deck</span>
      </NavLink>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4">
        {sidebarNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-gradient text-white shadow-glow' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={() => setConfirmLogout(true)}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gold-400 transition-colors hover:bg-white/5"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div className="m-4 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 p-5 text-ink">
        <div className="mb-2 flex items-center gap-2 font-display text-sm font-bold">
          <Crown size={16} /> Go Premium
        </div>
        <p className="mb-4 text-xs text-ink/70">Unlock all subjects, unlimited mock exams and more.</p>
        <NavLink
          to="/pricing"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-ink py-2.5 text-xs font-bold text-white"
        >
          Upgrade Now
        </NavLink>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-sidebar lg:block">
        <div className="fixed h-screen w-64 bg-sidebar">{SidebarContent}</div>
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar lg:hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-primary-100/60 bg-white/90 px-5 py-3.5 backdrop-blur-md md:px-8">
          <button className="text-ink lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 rounded-full bg-primary-50 p-1 text-primary-600"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${theme === 'light' ? 'bg-white shadow-sm' : 'text-primary-300'}`}>
                <Sun size={13} />
              </span>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${theme === 'dark' ? 'bg-ink text-white shadow-sm' : 'text-primary-300'}`}>
                <Moon size={13} />
              </span>
            </button>

            <button className="relative text-ink/70 hover:text-primary-600" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                  {firstName[0]?.toUpperCase()}
                </span>
                <span className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-tight text-ink">{fullName}</p>
                  <p className="text-xs leading-tight text-muted">Student</p>
                </span>
                <ChevronDown size={14} className="hidden text-muted sm:block" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-primary-100 bg-white p-2 shadow-card"
                  >
                    <NavLink
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-ink/70 hover:bg-primary-50 hover:text-primary-600"
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-ink/70 hover:bg-primary-50 hover:text-primary-600"
                    >
                      Settings
                    </NavLink>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setConfirmLogout(true);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-danger hover:bg-danger/10"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {confirmLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl"
            >
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <LogOut size={24} />
              </span>
              <h3 className="font-display text-lg font-bold text-ink">Are you sure you want to logout?</h3>
              <p className="mt-1 text-sm text-muted">You can always log back in anytime. Your progress is saved.</p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 rounded-xl border border-primary-100 py-2.5 text-sm font-semibold text-ink/70"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-brand-gradient py-2.5 text-sm font-semibold text-white shadow-glow"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
