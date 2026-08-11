import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Bell, Lock, Palette, ShieldCheck, Trash2,
  CheckCircle2, AlertCircle, Moon, Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { deleteAccount } from '../lib/api';
import Loader from '../components/Loader';

const tabs = [
  { id: 'account', label: 'Account Settings', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Privacy & Security', icon: ShieldCheck },
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
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-muted">Manage your account and preferences.</p>
      </motion.div>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-primary-100">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === t.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          {tab === 'account' && (
            <>
              <form onSubmit={saveProfile} className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card">
                <h3 className="mb-1 font-display text-sm font-bold text-ink">Profile Information</h3>
                <p className="mb-5 text-xs text-muted">Update your personal information.</p>
                {status === 'ok' && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
                    <CheckCircle2 size={16} /> Saved.
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink/80">Full Name</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-primary-100 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink/80">Email Address</label>
                    <input disabled value={user.email} className="w-full rounded-xl border border-primary-50 bg-surface px-3.5 py-2.5 text-sm text-muted" />
                  </div>
                </div>
                <button type="submit" className="mt-5 rounded-xl bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow">
                  Save changes
                </button>
              </form>

              <form onSubmit={handlePasswordChange} className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card">
                <h3 className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-ink"><Lock size={16} /> Change Password</h3>
                <p className="mb-5 text-xs text-muted">Update your password regularly to keep your account secure.</p>
                {status === 'error' && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
                    <AlertCircle size={16} /> Could not update. Password may be too short.
                  </div>
                )}
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min. 6 characters)"
                  className="mb-4 w-full rounded-xl border border-primary-100 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <button type="submit" className="rounded-xl bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow">
                  Update Password
                </button>
              </form>
            </>
          )}

          {tab === 'notifications' && (
            <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Bell size={18} /></span>
                  <div>
                    <p className="font-display text-sm font-bold text-ink">Practice reminders</p>
                    <p className="text-xs text-muted">Get an occasional nudge to keep your streak going.</p>
                  </div>
                </div>
                <button onClick={toggleReminders} className={`h-6 w-11 rounded-full transition-colors ${emailReminders ? 'bg-brand-gradient' : 'bg-primary-100'}`}>
                  <span className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${emailReminders ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger"><Trash2 size={18} /></span>
                <p className="font-display text-sm font-bold text-danger">Delete account</p>
              </div>
              <p className="mb-4 text-sm text-danger/80">This permanently removes your profile, history and bookmarks. This can't be undone.</p>
              {!confirmDelete ? (
                <button onClick={() => setConfirmDelete(true)} className="rounded-xl border border-danger px-5 py-2.5 text-sm font-semibold text-danger">
                  Delete my account
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={handleDelete} disabled={deleting} className="rounded-xl bg-danger px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                    {deleting ? 'Deleting…' : 'Yes, permanently delete'}
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="rounded-xl border border-primary-100 px-5 py-2.5 text-sm font-semibold text-ink/70">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'appearance' && (
            <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Moon size={18} /></span>
                  <div>
                    <p className="font-display text-sm font-bold text-ink">Dark mode</p>
                    <p className="text-xs text-muted">Switch between light and dark theme across the app.</p>
                  </div>
                </div>
                <button
                  onClick={() => { toggleTheme(); toast.success(theme === 'dark' ? 'Light mode on' : 'Dark mode on'); }}
                  className={`h-6 w-11 rounded-full transition-colors ${theme === 'dark' ? 'bg-brand-gradient' : 'bg-primary-100'}`}
                >
                  <span className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account summary sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
            <p className="mb-3 font-display text-sm font-bold text-ink">Account Summary</p>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                {(fullName || 'S')[0].toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{fullName || 'Student'}</p>
                <p className="text-xs text-muted">Student</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-primary-50 pt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted"><Calendar size={12} /> Member since</span>
                <span className="font-semibold text-ink">{new Date(user.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Account type</span>
                <span className="font-semibold text-ink">Free plan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Total attempts</span>
                <span className="font-semibold text-ink">{stats.attempts}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 p-5 text-ink">
            <p className="font-display text-sm font-bold">Upgrade to Premium</p>
            <p className="mt-1 text-xs text-ink/70">Unlock full mock exams and downloadable results.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
