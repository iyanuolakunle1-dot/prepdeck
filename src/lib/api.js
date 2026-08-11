import axios from 'axios';

// The Node backend proxies Open Trivia DB (https://opentdb.com) — a free,
// no-key-required question API — so the client never talks to a third
// party directly and we can normalize/decode the payload server-side.
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://prepdeck-backend.onrender.com';

const api = axios.create({ baseURL: API_BASE });

export async function fetchCategories() {
  const { data } = await api.get('/api/categories');
  return data.categories;
}

// --- Nigerian school subjects (JAMB/WAEC-style local question bank) ---

export async function fetchSubjects() {
  const { data } = await api.get('/api/subjects');
  return data.subjects;
}

export async function fetchSubjectTopics(slug) {
  const { data } = await api.get(`/api/subjects/${slug}/topics`);
  return data.topics;
}

export async function fetchSubjectQuestions(slug, { amount = 10, difficulty = '', topic = '' } = {}) {
  const { data } = await api.get(`/api/subjects/${slug}/questions`, {
    params: { amount, difficulty, topic },
  });
  return data.questions;
}

// Combines questions across several subjects into one mock-exam set,
// used by the Mock Exams page for multi-subject packages like JAMB (4 subjects).
export async function fetchMockExamQuestions(subjectSlugs, amountPerSubject = 5) {
  const results = await Promise.all(
    subjectSlugs.map((slug) => fetchSubjectQuestions(slug, { amount: amountPerSubject }))
  );
  return results.flat();
}

// difficulty: 'easy' | 'medium' | 'hard' | ''
// type: 'multiple' | 'boolean' | ''
export async function fetchQuestions({ amount = 10, category = '', difficulty = '', type = 'multiple' }) {
  const { data } = await api.get('/api/questions', {
    params: { amount, category, difficulty, type },
  });
  return data.questions;
}

export async function saveAttempt(payload) {
  const { data } = await api.post('/api/attempts', payload);
  return data;
}

export async function fetchLeaderboard(category = '') {
  const { data } = await api.get('/api/leaderboard', { params: { category } });
  return data.leaderboard;
}

export async function deleteAccount(userId) {
  const { data } = await api.delete(`/api/account/${userId}`);
  return data;
}

export default api;
