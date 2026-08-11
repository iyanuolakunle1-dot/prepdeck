import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Rocket, PenSquare, CalendarClock, BarChart3, Bookmark,
  Settings as SettingsIcon, MessageSquare, Mail, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { faqs } from '../data/faqs';

const topics = [
  { icon: Rocket, title: 'Getting Started', desc: 'New here? Learn how to get started.' },
  { icon: PenSquare, title: 'Practice & Quizzes', desc: 'Learn how to practice questions and quizzes.' },
  { icon: CalendarClock, title: 'Mock Exams', desc: 'Everything about taking and analyzing mock exams.' },
  { icon: BarChart3, title: 'Performance', desc: 'Understand your performance reports.' },
  { icon: Bookmark, title: 'Bookmarks', desc: 'Save, organize and review saved questions.' },
  { icon: SettingsIcon, title: 'Account & Settings', desc: 'Manage your account, profile and preferences.' },
];

export default function Help() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-brand-gradient-soft p-8">
        <p className="font-display text-xl font-bold text-ink">Hi {firstName}! 👋</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink">How can we help you today?</h1>
        <div className="mt-5 flex max-w-lg items-center gap-2 rounded-xl border border-primary-100 bg-white px-4 py-3">
          <Search size={18} className="text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for help articles…"
            className="w-full border-none bg-transparent text-sm outline-none"
          />
        </div>
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Browse help topics</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics
              .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || search === '')
              .map((t, i) => (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card"
                >
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <t.icon size={18} />
                  </span>
                  <h3 className="font-display text-sm font-bold text-ink">{t.title}</h3>
                  <p className="mt-1 text-xs text-muted">{t.desc}</p>
                </motion.div>
              ))}
          </div>

          <h2 className="mb-4 mt-8 font-display text-lg font-bold text-ink">Frequently asked questions</h2>
          <div className="space-y-2">
            {faqs.slice(0, 5).map((f) => (
              <Link
                key={f.q}
                to="/faq"
                className="flex items-center justify-between rounded-xl border border-primary-100 bg-white px-5 py-3.5 text-sm font-medium text-ink hover:border-primary-300"
              >
                {f.q} <ChevronRight size={16} className="text-muted" />
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
            <p className="mb-3 font-display text-sm font-bold text-ink">Contact us</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><MessageSquare size={16} /></span>
                <div>
                  <p className="text-sm font-semibold text-ink">Live chat</p>
                  <p className="text-xs text-muted">Chat with our support team, Mon–Fri.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><Mail size={16} /></span>
                <div>
                  <p className="text-sm font-semibold text-ink">Email support</p>
                  <p className="text-xs text-muted">support@prepdeck.app — reply within 24h.</p>
                </div>
              </div>
            </div>
            <Link
              to="/contact"
              className="mt-4 flex items-center justify-center rounded-xl bg-brand-gradient py-2.5 text-sm font-semibold text-white shadow-glow"
            >
              Contact Us
            </Link>
          </div>

          <div className="rounded-2xl bg-brand-gradient-soft p-5">
            <p className="font-display text-sm font-bold text-ink">Still need help?</p>
            <p className="mt-1 text-xs text-muted">Our team is ready to assist you — reach out anytime.</p>
            <Link to="/faq" className="mt-3 inline-flex text-xs font-bold text-primary-600">
              View full FAQ →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
