// Each mock exam pulls `amountPerSubject` questions from each listed subject
// and combines them into one timed test. Counts are kept modest (our subject
// banks have 15-20 questions each) rather than claiming a larger total than
// the content actually supports.
export const mockExams = [
  {
    id: 'jamb-science',
    exam: 'jamb',
    examLabel: 'JAMB',
    title: 'JAMB Mock — Science Combination',
    subjects: ['english', 'mathematics', 'physics', 'chemistry'],
    amountPerSubject: 5,
    durationMinutes: 20,
  },
  {
    id: 'jamb-art',
    exam: 'jamb',
    examLabel: 'JAMB',
    title: 'JAMB Mock — Arts/Commercial Combination',
    subjects: ['english', 'mathematics', 'government', 'economics'],
    amountPerSubject: 5,
    durationMinutes: 20,
  },
  {
    id: 'waec-general',
    exam: 'waec',
    examLabel: 'WAEC',
    title: 'WAEC Mock — General Subjects',
    subjects: ['english', 'mathematics', 'biology', 'chemistry', 'physics', 'government', 'economics', 'geography', 'agriculture'],
    amountPerSubject: 3,
    durationMinutes: 27,
  },
  {
    id: 'neco-general',
    exam: 'neco',
    examLabel: 'NECO',
    title: 'NECO Mock — General Subjects',
    subjects: ['english', 'mathematics', 'biology', 'commerce', 'accounting', 'crs'],
    amountPerSubject: 4,
    durationMinutes: 24,
  },
  {
    id: 'post-utme-general',
    exam: 'post-utme',
    examLabel: 'POST-UTME',
    title: 'POST-UTME Mock — General Screening',
    subjects: ['english', 'mathematics', 'government', 'literature'],
    amountPerSubject: 5,
    durationMinutes: 20,
  },
];
