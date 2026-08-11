import LegalLayout from '../components/LegalLayout';

export default function Terms() {
  return (
    <LegalLayout title="Terms & Conditions" updated="August 2026">
      <section>
        <h2 className="font-display text-lg font-bold text-ink">1. Acceptance of terms</h2>
        <p>
          By creating an account or using PrepDeck, you agree to these terms. If you don't agree,
          please don't use the platform.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-bold text-ink">2. Use of the service</h2>
        <p>
          PrepDeck is provided for personal exam-preparation use. You agree not to attempt to
          disrupt the service, scrape question content for redistribution, or share your account
          credentials with others.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-bold text-ink">3. Accounts</h2>
        <p>
          You're responsible for keeping your password confidential and for all activity under your
          account. Let us know immediately if you suspect unauthorized access.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-bold text-ink">4. Subscriptions</h2>
        <p>
          Premium plans, where available, are billed on a recurring basis and can be cancelled at any
          time; cancellation takes effect at the end of the current billing period.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-bold text-ink">5. Disclaimer</h2>
        <p>
          PrepDeck is a study aid and does not guarantee any specific exam outcome or score. Content
          is written to reflect common syllabus topics but is not affiliated with or endorsed by
          JAMB, WAEC, or NECO.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-bold text-ink">6. Changes</h2>
        <p>We may update these terms from time to time; continued use after changes means you accept the revised terms.</p>
      </section>
    </LegalLayout>
  );
}
