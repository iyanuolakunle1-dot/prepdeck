import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const data = await signUp(email, password, fullName);
      if (data.session) {
        toast.success('Account created!');
        navigate('/dashboard');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Could not create your account. Try again.');
      toast.error('Could not create account');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center bg-brand-gradient-soft px-5 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-card"
        >
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 size={28} />
          </span>
          <h1 className="font-display text-2xl font-bold text-ink">Check your inbox</h1>
          <p className="mt-2 text-sm text-muted">
            We sent a confirmation link to <strong>{email}</strong>. Confirm your email, then log in to start practicing.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block w-full rounded-xl bg-brand-gradient py-3 text-sm font-semibold text-white shadow-glow"
          >
            Go to login
          </Link>
        </motion.div>
      </div>
    );
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
          <h1 className="font-display text-2xl font-bold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-muted">Free forever. Unlimited practice questions.</p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Full name</label>
            <div className="flex items-center gap-2 rounded-xl border border-primary-100 px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
              <User size={17} className="text-muted" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full border-none bg-transparent text-sm outline-none"
              />
            </div>
          </div>

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
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-primary-100 px-3.5 py-2.5 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
              <Lock size={17} className="text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full border-none bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-brand-gradient py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
