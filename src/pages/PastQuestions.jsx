import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Target, Bookmark, PlayCircle, BookmarkCheck } from 'lucide-react';
import { fetchSubjects, fetchSubjectQuestions } from '../lib/api';
import { supabase, notifySupabaseError } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function PastQuestions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    fetchSubjects().then((subs) => {
      setSubjects(subs);
      if (subs.length) setActiveSubject(subs[0].slug);
    });
  }, []);

  useEffect(() => {
    if (!activeSubject) return;
    setLoading(true);
    fetchSubjectQuestions(activeSubject, { amount: 50, difficulty })
      .then(setQuestions)
      .finally(() => setLoading(false));
  }, [activeSubject, difficulty]);

  useEffect(() => {
    if (!user) return;
    supabase.from('bookmarks').select('question_id').eq('user_id', user.id).then(({ data, error }) => {
      if (error) { notifySupabaseError(error, 'load your bookmarks'); return; }
      setBookmarkedIds(new Set((data || []).map((b) => b.question_id)));
    });
  }, [user]);

  async function toggleBookmark(q) {
    if (!user) return;
    const isBookmarked = bookmarkedIds.has(q.id);
    if (isBookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('question_id', q.id);
      setBookmarkedIds((s) => { const next = new Set(s); next.delete(q.id); return next; });
    } else {
      await supabase.from('bookmarks').upsert({ user_id: user.id, question_id: q.id, subject: q.category, question: q });
      setBookmarkedIds((s) => new Set(s).add(q.id));
    }
  }

  function practiceQuestion(q) {
    const params = new URLSearchParams({
      subject: activeSubject,
      subjectName: q.category,
      topic: q.topic,
      difficulty: q.difficulty,
      amount: '1',
    });
    navigate(`/quiz?${params.toString()}`);
  }

  const activeSubjectMeta = subjects.find((s) => s.slug === activeSubject);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-ink">Past Questions</h1>
        <p className="mt-1 text-muted">Browse every question in the bank by subject and topic.</p>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
          Note: these are practice questions written to match the exam syllabus, not scanned copies of
          real past JAMB/WAEC papers by year — we don't have a licensed archive to pull those from.
        </p>
      </motion.div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><FileText size={16} /></span>
          <p className="font-display text-xl font-bold text-ink">{activeSubjectMeta?.questionCount ?? '—'}</p>
          <p className="text-xs text-muted">Questions in this subject</p>
        </div>
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success"><CheckCircle2 size={16} /></span>
          <p className="font-display text-xl font-bold text-ink">{questions.length}</p>
          <p className="text-xs text-muted">Showing now</p>
        </div>
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-600"><Target size={16} /></span>
          <p className="font-display text-xl font-bold text-ink">{bookmarkedIds.size}</p>
          <p className="text-xs text-muted">Bookmarked</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto">
        {subjects.map((s) => (
          <button
            key={s.slug}
            onClick={() => setActiveSubject(s.slug)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeSubject === s.slug ? 'bg-brand-gradient text-white shadow-glow' : 'border border-primary-100 text-ink/70'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        {['', 'easy', 'medium', 'hard'].map((d) => (
          <button
            key={d || 'all'}
            onClick={() => setDifficulty(d)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              difficulty === d ? 'border-transparent bg-primary-600 text-white' : 'border-primary-100 text-ink/60'
            }`}
          >
            {d || 'All difficulty'}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-primary-100 bg-white shadow-card">
        {loading ? (
          <Loader />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary-50 bg-primary-50/40 text-left text-xs font-semibold uppercase text-muted">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Question</th>
                <th className="px-5 py-3">Topic</th>
                <th className="px-5 py-3">Difficulty</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => (
                <tr key={q.id} className="border-b border-primary-50 last:border-0">
                  <td className="px-5 py-3 text-muted">{i + 1}</td>
                  <td className="max-w-md px-5 py-3 font-medium text-ink" dangerouslySetInnerHTML={{ __html: q.question }} />
                  <td className="px-5 py-3 text-muted">{q.topic}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      q.difficulty === 'easy' ? 'bg-success/10 text-success' : q.difficulty === 'hard' ? 'bg-danger/10 text-danger' : 'bg-gold-500/10 text-gold-600'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => practiceQuestion(q)} className="flex items-center gap-1 text-xs font-semibold text-primary-600">
                        <PlayCircle size={14} /> Practice
                      </button>
                      {user && (
                        <button onClick={() => toggleBookmark(q)} className={bookmarkedIds.has(q.id) ? 'text-primary-600' : 'text-primary-200 hover:text-primary-400'}>
                          {bookmarkedIds.has(q.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
