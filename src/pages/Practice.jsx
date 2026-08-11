import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, BarChart3, Clock, CheckCircle2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchSubjects, fetchSubjectTopics } from '../lib/api';
import { exams } from '../data/exams';
import { getSubjectIcon } from '../lib/subjectIcons';
import Loader from '../components/Loader';

const difficulties = [
  { value: '', label: 'Mixed' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];
const amounts = [3, 5, 8, 10];

export default function Practice() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = exam, 2 = subjects, 3 = configure
  const [exam, setExam] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedElectives, setSelectedElectives] = useState([]);
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [difficulty, setDifficulty] = useState('');
  const [amount, setAmount] = useState(5);

  useEffect(() => {
    fetchSubjects()
      .then(setSubjects)
      .catch(() => setError('Could not load subjects. Is the backend server running?'))
      .finally(() => setLoading(false));
  }, []);

  function chooseExam(e) {
    setExam(e);
    setSelectedElectives([]);
    setStep(2);
  }

  const compulsorySubjects = exam ? subjects.filter((s) => exam.compulsory.includes(s.slug)) : [];
  const electiveOptions = exam ? subjects.filter((s) => !exam.compulsory.includes(s.slug)) : [];
  const finalCombo = exam ? [...exam.compulsory, ...selectedElectives] : [];

  function toggleElective(slug) {
    if (!exam) return;
    setSelectedElectives((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= exam.electiveMax) {
        toast.error(`You can only pick up to ${exam.electiveMax} elective${exam.electiveMax > 1 ? 's' : ''} for ${exam.name}.`);
        return prev;
      }
      return [...prev, slug];
    });
  }

  async function goToConfigure() {
    if (selectedElectives.length < exam.electiveMin) {
      toast.error(`Pick at least ${exam.electiveMin} elective subject${exam.electiveMin > 1 ? 's' : ''} for ${exam.name}.`);
      return;
    }
    // Topic filtering only makes sense for a single-subject session.
    if (finalCombo.length === 1) {
      try {
        const t = await fetchSubjectTopics(finalCombo[0]);
        setTopics(t);
      } catch {
        setTopics([]);
      }
    } else {
      setTopics([]);
    }
    setTopic('');
    setStep(3);
  }

  function handleStart() {
    if (finalCombo.length === 1) {
      const subjectMeta = subjects.find((s) => s.slug === finalCombo[0]);
      const params = new URLSearchParams({
        subject: finalCombo[0],
        subjectName: subjectMeta?.name || finalCombo[0],
        exam: exam.slug,
        difficulty,
        topic,
        amount: String(amount),
      });
      navigate(`/quiz?${params.toString()}`);
      return;
    }

    const params = new URLSearchParams({
      subjects: finalCombo.join(','),
      amountPerSubject: String(amount),
      difficulty,
      exam: exam.slug,
      comboLabel: `${exam.name} Practice — Your Combo`,
    });
    navigate(`/quiz?${params.toString()}`);
  }

  const subjectName = (slug) => subjects.find((s) => s.slug === slug)?.name || slug;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Practice</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">
          Choose your exam, subjects and settings
        </h1>
        <p className="mt-2 text-muted">
          Build the real subject combination for your exam — just like registering for the actual test.
        </p>
      </motion.div>

      {/* Step indicator */}
      <div className="mt-8 flex items-center gap-2">
        {['Exam', 'Subjects', 'Configure'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                step > i + 1 ? 'bg-success text-white' : step === i + 1 ? 'bg-brand-gradient text-white shadow-glow' : 'bg-primary-50 text-primary-300'
              }`}
            >
              {i + 1}
            </div>
            <span className={`hidden text-sm font-medium sm:block ${step === i + 1 ? 'text-ink' : 'text-muted'}`}>{label}</span>
            {i < 2 && <div className="h-px w-8 bg-primary-100 sm:w-16" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-8 grid gap-5 sm:grid-cols-2">
            {exams.map((e) => (
              <button
                key={e.slug}
                onClick={() => chooseExam(e)}
                className={`rounded-2xl bg-gradient-to-br ${e.color} p-6 text-left text-white shadow-glow transition-transform hover:scale-[1.02]`}
              >
                <h3 className="font-display text-xl font-bold">{e.name}</h3>
                <p className="mt-2 text-sm text-white/80">{e.description}</p>
                <span className="mt-4 flex items-center gap-1 text-sm font-semibold">
                  Choose <ArrowRight size={14} />
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && exam && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-8">
            <button onClick={() => setStep(1)} className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-primary-600">
              <ArrowLeft size={16} /> Back to exams
            </button>

            {loading ? (
              <Loader label="Loading subjects…" />
            ) : error ? (
              <div className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
            ) : (
              <>
                <div className="mb-6 flex items-start gap-2 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-700">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  <p>
                    {exam.name} requires <strong>{exam.compulsory.map(subjectName).join(' + ')}</strong> (compulsory) plus{' '}
                    <strong>{exam.electiveMin === exam.electiveMax ? exam.electiveMin : `${exam.electiveMin}–${exam.electiveMax}`}</strong> elective subject{exam.electiveMax > 1 ? 's' : ''}.
                    Selected: <strong>{selectedElectives.length}</strong>.
                  </p>
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Compulsory</p>
                <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {compulsorySubjects.map((s) => {
                    const Icon = getSubjectIcon(s.icon);
                    return (
                      <div key={s.slug} className="flex items-center gap-3 rounded-xl border border-success bg-success/5 p-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success text-white"><Icon size={16} /></span>
                        <div>
                          <p className="text-sm font-bold text-ink">{s.name}</p>
                          <p className="flex items-center gap-1 text-xs text-success"><CheckCircle2 size={11} /> Required</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">
                  Choose your electives ({selectedElectives.length}/{exam.electiveMax})
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {electiveOptions.map((s, i) => {
                    const Icon = getSubjectIcon(s.icon);
                    const isSelected = selectedElectives.includes(s.slug);
                    return (
                      <motion.button
                        key={s.slug}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => toggleElective(s.slug)}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                          isSelected ? 'border-primary-500 bg-primary-50 shadow-glow' : 'border-primary-100 bg-white hover:border-primary-300'
                        }`}
                      >
                        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${isSelected ? 'bg-brand-gradient text-white' : 'bg-primary-50 text-primary-600'}`}>
                          <Icon size={16} />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-ink">{s.name}</p>
                          <p className="text-xs text-muted">{s.questionCount} questions</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  onClick={goToConfigure}
                  className="mt-8 flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </>
            )}
          </motion.div>
        )}

        {step === 3 && exam && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-primary-100 bg-white p-6 shadow-card sm:p-8">
              <button onClick={() => setStep(2)} className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                <ArrowLeft size={16} /> Change subjects
              </button>

              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Your combo</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {finalCombo.map((slug) => (
                  <span key={slug} className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-600">
                    {subjectName(slug)}
                  </span>
                ))}
              </div>

              {topics.length > 0 && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-semibold text-ink">Topic (single-subject only)</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-xl border border-primary-100 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">All topics</option>
                    {topics.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-6">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                  <BarChart3 size={16} className="text-primary-600" /> Difficulty
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {difficulties.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                        difficulty === d.value ? 'border-transparent bg-brand-gradient text-white shadow-glow' : 'border-primary-100 text-ink/70 hover:border-primary-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                  <Clock size={16} className="text-primary-600" /> Questions {finalCombo.length > 1 ? 'per subject' : ''}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {amounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                        amount === a ? 'border-transparent bg-brand-gradient text-white shadow-glow' : 'border-primary-100 text-ink/70 hover:border-primary-300'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl bg-brand-gradient p-7 text-white shadow-glow">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{exam.name}</p>
                <h2 className="mt-1 font-display text-xl font-bold">{finalCombo.length} subject{finalCombo.length > 1 ? 's' : ''}</h2>
                <p className="mt-2 text-sm text-white/80">
                  {amount} questions {finalCombo.length > 1 ? 'per subject' : ''} · {difficulty || 'mixed'} difficulty
                  {finalCombo.length > 1 && ` · ${amount * finalCombo.length} total`}
                </p>
              </div>
              <button
                onClick={handleStart}
                className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-primary-600 transition-transform hover:scale-105"
              >
                Start test <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
