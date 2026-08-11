export const posts = [
  {
    slug: 'how-to-study-for-jamb-in-8-weeks',
    title: 'How to Study for JAMB in 8 Weeks: A Realistic Plan',
    excerpt: 'You don\u2019t need six months. Here\u2019s a focused, week-by-week plan that actually fits into a busy final-year schedule.',
    date: '2026-06-02',
    readTime: '6 min read',
    category: 'Study tips',
    content: [
      'Eight weeks feels tight, but it\u2019s enough time to move your score meaningfully if you spend it on the right things. The mistake most candidates make is treating every subject and every topic as equally urgent. It isn\u2019t.',
      'Weeks 1\u20132: Diagnose. Sit one timed mock per subject with no revision beforehand. Don\u2019t worry about the score \u2014 the point is to see which topics you consistently miss. Keep a simple list: subject, topic, right or wrong.',
      'Weeks 3\u20136: Attack weak topics, not weak subjects. If you missed every Trigonometry question but did fine on Algebra, don\u2019t re-study all of Mathematics \u2014 drill Trigonometry specifically using topic filters, then retest.',
      'Weeks 7\u20138: Full mocks under real time pressure. By this point you should be sitting complete, timed practice tests across all four subjects back to back, exactly as you will on exam day, so the pacing feels automatic.',
      'The single highest-leverage habit in this plan is the timer. Untimed practice teaches you the content but not the pace, and pace is what actually costs marks on exam day.',
    ],
  },
  {
    slug: 'common-mistakes-in-waec-mathematics',
    title: '7 Common Mistakes Students Make in WAEC Mathematics',
    excerpt: 'Most lost marks in WAEC Maths aren\u2019t about not knowing the topic \u2014 they\u2019re about these avoidable habits.',
    date: '2026-05-14',
    readTime: '5 min read',
    category: 'Mathematics',
    content: [
      'Skipping units. Writing "24" instead of "24 cm\u00b2" for an area question can cost you marks even when your working is correct.',
      'Not showing working. WAEC awards method marks. A wrong final answer with correct working can still earn most of the available marks; a correct answer with no working often can\u2019t.',
      'Mixing up mean, median and mode under time pressure \u2014 know all three cold before exam day, and practice identifying which one a question is actually asking for.',
      'Rushing geometry diagrams. A quick, roughly-to-scale sketch catches errors (like assuming the wrong angle is right-angled) before they cost you the whole question.',
      'Forgetting to simplify fractions or surds in the final answer \u2014 examiners specifically look for this.',
      'Calculator errors from typing order of operations wrong, especially with fractions and powers. Where a calculator isn\u2019t allowed, double-check long division and multiplication by estimating first.',
      'Leaving questions blank instead of attempting partial working \u2014 there is no penalty for a wrong attempt, so an educated attempt is always better than nothing.',
    ],
  },
  {
    slug: 'jamb-vs-waec-vs-neco-whats-the-difference',
    title: 'JAMB vs WAEC vs NECO: What\u2019s Actually the Difference?',
    excerpt: 'Three exams, three purposes. Here\u2019s a clear breakdown of what each one tests and why you need all of them.',
    date: '2026-04-22',
    readTime: '4 min read',
    category: 'Exam guide',
    content: [
      'JAMB (UTME) is a computer-based entrance exam that determines eligibility for university admission in Nigeria. It\u2019s multiple-choice, tightly timed, and covers four subjects chosen based on your intended course of study.',
      'WAEC (WASSCE) is a certificate examination testing the full secondary school syllabus across many subjects, combining objective (multiple-choice) and theory (essay/working) sections. Universities require a minimum number of credit passes, including English and Mathematics.',
      'NECO (SSCE) serves a similar purpose to WAEC \u2014 a secondary school certificate exam \u2014 and is commonly written alongside or as an alternative/complement to WAEC, with a broadly similar syllabus.',
      'POST-UTME is a secondary screening exam conducted by individual universities after JAMB, used alongside your JAMB score to determine final admission for that specific institution.',
      'In short: WAEC/NECO prove you completed secondary school; JAMB and POST-UTME determine which university you get into. Most candidates need strong performance across all of them.',
    ],
  },
  {
    slug: 'building-an-exam-day-routine',
    title: 'Building an Exam-Day Routine That Actually Reduces Anxiety',
    excerpt: 'Small, boring rituals the night before and morning of your exam do more for your score than any last-minute cramming.',
    date: '2026-03-30',
    readTime: '4 min read',
    category: 'Mindset',
    content: [
      'The night before: stop studying new material by early evening. Instead, do one light, timed practice test to confirm your pacing feels right, then physically prepare everything you need \u2014 ID, pen, exam slip \u2014 so morning-of decisions are minimized.',
      'Sleep matters more than one extra hour of revision. A tired brain makes careless errors on questions you actually know.',
      'On the morning of the exam, eat something you\u2019ve eaten before \u2014 exam day is not the time to try a new breakfast that might upset your stomach.',
      'During the exam, if you hit a question you don\u2019t know, mark it and move on rather than losing minutes you\u2019ll need elsewhere. Come back at the end if time allows.',
      'Practicing under a real countdown timer regularly, in the weeks before the exam, is the single best way to make this pacing feel automatic instead of stressful.',
    ],
  },
];

export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug);
}
