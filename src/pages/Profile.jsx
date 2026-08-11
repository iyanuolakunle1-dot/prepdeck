import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // 'ok' | 'error'
  const [stats, setStats] = useState({ attempts: 0, avg: 0 });

  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setFullName(profile?.full_name || user.user_metadata?.full_name || '');

      const { data: attempts } = await supabase.from('quiz_attempts').select('score,total_questions').eq('user_id', user.id);
      if (attempts && attempts.length > 0) {
        const avg = Math.round(
          attempts.reduce((acc, a) => acc + (a.score / a.total_questions) * 100, 0) / attempts.length
        );
        setStats({ attempts: attempts.length, avg });
      }
      setLoading(false);
    }
    load();
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
      });
      if (error) throw error;
      await supabase.auth.updateUser({ data: { full_name: fullName } });
      setStatus('ok');
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Account</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Your profile</h1>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase text-muted">Total attempts</p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">{stats.attempts}</p>
        </div>
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase text-muted">Average accuracy</p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">{stats.avg}%</p>
        </div>
      </div>

      <motion.form
        onSubmit={handleSave}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 rounded-2xl border border-primary-100 bg-white p-7 shadow-card"
      >
        {status === 'ok' && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
            <CheckCircle2 size={16} /> Profile updated.
          </div>
        )}
        {status === 'error' && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle size={16} /> Could not save changes. Try again.
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-ink/80">Full name</label>
          <div className="flex items-center gap-2 rounded-xl border border-primary-100 px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
            <User size={17} className="text-muted" />
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border-none bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-ink/80">Email</label>
          <div className="flex items-center gap-2 rounded-xl border border-primary-50 bg-surface px-3.5 py-2.5">
            <Mail size={17} className="text-muted" />
            <span className="text-sm text-muted">{user.email}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
        </button>
      </motion.form>
    </div>
  );
}
