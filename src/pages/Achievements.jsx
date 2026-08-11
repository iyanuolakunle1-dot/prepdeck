import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

function computeBadges(attempts) {
  const total = attempts.length;
  const best = attempts.length ? Math.max(...attempts.map((a) => (a.score / a.total_questions) * 100)) : 0;
  const subjects = new Set(attempts.map((a) => a.category));
  const perfect = attempts.some((a) => a.score === a.total_questions);

  return [
    { title: 'First Steps', desc: 'Complete your first practice test', unlocked: total >= 1 },
    { title: 'Getting Serious', desc: 'Complete 5 practice tests', unlocked: total >= 5 },
    { title: 'Dedicated Learner', desc: 'Complete 20 practice tests', unlocked: total >= 20 },
    { title: 'Sharp Shooter', desc: 'Score 80% or higher on any test', unlocked: best >= 80 },
    { title: 'Perfectionist', desc: 'Get a perfect score on a test', unlocked: perfect },
    { title: 'Well Rounded', desc: 'Practice at least 3 different subjects', unlocked: subjects.size >= 3 },
    { title: 'Subject Explorer', desc: 'Practice at least 6 different subjects', unlocked: subjects.size >= 6 },
    { title: 'Century Club', desc: 'Answer 100+ questions in total', unlocked: attempts.reduce((s, a) => s + a.total_questions, 0) >= 100 },
  ];
}

export default function Achievements() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('quiz_attempts')
      .select('score,total_questions,category')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setAttempts(data || []);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <Loader />;

  const badges = computeBadges(attempts);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Achievements</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Your badges</h1>
        <p className="mt-2 text-muted">{unlockedCount} of {badges.length} unlocked. Keep practicing to earn more.</p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-2xl border p-5 text-center shadow-card ${
              b.unlocked ? 'border-primary-100 bg-white' : 'border-primary-50 bg-primary-50/40'
            }`}
          >
            <span
              className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${
                b.unlocked ? 'bg-brand-gradient text-white shadow-glow' : 'bg-primary-100 text-primary-300'
              }`}
            >
              {b.unlocked ? <Award size={24} /> : <Lock size={20} />}
            </span>
            <h3 className={`font-display text-sm font-bold ${b.unlocked ? 'text-ink' : 'text-muted'}`}>{b.title}</h3>
            <p className="mt-1 text-xs text-muted">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
