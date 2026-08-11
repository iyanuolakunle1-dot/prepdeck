import { motion } from 'framer-motion';
import { Target, Users, Sparkles, ShieldCheck } from 'lucide-react';

const values = [
  { icon: Target, title: 'Focused on outcomes', desc: 'Every feature exists to move one number: your exam score. No noise, no distraction.' },
  { icon: Users, title: 'Built for Nigerian students', desc: 'Our subjects and question style follow the JAMB, WAEC and NECO syllabus, not a generic trivia format.' },
  { icon: Sparkles, title: 'Free to start', desc: 'Core practice is free forever. We believe exam prep shouldn\u2019t be locked behind a paywall for everyone.' },
  { icon: ShieldCheck, title: 'Your data is yours', desc: 'Your scores and history are private to your account, protected by row-level security on every table.' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">About PrepDeck</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
          Built by students who sat these exams too
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
          PrepDeck started as a simple question: why does mock exam practice always feel worse than
          the real thing? So we built a CBT platform that actually feels like exam day — timed,
          focused, and honest about how you're doing.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
              <v.icon size={20} />
            </div>
            <h3 className="mb-2 font-display text-lg font-bold text-ink">{v.title}</h3>
            <p className="text-sm text-muted">{v.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 rounded-3xl bg-brand-gradient-soft p-8 sm:p-12"
      >
        <h2 className="font-display text-2xl font-bold text-ink">Our approach</h2>
        <p className="mt-4 text-muted">
          Rather than a generic trivia bank, PrepDeck's subject content follows the actual topics
          examined in Nigerian secondary school certificate and university entrance exams —
          Mathematics, English Language, Physics, Chemistry, Biology, Economics, Government,
          Geography, Literature in English, Commerce, Accounting, Christian Religious Studies and
          Agricultural Science, with more subjects added regularly. Every mock test is timed to build
          the pace you'll need on the real exam day, and every attempt is saved so you can watch your
          accuracy improve week over week.
        </p>
      </motion.div>
    </div>
  );
}
