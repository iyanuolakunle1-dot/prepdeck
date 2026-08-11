import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, GraduationCap, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Could not log in. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!email) {
      setError('Enter your email above first, then tap "Forgot password".');
      return;
    }
    try {
      await resetPassword(email);
      setInfo('Password reset email sent — check your inbox.');
      toast.success('Password reset email sent');
      setError('');
    } catch (err) {
      setError(err.message);
      toast.error('Could not send reset email');
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-brand-gradient-soft px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
            <GraduationCap size={24} />
          </span>
          <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Log in to pick up your practice where you left off.</p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}
        {info && (
          <div className="mb-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">{info}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-primary-100 px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
              <Mail size={17} className="text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-none bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm font-medium text-ink/80">Password</label>
              <button type="button" onClick={handleReset} className="text-xs font-medium text-primary-600 hover:underline">
                Forgot password?
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-primary-100 px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
              <Lock size={17} className="text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-none bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-brand-gradient py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          New to PrepDeck?{' '}
          <Link to="/signup" className="font-semibold text-primary-600 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
