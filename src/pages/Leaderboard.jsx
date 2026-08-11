import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Loader from '../components/Loader';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('quiz_attempts')
      .select('id, score, total_questions, category, difficulty, profiles(full_name)')
      .order('score', { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (error) throw error;
        const ranked = (data || [])
          .map((row) => ({
            id: row.id,
            score: row.score,
            total_questions: row.total_questions,
            category: row.category,
            difficulty: row.difficulty,
            full_name: row.profiles?.full_name,
          }))
          .sort((a, b) => b.score / b.total_questions - a.score / a.total_questions)
          .slice(0, 20);
        setRows(ranked);
      })
      .catch(() => setError('Could not load the leaderboard right now.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow">
          <Crown size={26} />
        </span>
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Top scorers</h1>
        <p className="mt-2 text-muted">Best single-attempt accuracy across every PrepDeck user.</p>
      </motion.div>

      <div className="mt-10">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="rounded-lg bg-danger/10 px-4 py-3 text-center text-sm text-danger">{error}</div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-12 text-center">
            <p className="text-sm text-muted">No attempts recorded yet — be the first to set a score!</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card">
            {rows.map((r, i) => {
              const pct = Math.round((r.score / r.total_questions) * 100);
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center justify-between gap-4 px-6 py-4 ${
                    i !== rows.length - 1 ? 'border-b border-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        i === 0
                          ? 'bg-amber-100 text-amber-600'
                          : i === 1
                          ? 'bg-slate-100 text-slate-500'
                          : i === 2
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-primary-50 text-primary-600'
                      }`}
                    >
                      {i < 3 ? <Medal size={16} /> : i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{r.full_name || 'Anonymous'}</p>
                      <p className="text-xs capitalize text-muted">{r.category} · {r.difficulty}</p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-bold text-primary-600">{pct}%</span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
