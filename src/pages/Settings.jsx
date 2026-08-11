import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Lock, Palette, Trash2, CheckCircle2,
  AlertCircle, Moon, Sun, Calendar, Sparkles, Eye,
  EyeOff, Shield, Mail, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { deleteAccount } from '../lib/api';
import Loader from '../components/Loader';

export default function Settings() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [emailReminders, setEmailReminders] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);
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
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id);
      await supabase.auth.updateUser({ data: { full_name: fullName } });
      setProfileSaved(true);
      toast.success('Profile updated successfully');
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      toast.error('Could not save profile');
    } finally {
      setSavingProfile(false);
    }
  }

  async function toggleReminders() {
    const next = !emailReminders;
    setEmailReminders(next);
    await supabase.from('profiles').update({ settings: { email_reminders: next } }).eq('id', user.id);
    toast.success(next ? 'Reminders enabled' : 'Reminders disabled');
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordStatus('error');
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    setPasswordStatus(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordStatus('ok');
      setNewPassword('');
      toast.success('Password updated successfully');
    } catch {
      setPasswordStatus('error');
      toast.error('Could not update password');
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteAccount(user.id);
      await signOut();
      toast.success('Account permanently deleted');
      navigate('/');
    } catch {
      setDeleting(false);
      toast.error('Could not delete account. Please try again.');
    }
  }

  if (loading) return <Loader />;

  const displayInitial = (fullName || user?.email || 'S')[0]?.toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 md:py-10">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Settings</h1>
        <p className="mt-1 text-xs text-muted sm:text-sm">Manage your profile, security, and learning preferences.</p>
      </motion.div>

      <div className="space-y-6">
        {/* 1. Account Summary Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-xl font-bold text-white shadow-glow">
                {displayInitial}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-ink sm:text-lg truncate">{fullName || 'Student'}</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-bold text-primary-600">
                    <Sparkles size={11} /> Free Plan
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted truncate flex items-center gap-1.5">
                  <Mail size={12} className="shrink-0" /> {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t border-primary-50 pt-3 sm:border-t-0 sm:pt-0 text-xs">
              <div>
                <p className="text-muted">Tests Taken</p>
                <p className="font-display text-base font-bold text-ink">{stats.attempts}</p>
              </div>
              <div>
                <p className="text-muted">Joined</p>
                <p className="font-display text-base font-bold text-ink">
                  {new Date(user.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Personal Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card sm:p-6"
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 shrink-0">
              <User size={17} />
            </span>
            <div>
              <h3 className="font-display text-sm font-bold text-ink sm:text-base">Personal Information</h3>
              <p className="text-xs text-muted">Update your display name and contact details.</p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink/80 sm:text-sm">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-primary-100 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink/80 sm:text-sm">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full rounded-xl border border-primary-50 bg-primary-50/40 px-3.5 py-2.5 text-sm text-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full sm:w-auto rounded-xl bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {savingProfile ? 'Saving…' : 'Save Changes'}
              </button>

              {profileSaved && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
                  <Check size={14} /> Changes saved
                </span>
              )}
            </div>
          </form>
        </motion.div>

        {/* 3. Password & Security Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card sm:p-6"
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 shrink-0">
              <Lock size={17} />
            </span>
            <div>
              <h3 className="font-display text-sm font-bold text-ink sm:text-base">Password & Security</h3>
              <p className="text-xs text-muted">Change your account password regularly.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
            {passwordStatus === 'error' && (
              <div className="flex items-center gap-2 rounded-xl bg-danger/10 px-4 py-3 text-xs sm:text-sm text-danger">
                <AlertCircle size={16} className="shrink-0" /> Password must be at least 6 characters.
              </div>
            )}
            {passwordStatus === 'ok' && (
              <div className="flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-xs sm:text-sm text-success">
                <CheckCircle2 size={16} className="shrink-0" /> Password updated successfully.
              </div>
            )}

            <div className="max-w-md">
              <label className="mb-1.5 block text-xs font-semibold text-ink/80 sm:text-sm">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full rounded-xl border border-primary-100 bg-white pl-3.5 pr-10 py-2.5 text-sm text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword || !newPassword}
                className="w-full sm:w-auto rounded-xl bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingPassword ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* 4. Preferences & Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card sm:p-6"
        >
          <h3 className="font-display text-sm font-bold text-ink sm:text-base mb-4">App Preferences</h3>

          <div className="divide-y divide-primary-50">
            {/* Practice Reminders Row */}
            <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
              <div className="flex items-center gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Bell size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">Study Reminders</p>
                  <p className="text-xs text-muted">Receive email reminders to practice and maintain streaks.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleReminders}
                className={`h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none ${
                  emailReminders ? 'bg-brand-gradient' : 'bg-primary-100'
                }`}
                aria-label="Toggle study reminders"
              >
                <span
                  className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${
                    emailReminders ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode Row */}
            <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
              <div className="flex items-center gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">Appearance</p>
                  <p className="text-xs text-muted">Toggle between Dark and Light mode theme.</p>
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
        </motion.div>

        {/* 5. Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-danger/30 bg-danger/5 p-5 sm:p-6"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-danger/15 text-danger shrink-0">
              <Trash2 size={16} />
            </span>
            <div>
              <h3 className="font-display text-sm font-bold text-danger sm:text-base">Danger Zone</h3>
              <p className="text-xs text-danger/80">Permanent, irreversible account actions.</p>
            </div>
          </div>

          <p className="mt-3 mb-5 text-xs sm:text-sm text-danger/80 leading-relaxed">
            Deleting your account will permanently wipe out all test history, accuracy records, and saved bookmarks from our database.
          </p>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full sm:w-auto rounded-xl border border-danger bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-danger transition hover:bg-danger hover:text-white"
            >
              Delete My Account
            </button>
          ) : (
            <div className="rounded-xl border border-danger/20 bg-white p-4 space-y-3">
              <p className="text-xs font-bold text-danger">Are you completely sure? This cannot be undone.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto rounded-xl bg-danger px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-danger/90 disabled:opacity-60"
                >
                  {deleting ? 'Deleting…' : 'Yes, Delete Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="w-full sm:w-auto rounded-xl border border-primary-100 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink/70 hover:bg-primary-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
