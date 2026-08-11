import LegalLayout from '../components/LegalLayout';

export default function Cookies() {
  return (
    <LegalLayout title="Cookie Policy" updated="August 2026">
      <section>
        <h2 className="font-display text-lg font-bold text-ink">What we use</h2>
        <p>
          PrepDeck uses a minimal set of cookies and browser storage set by Supabase Authentication to
          keep you logged in between visits. We don't use third-party advertising or tracking
          cookies.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-bold text-ink">Essential cookies</h2>
        <p>
          These are required for the app to function — for example, keeping your session active so
          you don't have to log in again on every page.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg font-bold text-ink">Managing cookies</h2>
        <p>
          You can clear cookies for this site at any time from your browser settings; doing so will
          simply log you out.
        </p>
      </section>
    </LegalLayout>
  );
}
