import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Timer, Layers, TrendingUp, ShieldCheck, ArrowRight, CheckCircle2,
  Star, Quote, Mail, BookOpen, Target, Zap,
} from 'lucide-react';
import BubbleProgress from '../components/BubbleProgress';
import { exams } from '../data/exams';
import { testimonials } from '../data/testimonials';
import { posts } from '../data/blogPosts';
import { faqs } from '../data/faqs';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const stats = [
  { icon: Layers, value: '13', label: 'Nigerian subjects' },
  { icon: Target, value: '4', label: 'Exams covered' },
  { icon: Zap, value: '₦0', label: 'Cost to start' },
  { icon: Timer, value: '100%', label: 'Timed like the real thing' },
];

const features = [
  { icon: Layers, title: 'Every subject, endless questions', desc: 'Mathematics, English, Physics, Chemistry, Biology and 8 more, written to match the JAMB/WAEC/NECO syllabus.' },
  { icon: Timer, title: 'Real exam pressure', desc: 'A live countdown timer and instant answer locking simulate the feel of an actual computer-based test.' },
  { icon: TrendingUp, title: 'Track every attempt', desc: 'Every quiz you sit is saved to your account so you can watch your accuracy climb over time.' },
  { icon: ShieldCheck, title: 'Built to last', desc: 'Secure Supabase auth, row-level security on your data, and a clean review screen after every test.' },
];

const steps = [
  { title: 'Pick a category', desc: 'Choose a subject, difficulty, and how many questions you want to face.' },
  { title: 'Sit the test', desc: 'Answer against the clock. Your scantron sheet fills in live as you go.' },
  { title: 'Review & improve', desc: 'See exactly what you got right or wrong, then try again to beat your score.' },
];

export default function Landing() {
  const demoAnswers = { 0: 'correct', 1: 'correct', 2: 'wrong', 3: 'correct' };
  const [email, setEmail] = useState('');

  function handleNewsletter(e) {
    e.preventDefault();
    toast.success('Subscribed! We\'ll email you new subjects and study tips.');
    setEmail('');
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-radial">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-500/30 blur-3xl animate-floatSlow" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent-500/30 blur-3xl animate-floatSlow" style={{ animationDelay: '2s' }} />
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-5 py-16 md:flex-row md:px-8 md:py-28">
          <motion.div initial="hidden" animate="show" className="max-w-xl text-center md:text-left">
            <motion.span
              custom={0}
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80 backdrop-blur"
            >
              <CheckCircle2 size={14} /> Free practice, unlimited questions
            </motion.span>

            <motion.h1 custom={1} variants={fadeUp} className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Train for exam day like it's <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">already here</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="mt-6 text-lg text-white/70">
              PrepDeck is a CBT-style practice app for JAMB, WAEC, NECO and POST-UTME. Practice
              real exam-style questions across 13 Nigerian school subjects, timed like the real
              thing, with every attempt saved so you always know where you stand.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
              >
                Start practicing free
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                I already have an account
              </Link>
            </motion.div>

            <motion.div custom={4} variants={fadeUp} className="mt-8 flex items-center justify-center gap-2 text-xs text-white/50 md:justify-start">
              <ShieldCheck size={14} /> No card required · Free forever core plan
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-ink">Mathematics · JAMB</span>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">00:42</span>
            </div>
            <p className="mb-4 text-sm font-medium text-ink/80">
              Find the area of a circle with radius 7cm. (Use π = 22/7)
            </p>
            <div className="mb-5 space-y-2">
              {['44 cm²', '154 cm²', '22 cm²', '308 cm²'].map((opt, i) => (
                <div
                  key={opt}
                  className={`rounded-lg border px-4 py-2.5 text-sm ${
                    i === 1 ? 'border-success bg-success/10 font-semibold text-success' : 'border-primary-100 text-ink/70'
                  }`}
                >
                  {opt}
                </div>
              ))}
            </div>
            <BubbleProgress total={4} current={3} answers={demoAnswers} />
          </motion.div>
        </div>

        {/* Honest stats bar */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4 md:px-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
                  <s.icon size={16} />
                </div>
                <p className="font-display text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/60">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Exams */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Built for every major Nigerian exam</h2>
          <p className="mt-4 text-muted">Choose your exam, and PrepDeck frames your practice around it.</p>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {exams.map((e, i) => (
            <motion.div
              key={e.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl bg-gradient-to-br ${e.color} p-6 text-white shadow-glow transition-transform hover:-translate-y-1`}
            >
              <h3 className="font-display text-lg font-bold">{e.name}</h3>
              <p className="mt-2 text-sm text-white/80">{e.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="bg-brand-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">13 subjects, real syllabus content</h2>
            <p className="mt-4 text-muted">No generic trivia — every question is written to match what's actually examined.</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'Geography', 'Literature in English', 'Commerce', 'Accounting', 'Christian Religious Studies', 'Agricultural Science'].map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-ink/80 shadow-sm"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Everything a mock exam needs</h2>
          <p className="mt-4 text-muted">No fluff, no coming-soon pages — every part of PrepDeck works today.</p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card transition-shadow hover:shadow-glow"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <f.icon size={20} />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-ink">{f.title}</h3>
              <p className="text-sm text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center font-display text-3xl font-bold text-ink sm:text-4xl">
            Three steps to your next mock test
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative rounded-2xl bg-white p-7 shadow-card"
              >
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient font-display text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mb-2 font-display text-lg font-bold text-ink">{s.title}</h3>
                <p className="text-sm text-muted">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials preview */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">What students are saying</h2>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card"
            >
              <Quote className="mb-3 text-primary-300" size={22} />
              <p className="text-sm text-ink/80">{t.quote}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-ink">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={13} className={idx < t.rating ? 'fill-gold-400 text-gold-400' : 'text-primary-100'} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/testimonials" className="text-sm font-semibold text-primary-600">See all testimonials →</Link>
        </div>
      </section>

      {/* Blog preview */}
      <section className="bg-brand-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Study tips & exam guides</h2>
            <p className="mt-4 text-muted">Practical advice for JAMB, WAEC, NECO and POST-UTME candidates.</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={`/blog/${p.slug}`} className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-glow">
                  <span className="mb-3 w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">{p.category}</span>
                  <h3 className="mb-2 font-display text-base font-bold text-ink">{p.title}</h3>
                  <p className="flex-1 text-sm text-muted">{p.excerpt}</p>
                  <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary-600">
                    Read <ArrowRight size={12} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="mx-auto max-w-3xl px-5 py-20 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Common questions</h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.slice(0, 4).map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-primary-100 bg-white p-5 shadow-card"
            >
              <p className="font-display text-sm font-bold text-ink">{f.q}</p>
              <p className="mt-1.5 text-sm text-muted">{f.a}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/faq" className="text-sm font-semibold text-primary-600">View full FAQ →</Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-4xl px-5 pb-20 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6 rounded-3xl border border-primary-100 bg-white p-8 text-center shadow-card sm:flex-row sm:text-left"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Mail size={22} />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-ink">Get study tips in your inbox</h3>
            <p className="mt-1 text-sm text-muted">New subjects, exam guides, and reminders — no spam.</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex w-full gap-2 sm:w-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full border border-primary-100 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 sm:w-56"
            />
            <button type="submit" className="shrink-0 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow">
              Subscribe
            </button>
          </form>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-5 pb-20 text-center md:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-3xl bg-brand-gradient px-8 py-14 shadow-glow">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Ready to sit your first mock?</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">Create a free account and get a fresh set of questions in seconds.</p>
          <Link
            to="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary-600 shadow-lg transition-transform hover:scale-105"
          >
            Create free account <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
