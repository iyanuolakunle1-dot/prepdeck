import { motion } from 'framer-motion';
import {
  Timer, Layers, TrendingUp, ShieldCheck, Bookmark, Trophy,
  BarChart3, Bell, Award, Target,
} from 'lucide-react';

const features = [
  { icon: Layers, title: '13 Nigerian subjects', desc: 'Mathematics, English, Physics, Chemistry, Biology, Economics, Government, Geography, Literature, Commerce, Accounting, CRS and Agricultural Science.' },
  { icon: Timer, title: 'Real exam timing', desc: 'A live countdown per test simulates real CBT exam pressure, with auto-submit when time runs out.' },
  { icon: Target, title: 'Filter by topic & difficulty', desc: 'Drill into a specific topic like Algebra or Electricity, or set the difficulty to easy, medium or hard.' },
  { icon: BarChart3, title: 'Performance analytics', desc: 'Track your accuracy trend over time, see your best and average scores, and spot weak subjects.' },
  { icon: Bookmark, title: 'Bookmark tough questions', desc: 'Save any question during review to revisit later — build your own personal weak-spot deck.' },
  { icon: Trophy, title: 'Leaderboard', desc: 'See how your best scores stack up against other PrepDeck students, by subject.' },
  { icon: Award, title: 'Achievements', desc: 'Earn badges for streaks, high scores and consistent practice to keep yourself motivated.' },
  { icon: Bell, title: 'Notifications', desc: 'Get reminders to keep your practice streak alive and updates when new subjects are added.' },
  { icon: ShieldCheck, title: 'Secure by default', desc: 'Supabase authentication and row-level security keep your account and history private.' },
  { icon: TrendingUp, title: 'Always improving', desc: 'New subjects, question sets and features ship regularly based on what students ask for.' },
];

export default function Features() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Features</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
          Everything you need to walk in ready
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
          Every feature below is live in the app today — nothing here is "coming soon."
        </p>
      </motion.div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card transition-shadow hover:shadow-glow"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
              <f.icon size={20} />
            </div>
            <h3 className="mb-2 font-display text-base font-bold text-ink">{f.title}</h3>
            <p className="text-sm text-muted">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
