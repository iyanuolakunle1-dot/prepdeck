import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-7xl font-bold text-gradient"
      >
        404
      </motion.h1>
      <p className="mt-4 text-lg font-semibold text-ink">This question doesn't exist</p>
      <p className="mt-1 text-sm text-muted">The page you're looking for wandered off the answer sheet.</p>
      <Link
        to="/"
        className="mt-6 flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow"
      >
        <Home size={16} /> Back home
      </Link>
    </div>
  );
}
