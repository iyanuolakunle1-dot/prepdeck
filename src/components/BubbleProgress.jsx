import { motion } from 'framer-motion';

/**
 * BubbleProgress — the app's signature visual motif.
 * Renders one bubble per question, echoing a paper OMR/scantron sheet.
 * Filled = answered correctly, cross = answered wrong, ring = unanswered,
 * glowing ring = current question.
 */
export default function BubbleProgress({ total, current, answers }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const state = answers[i]; // undefined | 'correct' | 'wrong'
        const isCurrent = i === current;
        let classes =
          'flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-semibold transition-all';

        if (state === 'correct') {
          classes += ' border-success bg-success text-white';
        } else if (state === 'wrong') {
          classes += ' border-danger bg-danger text-white';
        } else if (isCurrent) {
          classes += ' border-primary-500 text-primary-600 shadow-[0_0_0_4px_rgba(79,70,229,0.15)]';
        } else {
          classes += ' border-primary-100 text-muted';
        }

        return (
          <motion.div
            key={i}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.02 }}
            className={classes}
          >
            {i + 1}
          </motion.div>
        );
      })}
    </div>
  );
}
