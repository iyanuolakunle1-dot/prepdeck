import { motion } from 'framer-motion';

export default function LegalLayout({ title, updated, children }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
      </motion.div>
      <div className="prose prose-sm mt-10 max-w-none space-y-6 text-sm leading-relaxed text-ink/80">
        {children}
      </div>
    </div>
  );
}
