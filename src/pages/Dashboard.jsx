import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, CheckCircle2, Trophy, Flame, ArrowRight,
  GraduationCap, Landmark, FileText, Monitor,
} from 'lucide-react';
import { supabase, notifySupabaseError } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { exams } from '../data/exams';
import Loader from '../components/Loader';

const quotes = [
  { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: 'Well begun is half done.', author: 'Aristotle' },
  { text: 'It always seems impossible until it\u2019s done.', author: 'Nelson Mandela' },
];

const examIcons = { jamb: GraduationCap, waec: Landmark, neco: FileText, 'post-utme': Monitor };

function getStreak(dates) {
  const daySet = new Set(dates.map((d) => new Date(d).toDateString()));
  let streak = 0;
  const cursor = new Date();
  while (daySet.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function getWeekActivity(dates) {
  const daySet = new Set(dates.map((d) => new Date(d).toDateString()));
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label: d.toLocaleDateString('en-GB', { weekday: 'short' })[0] + d.toLocaleDateString('en-GB', { weekday: 'short' }).slice(1, 3),
      active: daySet.has(d.toDateString()),
      isToday: d.toDateString() === today.toDateString(),
      isFuture: d > today,
    };
  });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          notifySupabaseError(error, 'load your dashboard stats');
          setLoading(false);
          return;
        }
        setAttempts(data || []);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <Loader />;

  const totalQuestions = attempts.reduce((s, a) => s + a.total_questions, 0);
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + (a.score / a.total_questions) * 100, 0) / attempts.length)
    : 0;
  const streak = getStreak(attempts.map((a) => a.created_at));
  const week = getWeekActivity(attempts.map((a) => a.created_at));
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  const stats = [
    { icon: BookOpen, label: 'Questions practiced', value: totalQuestions, color: 'bg-primary-50 text-primary-600' },
    { icon: CheckCircle2, label: 'Tests taken', value: attempts.length, color: 'bg-success/10 text-success' },
    { icon: Trophy, label: 'Average score', value: `${avgScore}%`, color: 'bg-gold-500/10 text-gold-600' },
    { icon: Flame, label: 'Current streak', value: `${streak} days`, color: 'bg-danger/10 text-danger' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-ink">Hi, {firstName}! 👋</h1>
        <p className="mt-1 text-muted">Let's practice and achieve excellence today.</p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card"
          >
            <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon size={18} />
            </span>
            <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col justify-between rounded-2xl bg-brand-gradient p-8 text-white shadow-glow lg:col-span-2"
        >
          <div>
            <h2 className="font-display text-2xl font-bold">Welcome to PrepDeck!</h2>
            <p className="mt-2 max-w-md text-sm text-white/80">
              Practice JAMB, WAEC, NECO and POST-UTME questions, sit mock exams, and track your performance.
            </p>
          </div>
          <Link
            to="/practice"
            className="mt-6 flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-600 transition-transform hover:scale-105"
          >
            Start Practicing <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-1.5 font-display text-sm font-bold text-ink">
              <Flame size={16} className="text-danger" /> Current Streak
            </p>
            <span className="text-sm font-bold text-primary-600">{streak} days</span>
          </div>
          <div className="flex justify-between">
            {week.map((d) => (
              <div key={d.label} className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    d.active
                      ? 'bg-success text-white'
                      : d.isToday
                      ? 'border-2 border-primary-400 text-primary-500'
                      : 'bg-primary-50 text-primary-200'
                  }`}
                >
                  {d.active && <CheckCircle2 size={14} />}
                </span>
                <span className="text-[10px] text-muted">{d.label}</span>
              </div>
            ))}
          </div>
          <blockquote className="mt-5 border-l-2 border-primary-200 pl-3 text-xs italic text-muted">
            "{quote.text}"
            <footer className="mt-1 not-italic text-primary-600">— {quote.author}</footer>
          </blockquote>
        </motion.div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">Practice by exam type</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {exams.map((e, i) => {
            const Icon = examIcons[e.slug];
            return (
              <motion.div
                key={e.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card"
              >
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon size={18} />
                </span>
                <h3 className="font-display text-sm font-bold text-ink">{e.name}</h3>
                <p className="mt-1 text-xs text-muted">{e.description}</p>
                <Link to="/practice" className="mt-3 flex items-center gap-1 text-xs font-bold text-primary-600">
                  Start Practice <ArrowRight size={12} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Recent activity</h2>
          <Link to="/history" className="text-sm font-semibold text-primary-600">View all</Link>
        </div>
        {attempts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-10 text-center">
            <p className="text-sm text-muted">No activity yet — sit your first practice test to see it here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.slice(0, 5).map((a) => {
              const pct = Math.round((a.score / a.total_questions) * 100);
              return (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-primary-100 bg-white p-4 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
                      <CheckCircle2 size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">You completed a {a.category} quiz</p>
                      <p className="text-xs text-muted">{new Date(a.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary-600">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
