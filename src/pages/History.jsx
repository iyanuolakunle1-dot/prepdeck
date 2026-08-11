import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { History as HistoryIcon, Calendar, Target, Clock } from 'lucide-react';
import { supabase, notifySupabaseError } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function History() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          notifySupabaseError(error, 'load your history');
        } else {
          setAttempts(data);
        }
        setLoading(false);
      });
  }, [user]);

  if (loading) return <Loader label="Loading your history…" />;

  const chartData = [...attempts]
    .reverse()
    .map((a, i) => ({
      name: `#${i + 1}`,
      score: Math.round((a.score / a.total_questions) * 100),
    }));

  const avg =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, a) => acc + (a.score / a.total_questions) * 100, 0) / attempts.length)
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Your progress</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Practice history</h1>
        <p className="mt-2 text-muted">Every mock test you've sat, and how your accuracy is trending.</p>
      </motion.div>

      {error && <div className="mt-6 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}

      {attempts.length === 0 && !error ? (
        <div className="mt-10 rounded-2xl border border-dashed border-primary-200 bg-white p-12 text-center">
          <HistoryIcon className="mx-auto mb-4 text-primary-300" size={40} />
          <h3 className="font-display text-lg font-bold text-ink">No attempts yet</h3>
          <p className="mt-1 text-sm text-muted">Sit your first mock test and it'll show up here.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
              <p className="text-xs font-semibold uppercase text-muted">Attempts</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{attempts.length}</p>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
              <p className="text-xs font-semibold uppercase text-muted">Average score</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{avg}%</p>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
              <p className="text-xs font-semibold uppercase text-muted">Best score</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">
                {Math.max(...attempts.map((a) => Math.round((a.score / a.total_questions) * 100)))}%
              </p>
            </div>
          </div>

          {chartData.length > 1 && (
            <div className="mt-8 rounded-2xl border border-primary-100 bg-white p-6 shadow-card">
              <h3 className="mb-4 font-display text-sm font-bold text-ink">Accuracy trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF0FF" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} dot={{ fill: '#06B6D4', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-8 space-y-3">
            {attempts.map((a, i) => {
              const pct = Math.round((a.score / a.total_questions) * 100);
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary-100 bg-white p-5 shadow-card"
                >
                  <div>
                    <p className="font-display text-sm font-bold capitalize text-ink">
                      {a.category} · {a.difficulty}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(a.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {a.time_taken_seconds}s
                      </span>
                      <span className="flex items-center gap-1">
                        <Target size={12} /> {a.score}/{a.total_questions}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                      pct >= 80
                        ? 'bg-success/10 text-success'
                        : pct >= 50
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {pct}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
