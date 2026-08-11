import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarClock, Clock, Layers, Target, TrendingUp, PlayCircle } from 'lucide-react';
import { mockExams } from '../data/mockExams';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const examFilters = ['All', 'JAMB', 'WAEC', 'NECO', 'POST-UTME'];

export default function MockExams() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('quiz_attempts')
      .select('score,total_questions,category')
      .eq('user_id', user.id)
      .then(({ data }) => setAttempts(data || []));
  }, [user]);

  const filtered = mockExams.filter((m) => filter === 'All' || m.examLabel === filter);

  const totalTaken = attempts.filter((a) => mockExams.some((m) => m.title === a.category)).length;
  const avgScore = totalTaken
    ? Math.round(
        attempts
          .filter((a) => mockExams.some((m) => m.title === a.category))
          .reduce((s, a) => s + (a.score / a.total_questions) * 100, 0) / totalTaken
      )
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-ink">Mock Exams</h1>
        <p className="mt-1 text-muted">Simulate the real multi-subject exam experience, timed and scored.</p>
      </motion.div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><CalendarClock size={16} /></span>
          <p className="font-display text-xl font-bold text-ink">{mockExams.length}</p>
          <p className="text-xs text-muted">Mock exams available</p>
        </div>
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success"><Target size={16} /></span>
          <p className="font-display text-xl font-bold text-ink">{totalTaken}</p>
          <p className="text-xs text-muted">Mock exams taken</p>
        </div>
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-600"><TrendingUp size={16} /></span>
          <p className="font-display text-xl font-bold text-ink">{avgScore}%</p>
          <p className="text-xs text-muted">Average mock score</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {examFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === f ? 'bg-brand-gradient text-white shadow-glow' : 'border border-primary-100 text-ink/70'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((m, i) => {
          const totalQ = m.subjects.length * m.amountPerSubject;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary-100 bg-white p-5 shadow-card"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                  <CalendarClock size={18} />
                </span>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary-600">{m.examLabel}</p>
                  <h3 className="font-display text-base font-bold text-ink">{m.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1"><Layers size={12} /> {m.subjects.length} subjects</span>
                    <span className="flex items-center gap-1"><Target size={12} /> {totalQ} questions</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {m.durationMinutes} min</span>
                  </div>
                </div>
              </div>
              <Link
                to={`/quiz?mock=${m.id}`}
                className="flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
              >
                <PlayCircle size={16} /> Start Exam
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
