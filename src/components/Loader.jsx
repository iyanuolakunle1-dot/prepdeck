import { motion } from 'framer-motion';

export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="h-12 w-12 rounded-full border-4 border-primary-100 border-t-primary-500"
      />
      <p className="text-sm font-medium text-muted">{label}</p>
    </div>
  );
}
