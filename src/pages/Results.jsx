import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, CheckCircle2, XCircle, Save, Bookmark, BookmarkCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { supabase, notifySupabaseError } from '../lib/supabaseClient';

export default function Results() {
  const location = useLocation();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [bookmarked, setBookmarked] = useState({});

  const state = location.state;

  async function toggleBookmark(q, i) {
    if (!user) return;
    const isBookmarked = bookmarked[i];
    if (isBookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('question_id', q.id);
      setBookmarked((b) => ({ ...b, [i]: false }));
      toast.success('Bookmark removed');
    } else {
      await supabase.from('bookmarks').upsert({
        user_id: user.id,
        question_id: q.id,
        subject: state.category,
        question: q,
      });
      setBookmarked((b) => ({ ...b, [i]: true }));
      toast.success('Question bookmarked');
    }
  }

  useEffect(() => {
    if (!state || !user) return;
    const { questions, correctCount, timeTakenSeconds, category, difficulty } = state;
    supabase
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        category: category || 'Mixed',
        difficulty: difficulty || 'mixed',
        score: correctCount,
        total_questions: questions.length,
        time_taken_seconds: timeTakenSeconds,
      })
      .then(({ error }) => {
        if (error) throw error;
        setSaved(true);
        toast.success('Result saved to your history');
      })
      .catch((err) => {
        setSaveError('Attempt scored locally, but we could not save it to your history. Make sure the supabase-schema.sql has been run on your project.');
        notifySupabaseError(err, 'save this attempt');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, user]);

  if (!state) return <Navigate to="/dashboard" replace />;

  const { questions, selected, correctCount, timeTakenSeconds } = state;
  const percentage = Math.round((correctCount / questions.length) * 100);
  const minutes = Math.floor(timeTakenSeconds / 60);
  const seconds = timeTakenSeconds % 60;

  const verdict =
    percentage >= 80 ? 'Outstanding work' : percentage >= 50 ? 'Solid effort' : 'Keep practicing';

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-brand-gradient p-8 text-center text-white shadow-glow sm:p-12"
      >
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
          <Trophy size={30} />
        </span>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{verdict}</h1>
        <p className="mt-2 text-white/80">You scored</p>
        <p className="mt-1 font-display text-6xl font-bold">
          {correctCount}/{questions.length}
        </p>
        <p className="mt-1 text-white/80">{percentage}% correct · {minutes}m {seconds}s</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-primary-600 transition-transform hover:scale-105"
          >
            <RotateCcw size={16} /> New test
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Home size={16} /> Home
          </Link>
        </div>

        {user ? (
          saveError ? (
            <p className="mt-4 text-xs text-white/70">{saveError}</p>
          ) : (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/70">
              <Save size={12} /> {saved ? 'Saved to your history' : 'Saving to your history…'}
            </p>
          )
        ) : (
          <p className="mt-4 text-xs text-white/70">
            <Link to="/signup" className="underline">Create an account</Link> to save this result.
          </p>
        )}
      </motion.div>

      <h2 className="mb-4 mt-12 font-display text-xl font-bold text-ink">Review your answers</h2>
      <div className="space-y-4">
        {questions.map((q, i) => {
          const yourAnswer = selected[i];
          const isCorrect = yourAnswer === q.correct_answer;
          const wasAnswered = yourAnswer !== undefined;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <p
                  className="font-medium text-ink"
                  dangerouslySetInnerHTML={{ __html: `${i + 1}. ${q.question}` }}
                />
                <div className="flex shrink-0 items-center gap-2">
                  {user && (
                    <button
                      onClick={() => toggleBookmark(q, i)}
                      className={`transition-colors ${bookmarked[i] ? 'text-primary-600' : 'text-primary-200 hover:text-primary-400'}`}
                      title={bookmarked[i] ? 'Remove bookmark' : 'Bookmark this question'}
                    >
                      {bookmarked[i] ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  )}
                  {isCorrect ? (
                    <CheckCircle2 size={20} className="text-success" />
                  ) : (
                    <XCircle size={20} className="text-danger" />
                  )}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((opt) => {
                  const isCorrectOpt = opt === q.correct_answer;
                  const isYourWrongPick = opt === yourAnswer && !isCorrect;
                  return (
                    <div
                      key={opt}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        isCorrectOpt
                          ? 'border-success bg-success/10 text-success'
                          : isYourWrongPick
                          ? 'border-danger bg-danger/10 text-danger'
                          : 'border-primary-50 text-ink/60'
                      }`}
                      dangerouslySetInnerHTML={{ __html: opt }}
                    />
                  );
                })}
              </div>
              {!wasAnswered && (
                <p className="mt-2 text-xs font-medium text-muted">You didn't answer this one.</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
