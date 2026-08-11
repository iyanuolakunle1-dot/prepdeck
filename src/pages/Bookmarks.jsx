import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Trash2 } from 'lucide-react';
import { supabase, notifySupabaseError } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function Bookmarks() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) notifySupabaseError(error, 'load your bookmarks');
        setItems(data || []);
        setLoading(false);
      });
  }, [user]);

  async function remove(id) {
    await supabase.from('bookmarks').delete().eq('id', id);
    setItems((prev) => prev.filter((b) => b.id !== id));
  }

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Saved for later</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Your bookmarks</h1>
        <p className="mt-2 text-muted">Questions you've flagged for extra review, from any test's results page.</p>
      </motion.div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-primary-200 bg-white p-12 text-center">
          <Bookmark className="mx-auto mb-4 text-primary-300" size={40} />
          <h3 className="font-display text-lg font-bold text-ink">No bookmarks yet</h3>
          <p className="mt-1 text-sm text-muted">
            After a test, tap the bookmark icon next to any question on your Results page to save it here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((b, i) => {
            const q = b.question;
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-2 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
                      {b.subject} {q.topic ? `· ${q.topic}` : ''}
                    </span>
                    <p className="font-medium text-ink" dangerouslySetInnerHTML={{ __html: q.question }} />
                  </div>
                  <button onClick={() => remove(b.id)} className="shrink-0 text-muted hover:text-danger" title="Remove bookmark">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt) => (
                    <div
                      key={opt}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        opt === q.correct_answer ? 'border-success bg-success/10 text-success' : 'border-primary-50 text-ink/60'
                      }`}
                      dangerouslySetInnerHTML={{ __html: opt }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
