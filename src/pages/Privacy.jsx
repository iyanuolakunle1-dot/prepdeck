import LegalLayout from '../components/LegalLayout';

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="August 2026">
      <section>
        <h2 className="font-display text-lg font-bold text-ink">1. Information we collect</h2>
        <p>
          When you create a PrepDeck account we collect your name, email address, and the password
          you set (stored securely, hashed, via Supabase Authentication — we never see or store your
          plain-text password). When you practice, we store your quiz attempts: subject, difficulty,
          score, and time taken.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-bold text-ink">2. How we use your information</h2>
        <p>
          We use your data to run your account, save your practice history so you can track progress,
          and to power the public leaderboard using your display name and scores only — never your
          email or password.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-bold text-ink">3. Data storage and security</h2>
        <p>
          Your data is stored in a Supabase-managed PostgreSQL database with row-level security
          enabled, meaning only you can write to your own profile and attempt records. We don't sell
          or share your personal information with third parties for advertising.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-bold text-ink">4. Your rights</h2>
        <p>
          You can update your profile information at any time from the Profile page, and request
          account deletion by contacting us at support@prepdeck.app. Deleting your account removes
          your profile and quiz history from our systems.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-bold text-ink">5. Changes to this policy</h2>
        <p>
          We may update this policy occasionally. Material changes will be reflected by the "last
          updated" date above.
        </p>
      </section>
    </LegalLayout>
  );
}
