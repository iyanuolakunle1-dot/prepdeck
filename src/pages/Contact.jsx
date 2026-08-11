import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // NOTE FOR DEVELOPER: hook this up to an email service (Resend, SendGrid, etc.)
    // or insert into a Supabase "support_tickets" table from the backend.
    setSent(true);
    toast.success('Message sent — we\'ll be in touch soon');
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Contact</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">We'd love to hear from you</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Questions, feedback, or found a bug? Send us a message and we'll get back to you.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
          <div className="flex items-start gap-3 rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
            <Mail className="mt-0.5 shrink-0 text-primary-600" size={20} />
            <div>
              <p className="font-display text-sm font-bold text-ink">Email us</p>
              <p className="text-sm text-muted">support@prepdeck.app</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-primary-100 bg-white p-5 shadow-card">
            <MessageSquare className="mt-0.5 shrink-0 text-primary-600" size={20} />
            <div>
              <p className="font-display text-sm font-bold text-ink">Response time</p>
              <p className="text-sm text-muted">We usually reply within one business day.</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card">
          {sent ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="mb-3 text-success" size={36} />
              <p className="font-display font-bold text-ink">Message sent</p>
              <p className="mt-1 text-sm text-muted">Thanks — we'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/80">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-xl border border-primary-100 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/80">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-xl border border-primary-100 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/80">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full rounded-xl border border-primary-100 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
              >
                <Send size={16} /> Send message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
