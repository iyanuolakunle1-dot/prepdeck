import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserPlus, GraduationCap, ListChecks, Timer, BarChart3, ArrowRight } from 'lucide-react';

const steps = [
  { icon: UserPlus, title: 'Create your free account', desc: 'Sign up with your email in under a minute. No card required — practice is free.' },
  { icon: GraduationCap, title: 'Pick your exam & subject', desc: 'Choose JAMB, WAEC, NECO or POST-UTME, then pick from 13 Nigerian school subjects.' },
  { icon: ListChecks, title: 'Set your difficulty & length', desc: 'Choose easy, medium or hard, and how many questions — 5 for a quick drill or 20 for a full mock.' },
  { icon: Timer, title: 'Sit the timed test', desc: 'Answer against the clock, just like the real CBT hall. Your scantron sheet fills in as you go.' },
  { icon: BarChart3, title: 'Review & track progress', desc: 'See exactly what you got right or wrong, then watch your accuracy trend improve over time.' },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">How it works</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
          From sign-up to your first mock score in five minutes
        </h1>
      </motion.div>

      <div className="mt-16 space-y-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-5 rounded-2xl border border-primary-100 bg-white p-6 shadow-card"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
                <s.icon size={20} />
              </span>
              {i < steps.length - 1 && <span className="h-full w-px bg-primary-100" />}
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary-600">Step {i + 1}</p>
              <h3 className="mb-1 font-display text-lg font-bold text-ink">{s.title}</h3>
              <p className="text-sm text-muted">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-8 py-3.5 text-sm font-bold text-white shadow-glow transition-transform hover:scale-105"
        >
          Start free <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
