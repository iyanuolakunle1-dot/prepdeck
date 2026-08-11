import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { testimonials } from '../data/testimonials';

export default function Testimonials() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Testimonials</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">What students are saying</h1>
      </motion.div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card"
          >
            <Quote className="mb-3 text-primary-300" size={24} />
            <p className="text-sm text-ink/80">{t.quote}</p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-ink">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    className={idx < t.rating ? 'fill-accent-400 text-accent-400' : 'text-primary-100'}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
