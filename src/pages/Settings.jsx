import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Lock, Palette, ShieldCheck, Trash2,
  CheckCircle2, AlertCircle, Moon, Calendar, Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { deleteAccount } from '../lib/api';
import Loader from '../components/Loader';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function Settings() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [tab, setTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [emailReminders, setEmailReminders] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({ attempts: 0 });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('profiles').select('settings,full_name').eq('id', user.id).single(),
      supabase.from('quiz_attempts').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]).then(([profileRes, countRes]) => {
      setFullName(profileRes.data?.full_name || user.user_metadata?.full_name || '');
      setEmailReminders(profileRes.data?.settings?.email_reminders ?? true);
      setStats({ attempts: countRes.count || 0 });
      setLoading(false);
    });
  }, [user]);

  async function saveProfile(e) {
    e.preventDefault();
    setStatus(null);
    try {
      await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id);
      await supabase.auth.updateUser({ data: { full_name: fullName } });
      setStatus('ok');
      toast.success('Profile updated');
    } catch {
      setStatus('error');
      toast.error('Could not save profile');
    }
  }

  async function toggleReminders() {
    const next = !emailReminders;
    setEmailReminders(next);
    await supabase.from('profiles').update({ settings: { email_reminders: next } }).eq('id', user.id);
    toast.success(next ? 'Reminders turned on' : 'Reminders turned off');
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setStatus(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setStatus('ok');
      setNewPassword('');
      toast.success('Password updated');
    } catch {
      setStatus('error');
      toast.error('Could not update password');
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteAccount(user.id);
      await signOut();
      toast.success('Account deleted');
      navigate('/');
    } catch {
      setDeleting(false);
      toast.error('Could not delete account. Please try again or contact support.');
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Settings</h1>
        <p className="mt-1 text-xs text-muted sm:text-sm">Manage your account preferences and security.</p>
      </motion.div>

      {/* Responsive Horizontal Tabs */}
      <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto border-b border-primary-100 pb-px scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-3 text-xs sm:text-sm font-semibold transition-all ${
              tab === t.id
                ? 'border-primary-600 text-primary-600 font-bold'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <t.icon size={16} className="shrink-0" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,320px]">
        {/* Main Content Area */}
        <div className="space-y-6">
          {tab === 'account' && (
            <div className="space-y-6">
              <form onSubmit={saveProfile} className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card sm:p-6">
                <div className="flex items-center gap-2.5 mb-1">
                  <User size={18} className="text-primary-600 shrink-0" />
                  <h3 className="font-display text-sm font-bold text-ink sm:text-base">Profile Information</h3>
                </div>
                <p className="mb-5 text-xs text-muted">Update your public display name and account details.</p>

                {status === 'ok' && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-xs sm:text-sm text-success">
                    <CheckCircle2 size={16} className="shrink-0" /> Changes saved successfully.
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink/80 sm:text-sm">Full Name</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-primary-100 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink/80 sm:text-sm">Email Address</label>
                    <input
                      disabled
                      value={user.email}
                      className="w-full rounded-xl border border-primary-50 bg-primary-50/40 px-3.5 py-2.5 text-sm text-muted cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="submit"
                    className="w-full sm:w-auto rounded-xl bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
                  >
                    Save changes
                  </button>
                </div>
              </form>

              <form onSubmit={handlePasswordChange} className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card sm:p-6">
                <div className="flex items-center gap-2.5 mb-1">
                  <Lock size={18} className="text-primary-600 shrink-0" />
                  <h3 className="font-display text-sm font-bold text-ink sm:text-base">Change Password</h3>
                </div>
                <p className="mb-5 text-xs text-muted">Ensure your account is using a secure, strong password.</p>

                {status === 'error' && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-danger/10 px-4 py-3 text-xs sm:text-sm text-danger">
                    <AlertCircle size={16} className="shrink-0" /> Could not update password. Must be at least 6 characters.
                  </div>
                )}

                <div className="max-w-md">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min. 6 characters)"
                    className="w-full rounded-xl border border-primary-100 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto rounded-xl bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Bell size={18} />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-ink sm:text-base">Practice reminders</p>
                    <p className="text-xs text-muted">Get helpful notifications to keep your streak alive.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleReminders}
                  className={`h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none ${
                    emailReminders ? 'bg-brand-gradient' : 'bg-primary-100'
                  }`}
                  aria-label="Toggle practice reminders"
                >
                  <span
                    className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${
                      emailReminders ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                  <Trash2 size={18} />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-danger sm:text-base">Delete Account</p>
                  <p className="text-xs text-danger/80">Permanent action</p>
                </div>
              </div>
              <p className="mb-5 text-xs sm:text-sm text-danger/80 leading-relaxed">
                This will permanently delete your account, practice history, accuracy records, and saved bookmarks. This action cannot be reversed.
              </p>

              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full sm:w-auto rounded-xl border border-danger bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-danger transition hover:bg-danger hover:text-white"
                >
                  Delete my account
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full sm:w-auto rounded-xl bg-danger px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-danger/90 disabled:opacity-60"
                  >
                    {deleting ? 'Deleting…' : 'Yes, permanently delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="w-full sm:w-auto rounded-xl border border-primary-100 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink/70 hover:bg-primary-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'appearance' && (
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Moon size={18} />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-ink sm:text-base">Dark Mode</p>
                    <p className="text-xs text-muted">Switch between light and dark theme across all pages.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    toast.success(theme === 'dark' ? 'Light mode enabled' : 'Dark mode enabled');
                  }}
                  className={`h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none ${
                    theme === 'dark' ? 'bg-brand-gradient' : 'bg-primary-100'
                  }`}
                  aria-label="Toggle dark mode"
                >
                  <span
                    className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account Summary Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
            <p className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-muted">Account Summary</p>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-base font-bold text-white shadow-glow">
                {(fullName || user.email || 'S')[0].toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink truncate">{fullName || 'Student'}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2.5 border-t border-primary-50 pt-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted">
                  <Calendar size={13} className="shrink-0" /> Member since
                </span>
                <span className="font-semibold text-ink">
                  {new Date(user.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Account tier</span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary-600">
                  <Sparkles size={12} /> Free Plan
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Tests taken</span>
                <span className="font-semibold text-ink">{stats.attempts}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 p-5 text-ink shadow-sm">
            <p className="font-display text-sm font-bold">Upgrade to Premium</p>
            <p className="mt-1 text-xs text-ink/80 leading-relaxed">
              Unlock unlimited full-length mock exams, timed multi-subject tests, and AI explanations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
