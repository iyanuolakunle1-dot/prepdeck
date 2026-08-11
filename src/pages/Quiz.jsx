import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchSubjectQuestions, fetchMockExamQuestions } from '../lib/api';
import { mockExams } from '../data/mockExams';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Loader from '../components/Loader';

const SECONDS_PER_QUESTION = 30;

export default function Quiz() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({}); // { [index]: chosenOption }
  const [bookmarked, setBookmarked] = useState({});
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const startedAt = useRef(Date.now());

  const mockId = params.get('mock') || '';
  const mock = mockExams.find((m) => m.id === mockId);

  const subject = params.get('subject') || '';
  const subjectName = params.get('subjectName') || 'Practice';
  const examName = params.get('exam') || '';
  const topic = params.get('topic') || '';
  const difficulty = params.get('difficulty') || '';
  const amount = Number(params.get('amount')) || 10;

  // Custom multi-subject combo built on the Practice page (e.g. a candidate's own
  // JAMB 4-subject choice), distinct from the fixed presets in Mock Exams.
  const combo = params.get('subjects') || '';
  const comboSubjects = combo ? combo.split(',').filter(Boolean) : [];
  const comboAmount = Number(params.get('amountPerSubject')) || 5;
  const comboLabel = params.get('comboLabel') || '';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    if (comboSubjects.length > 0) {
      fetchMockExamQuestions(comboSubjects, comboAmount)
        .then((qs) => {
          if (cancelled) return;
          if (!qs || qs.length === 0) {
            setLoadError('Could not build this test right now. Please try again.');
          } else {
            setQuestions(qs);
            setTimeLeft(qs.length * SECONDS_PER_QUESTION);
            startedAt.current = Date.now();
          }
        })
        .catch(() => !cancelled && setLoadError('Could not fetch questions. Check the backend server is running.'))
        .finally(() => !cancelled && setLoading(false));
      return () => { cancelled = true; };
    }

    if (mock) {
      fetchMockExamQuestions(mock.subjects, mock.amountPerSubject)
        .then((qs) => {
          if (cancelled) return;
          if (!qs || qs.length === 0) {
            setLoadError('Could not build this mock exam right now. Please try again.');
          } else {
            setQuestions(qs);
            setTimeLeft(mock.durationMinutes * 60);
            startedAt.current = Date.now();
          }
        })
        .catch(() => !cancelled && setLoadError('Could not fetch mock exam questions. Check the backend server is running.'))
        .finally(() => !cancelled && setLoading(false));
      return () => { cancelled = true; };
    }

    if (!subject) {
      setLoadError('No subject was selected. Please start a test from Practice.');
      setLoading(false);
      return;
    }

    fetchSubjectQuestions(subject, { amount, difficulty, topic })
      .then((qs) => {
        if (cancelled) return;
        if (!qs || qs.length === 0) {
          setLoadError('No questions matched that topic/difficulty combination. Try a broader filter.');
        } else {
          setQuestions(qs);
          setTimeLeft(qs.length * SECONDS_PER_QUESTION);
          startedAt.current = Date.now();
        }
      })
      .catch(() => !cancelled && setLoadError('Could not fetch questions. Check your connection and that the backend server is running.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, subject, difficulty, topic, mockId]);

  const finishQuiz = useCallback(() => {
    const timeTakenSeconds = Math.round((Date.now() - startedAt.current) / 1000);
    const correctCount = questions.reduce(
      (acc, q, i) => (selected[i] === q.correct_answer ? acc + 1 : acc),
      0
    );
    navigate('/results', {
      state: {
        questions,
        selected,
        timeTakenSeconds,
        correctCount,
        category: comboSubjects.length > 0 ? (comboLabel || `${examName.toUpperCase()} Practice Combo`) : mock ? mock.title : subjectName,
        difficulty,
        examName: comboSubjects.length > 0 ? examName : mock ? mock.examLabel : examName,
        topic,
      },
    });
  }, [questions, selected, navigate, subjectName, difficulty, examName, topic, mock, comboSubjects, comboLabel]);

  useEffect(() => {
    if (loading || loadError || questions.length === 0) return;
    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, loading, loadError, questions, finishQuiz]);

  async function toggleBookmark() {
    if (!user) return;
    const q = questions[current];
    const isBookmarked = bookmarked[current];
    if (isBookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('question_id', q.id);
    } else {
      await supabase.from('bookmarks').upsert({
        user_id: user.id,
        question_id: q.id,
        subject: q.category,
        question: q,
      });
    }
    setBookmarked((b) => ({ ...b, [current]: !isBookmarked }));
    toast.success(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
  }

  if (loading) return <Loader label="Fetching your questions…" />;

  if (loadError) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-5 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
          <AlertCircle size={26} />
        </span>
        <h2 className="font-display text-xl font-bold text-ink">Couldn't load your test</h2>
        <p className="text-sm text-muted">{loadError}</p>
        <button
          onClick={() => navigate('/practice')}
          className="rounded-full bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          Back to Practice
        </button>
      </div>
    );
  }

  const q = questions[current];
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const isLow = timeLeft <= 30;
  const answeredCount = Object.keys(selected).length;

  function selectOption(option) {
    setSelected((s) => ({ ...s, [current]: option }));
  }

  function paletteState(i) {
    if (i === current) return 'current';
    if (selected[i] !== undefined) return 'answered';
    return 'unanswered';
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-100 bg-white px-5 py-3 shadow-card">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                {mock ? mock.examLabel : examName} {q.category ? `· ${q.category}` : ''}
              </p>
              <p className="text-sm font-bold text-ink">Question {current + 1} of {questions.length}</p>
            </div>
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${isLow ? 'bg-danger/10 text-danger' : 'bg-primary-50 text-primary-600'}`}>
              <Clock size={16} /> {minutes}:{seconds}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card sm:p-8"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-600">
                <span>{q.topic}</span>
                <span className="h-1 w-1 rounded-full bg-primary-300" />
                <span className="capitalize">{q.difficulty}</span>
              </div>
              <h2
                className="mb-6 font-display text-lg font-bold leading-snug text-ink sm:text-xl"
                dangerouslySetInnerHTML={{ __html: q.question }}
              />

              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  const isSelected = selected[current] === opt;
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <button
                      key={opt}
                      onClick={() => selectOption(opt)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-glow'
                          : 'border-primary-100 text-ink/80 hover:border-primary-300 hover:bg-primary-50/50'
                      }`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isSelected ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-500'}`}>
                        {letter}
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: opt }} />
                    </button>
                  );
                })}
              </div>

              {user && (
                <button
                  onClick={toggleBookmark}
                  className={`mt-6 flex items-center gap-1.5 text-xs font-semibold ${bookmarked[current] ? 'text-primary-600' : 'text-muted hover:text-primary-600'}`}
                >
                  {bookmarked[current] ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  {bookmarked[current] ? 'Bookmarked' : 'Bookmark question'}
                </button>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="flex items-center gap-1 rounded-full border border-primary-100 px-5 py-2.5 text-sm font-semibold text-ink/70 disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {current === questions.length - 1 ? (
              <button
                onClick={() => setConfirmSubmit(true)}
                className="flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
              >
                <Flag size={16} /> Submit test
              </button>
            ) : (
              <button
                onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                className="flex items-center gap-1 rounded-full bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>

          {!user && (
            <p className="mt-6 text-center text-xs text-muted">
              You're practicing as a guest — log in to save this attempt to your history.
            </p>
          )}
        </div>

        {/* Question palette sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
            <p className="mb-3 font-display text-sm font-bold text-ink">Question Palette</p>
            <div className="mb-3 flex items-center gap-3 text-[11px] text-muted">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-success" /> Answered</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-primary-500" /> Current</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-primary-100" /> Unanswered</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => {
                const state = paletteState(i);
                return (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                      state === 'current'
                        ? 'bg-brand-gradient text-white shadow-glow'
                        : state === 'answered'
                        ? 'bg-success text-white'
                        : 'bg-primary-50 text-primary-400 hover:bg-primary-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
            <p className="mb-3 font-display text-sm font-bold text-ink">Quiz Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Total questions</span><span className="font-semibold text-ink">{questions.length}</span></div>
              <div className="flex justify-between"><span className="text-muted">Answered</span><span className="font-semibold text-success">{answeredCount}</span></div>
              <div className="flex justify-between"><span className="text-muted">Not answered</span><span className="font-semibold text-danger">{questions.length - answeredCount}</span></div>
            </div>
            <button
              onClick={() => setConfirmSubmit(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-danger/10 py-2.5 text-sm font-semibold text-danger"
            >
              <Flag size={14} /> End & submit test
            </button>
          </div>
        </div>
      </div>

      {/* Submit confirmation modal */}
      <AnimatePresence>
        {confirmSubmit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl"
            >
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Flag size={24} />
              </span>
              <h3 className="font-display text-lg font-bold text-ink">Submit this test?</h3>
              <p className="mt-1 text-sm text-muted">
                You've answered {answeredCount} of {questions.length} questions.
                {questions.length - answeredCount > 0 && ` ${questions.length - answeredCount} will be marked as skipped.`}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmSubmit(false)}
                  className="flex-1 rounded-xl border border-primary-100 py-2.5 text-sm font-semibold text-ink/70"
                >
                  Keep going
                </button>
                <button
                  onClick={finishQuiz}
                  className="flex-1 rounded-xl bg-brand-gradient py-2.5 text-sm font-semibold text-white shadow-glow"
                >
                  Yes, submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
