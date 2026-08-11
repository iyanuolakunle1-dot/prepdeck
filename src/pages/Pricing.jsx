import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const plans = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    tagline: 'Everything you need to start practicing today.',
    features: [
      { label: 'All 13 subjects', included: true },
      { label: 'Unlimited timed practice tests', included: true },
      { label: 'Score history & accuracy trend', included: true },
      { label: 'Leaderboard access', included: true },
      { label: 'Full past-question mock exams', included: false },
      { label: 'Downloadable PDF results', included: false },
      { label: 'Priority new-subject access', included: false },
    ],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '₦1,500',
    period: '/month',
    tagline: 'For students serious about their JAMB/WAEC score.',
    features: [
      { label: 'All 13 subjects', included: true },
      { label: 'Unlimited timed practice tests', included: true },
      { label: 'Score history & accuracy trend', included: true },
      { label: 'Leaderboard access', included: true },
      { label: 'Full past-question mock exams', included: true },
      { label: 'Downloadable PDF results', included: true },
      { label: 'Priority new-subject access', included: true },
    ],
    cta: 'Upgrade to Premium',
    highlighted: true,
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  function handleSelect(plan) {
    if (plan.name === 'Free') {
      navigate(user ? '/dashboard' : '/signup');
      return;
    }
    // NOTE FOR DEVELOPER: wire this up to your payment processor.
    // e.g. Paystack: initialize a transaction here with your public key,
    // then verify it on the backend before flipping the user's plan in Supabase.
    // We can't complete this without your Paystack/Stripe account credentials.
    setLoadingPlan(plan.name);
    setTimeout(() => {
      setLoadingPlan(null);
      toast.error('Payments aren\'t connected yet — add your Paystack/Stripe keys in server/routes to enable this.');
    }, 600);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Pricing</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">Simple, honest pricing</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          Start free. Upgrade only if you want the extras — no hidden fees.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-3xl p-8 ${
              plan.highlighted
                ? 'bg-brand-gradient text-white shadow-glow'
                : 'border border-primary-100 bg-white shadow-card'
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-8 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary-600 shadow">
                Most popular
              </span>
            )}
            <h3 className={`font-display text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-ink'}`}>
              {plan.name}
            </h3>
            <p className={`mt-1 text-sm ${plan.highlighted ? 'text-white/80' : 'text-muted'}`}>{plan.tagline}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">{plan.price}</span>
              <span className={plan.highlighted ? 'text-white/70' : 'text-muted'}>{plan.period}</span>
            </p>

            <ul className="mt-8 space-y-3">
              {plan.features.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5 text-sm">
                  {f.included ? (
                    <Check size={18} className={plan.highlighted ? 'text-white' : 'text-success'} />
                  ) : (
                    <X size={18} className={plan.highlighted ? 'text-white/40' : 'text-muted/50'} />
                  )}
                  <span className={f.included ? '' : plan.highlighted ? 'text-white/50 line-through' : 'text-muted/60 line-through'}>
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(plan)}
              disabled={loadingPlan === plan.name}
              className={`mt-8 w-full rounded-xl py-3 text-sm font-bold transition-transform hover:scale-[1.02] disabled:opacity-60 ${
                plan.highlighted ? 'bg-white text-primary-600' : 'bg-brand-gradient text-white shadow-glow'
              }`}
            >
              {loadingPlan === plan.name ? 'Please wait…' : plan.cta}
            </button>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-muted">
        Prices shown in Naira for illustration. All plans can be cancelled anytime.
      </p>
    </div>
  );
}
