import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../data/faqs';

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">FAQ</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">Frequently asked questions</h1>
      </motion.div>

      <div className="mt-12 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card"
            >
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              >
                <span className="font-display text-sm font-bold text-ink sm:text-base">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-primary-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-sm text-muted">{f.a}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
