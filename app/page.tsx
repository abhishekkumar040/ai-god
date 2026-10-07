import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={styles.wrapper}>
      {/* Background glow effects */}
      <div style={styles.glowTopLeft} />
      <div style={styles.glowTopRight} />

      {/* Navigation Header */}
      <header style={styles.navbar}>
        <div style={styles.navContainer}>
          <Link href="/" style={styles.brand}>
            <div style={styles.brandIcon}>⚡</div>
            <span style={styles.brandText}>FastNextJS</span>
            <span style={styles.brandVersion}>v16</span>
          </Link>

          <nav style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#stack" style={styles.navLink}>Tech Stack</a>
            <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" style={styles.navLink}>Docs</a>
            <a href="https://github.com/tubeguruji" target="_blank" rel="noopener noreferrer" style={styles.navLink}>GitHub</a>
          </nav>

          <div style={styles.navAuth}>
            <Link href="/sign-in" style={styles.signInBtn}>
              Sign In
            </Link>
            <Link href="/sign-up" style={styles.getStartedNavBtn}>
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroBadge}>
          <span style={styles.badgePulse} />
          <span>Production-Ready Next.js 16 SaaS Starter</span>
        </div>

        <h1 style={styles.heroTitle}>
          Launch Your Next SaaS{' '}
          <span style={styles.gradientText}>10x Faster</span>
        </h1>

        <p style={styles.heroSubtitle}>
          The ultimate boilerplate configured with type-safe databases, modular auth, payment gateways,
          background cron schedulers, and modern UI libraries. Stop configuring — start shipping.
        </p>

        {/* CTA Buttons */}
        <div style={styles.ctaGroup}>
          <Link href="/sign-up" style={styles.primaryCta}>
            <span>🚀 Get Started Free</span>
          </Link>
          <a href="#features" style={styles.secondaryCta}>
            <span>Explore Architecture ↓</span>
          </a>
        </div>

        {/* CLI Terminal Command Box */}
        <div style={styles.terminalBox}>
          <div style={styles.terminalHeader}>
            <div style={styles.dotRed} />
            <div style={styles.dotYellow} />
            <div style={styles.dotGreen} />
            <span style={styles.terminalTitle}>bash</span>
          </div>
          <div style={styles.terminalContent}>
            <span style={styles.terminalPrompt}>$</span>
            <span style={styles.terminalCommand}>npx create-fastnextjs-app@latest</span>
          </div>
        </div>

        {/* Tech Stack Banner */}
        <div id="stack" style={styles.stackBanner}>
          <span style={styles.stackLabel}>POWERED BY MODERN TECH STACK</span>
          <div style={styles.stackPills}>
            <span style={styles.stackPill}>⚡ Next.js 16 (Turbopack)</span>
            <span style={styles.stackPill}>⚛️ React 19</span>
            <span style={styles.stackPill}>🔒 NextAuth / Clerk</span>
            <span style={styles.stackPill}>🗄️ Drizzle / Neon / Supabase</span>
            <span style={styles.stackPill}>💳 Stripe / Lemon Squeezy</span>
            <span style={styles.stackPill}>⏰ Inngest Jobs</span>
            <span style={styles.stackPill}>📧 Resend API</span>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>CORE CAPABILITIES</span>
          <h2 style={styles.sectionTitle}>Everything You Need To Build A Unicorn</h2>
          <p style={styles.sectionSubtitle}>
            Engineered with best practices, seamless developer experience, and clean modular code.
          </p>
        </div>

        <div style={styles.featuresGrid}>
          {/* Feature 1 */}
          <div style={styles.featureCard}>
            <div style={styles.featureIconBox}>🔒</div>
            <h3 style={styles.featureTitle}>Modular Authentication</h3>
            <p style={styles.featureDescription}>
              Pre-configured NextAuth, Clerk, or Better Auth with light-theme SignIn/SignUp pages and Proxy edge route restriction.
            </p>
            <div style={styles.featureTag}>OAuth & Sessions Ready</div>
          </div>

          {/* Feature 2 */}
          <div style={styles.featureCard}>
            <div style={styles.featureIconBox}>🗄️</div>
            <h3 style={styles.featureTitle}>Type-Safe Database & ORM</h3>
            <p style={styles.featureDescription}>
              PostgreSQL, Neon Serverless Postgres, or Supabase powered by Drizzle ORM with schema push and studio migration scripts.
            </p>
            <div style={styles.featureTag}>Instant Schema Sync</div>
          </div>

          {/* Feature 3 */}
          <div style={styles.featureCard}>
            <div style={styles.featureIconBox}>💳</div>
            <h3 style={styles.featureTitle}>Payments & Subscriptions</h3>
            <p style={styles.featureDescription}>
              Stripe and Lemon Squeezy pre-wired checkout handlers, customer portal links, and secure webhook event verification.
            </p>
            <div style={styles.featureTag}>Revenue Ready</div>
          </div>

          {/* Feature 4 */}
          <div style={styles.featureCard}>
            <div style={styles.featureIconBox}>⏰</div>
            <h3 style={styles.featureTitle}>Background Jobs & Cron</h3>
            <p style={styles.featureDescription}>
              Inngest background workers and cron schedules to handle AI tasks, notifications, and heavy jobs outside request lifecycles.
            </p>
            <div style={styles.featureTag}>Serverless Queues</div>
          </div>

          {/* Feature 5 */}
          <div style={styles.featureCard}>
            <div style={styles.featureIconBox}>📧</div>
            <h3 style={styles.featureTitle}>Transactional Emails</h3>
            <p style={styles.featureDescription}>
              Resend and SendGrid API clients with clean endpoint wrappers for welcome emails, magic links, and billing alerts.
            </p>
            <div style={styles.featureTag}>High Deliverability</div>
          </div>

          {/* Feature 6 */}
          <div style={styles.featureCard}>
            <div style={styles.featureIconBox}>🎨</div>
            <h3 style={styles.featureTitle}>Modern Styling & UI</h3>
            <p style={styles.featureDescription}>
              Tailwind CSS v4, Shadcn UI components, DaisyUI, or FlyonUI with responsive dark and light modes out of the box.
            </p>
            <div style={styles.featureTag}>Tailwind + Radix</div>
          </div>
        </div>
      </section>

      {/* Quick Start Step Guide */}
      <section style={styles.stepsSection}>
        <div style={styles.stepsCard}>
          <h2 style={styles.stepsTitle}>Get Started in 3 Simple Steps</h2>
          <div style={styles.stepsGrid}>
            <div style={styles.stepItem}>
              <div style={styles.stepNumber}>1</div>
              <h4 style={styles.stepHeading}>Scaffold Stack</h4>
              <p style={styles.stepText}>Run the CLI and select your database, auth, UI library, and payment gateway.</p>
            </div>
            <div style={styles.stepItem}>
              <div style={styles.stepNumber}>2</div>
              <h4 style={styles.stepHeading}>Configure Keys</h4>
              <p style={styles.stepText}>Fill in your API credentials in the pre-generated <code>.env</code> file.</p>
            </div>
            <div style={styles.stepItem}>
              <div style={styles.stepNumber}>3</div>
              <h4 style={styles.stepHeading}>Ship to Production</h4>
              <p style={styles.stepText}>Deploy seamlessly to Vercel, Railway, or AWS with standard Next.js build scripts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section style={styles.ctaBannerSection}>
        <div style={styles.ctaBanner}>
          <h2 style={styles.ctaBannerTitle}>Ready to build your next big thing?</h2>
          <p style={styles.ctaBannerText}>
            Join thousands of developers launching faster with the FastNextJS boilerplate.
          </p>
          <div style={styles.ctaBannerButtons}>
            <Link href="/sign-up" style={styles.ctaBannerBtn}>
              Start Building Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerBrand}>
            <div style={styles.brandIcon}>⚡</div>
            <span style={styles.brandText}>FastNextJS</span>
          </div>
          <p style={styles.footerCopyright}>
            Made with <span style={{ color: '#ef4444' }}>♥</span> by{' '}
            <a
              href="https://www.youtube.com/@tubeguruji"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.authorLink}
            >
              Tubeguruji
            </a>{' '}
            © {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#09090b',
    color: '#fafafa',
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: 'relative',
    overflowX: 'hidden',
  },
  glowTopLeft: {
    position: 'absolute',
    top: '-150px',
    left: '-150px',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowTopRight: {
    position: 'absolute',
    top: '-150px',
    right: '-150px',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(9, 9, 11, 0.8)',
    borderBottom: '1px solid rgba(39, 39, 42, 0.8)',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    textDecoration: 'none',
    color: '#fafafa',
  },
  brandIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 700,
  },
  brandText: {
    fontSize: '1.2rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  brandVersion: {
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '0.15rem 0.45rem',
    borderRadius: '9999px',
    backgroundColor: '#27272a',
    color: '#38bdf8',
    border: '1px solid #3f3f46',
  },
  navLinks: {
    display: 'flex',
    gap: '1.75rem',
    alignItems: 'center',
  },
  navLink: {
    color: '#a1a1aa',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  navAuth: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  signInBtn: {
    color: '#fafafa',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  getStartedNavBtn: {
    backgroundColor: '#38bdf8',
    color: '#09090b',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 600,
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'opacity 0.2s',
  },
  heroSection: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '5rem 1.5rem 4rem 1.5rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.4rem 1rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(39, 39, 42, 0.6)',
    border: '1px solid #3f3f46',
    fontSize: '0.825rem',
    fontWeight: 500,
    color: '#e4e4e7',
    marginBottom: '2rem',
  },
  badgePulse: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#38bdf8',
    boxShadow: '0 0 8px #38bdf8',
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: '-0.035em',
    margin: '0 0 1.5rem 0',
  },
  gradientText: {
    background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    color: '#a1a1aa',
    lineHeight: 1.6,
    maxWidth: '720px',
    margin: '0 0 2.5rem 0',
  },
  ctaGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '3.5rem',
  },
  primaryCta: {
    padding: '0.85rem 2rem',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #38bdf8, #60a5fa)',
    color: '#09090b',
    fontWeight: 700,
    fontSize: '1rem',
    textDecoration: 'none',
    boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  secondaryCta: {
    padding: '0.85rem 2rem',
    borderRadius: '10px',
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    border: '1px solid #3f3f46',
    color: '#fafafa',
    fontWeight: 600,
    fontSize: '1rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  terminalBox: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    marginBottom: '4rem',
  },
  terminalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0.6rem 1rem',
    backgroundColor: '#121214',
    borderBottom: '1px solid #27272a',
  },
  dotRed: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' },
  dotYellow: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' },
  dotGreen: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' },
  terminalTitle: { marginLeft: 'auto', fontSize: '0.75rem', color: '#71717a' },
  terminalContent: {
    padding: '1rem 1.25rem',
    fontFamily: 'monospace',
    fontSize: '0.925rem',
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    textAlign: 'left',
  },
  terminalPrompt: { color: '#38bdf8', fontWeight: 700 },
  terminalCommand: { color: '#e4e4e7' },
  stackBanner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
  },
  stackLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#71717a',
  },
  stackPills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.6rem',
    justifyContent: 'center',
  },
  stackPill: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#a1a1aa',
    backgroundColor: 'rgba(24, 24, 27, 0.7)',
    border: '1px solid #27272a',
    padding: '0.4rem 0.85rem',
    borderRadius: '9999px',
  },
  featuresSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '5rem 1.5rem',
  },
  sectionHeader: {
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto 3.5rem auto',
  },
  sectionBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#38bdf8',
    marginBottom: '0.5rem',
    display: 'block',
  },
  sectionTitle: {
    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
    fontWeight: 800,
    letterSpacing: '-0.025em',
    margin: '0 0 1rem 0',
  },
  sectionSubtitle: {
    fontSize: '1rem',
    color: '#a1a1aa',
    lineHeight: 1.6,
    margin: 0,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  featureCard: {
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '16px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  featureIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#27272a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginBottom: '1.25rem',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    margin: '0 0 0.75rem 0',
    color: '#fafafa',
  },
  featureDescription: {
    fontSize: '0.9rem',
    color: '#a1a1aa',
    lineHeight: 1.6,
    margin: '0 0 1.5rem 0',
  },
  featureTag: {
    marginTop: 'auto',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    border: '1px solid rgba(56, 189, 248, 0.2)',
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    alignSelf: 'flex-start',
  },
  stepsSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem 5rem 1.5rem',
  },
  stepsCard: {
    backgroundColor: '#121215',
    border: '1px solid #27272a',
    borderRadius: '20px',
    padding: '3rem 2rem',
    textAlign: 'center',
  },
  stepsTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    marginBottom: '2.5rem',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '2rem',
    textAlign: 'left',
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  stepNumber: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#38bdf8',
    color: '#09090b',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
  },
  stepHeading: {
    fontSize: '1.15rem',
    fontWeight: 700,
    margin: 0,
    color: '#fafafa',
  },
  stepText: {
    fontSize: '0.875rem',
    color: '#a1a1aa',
    lineHeight: 1.5,
    margin: 0,
  },
  ctaBannerSection: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 1.5rem 5rem 1.5rem',
  },
  ctaBanner: {
    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    borderRadius: '20px',
    padding: '3.5rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  ctaBannerTitle: {
    fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
    fontWeight: 800,
    margin: 0,
  },
  ctaBannerText: {
    fontSize: '1rem',
    color: '#a1a1aa',
    maxWidth: '550px',
    margin: 0,
  },
  ctaBannerButtons: {
    marginTop: '1rem',
  },
  ctaBannerBtn: {
    backgroundColor: '#38bdf8',
    color: '#09090b',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '0.85rem 2rem',
    borderRadius: '10px',
    textDecoration: 'none',
    boxShadow: '0 10px 20px -5px rgba(56, 189, 248, 0.4)',
  },
  footer: {
    borderTop: '1px solid #27272a',
    backgroundColor: '#09090b',
    padding: '2.5rem 1.5rem',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  footerCopyright: {
    fontSize: '0.875rem',
    color: '#71717a',
    margin: 0,
  },
  authorLink: {
    color: '#a1a1aa',
    textDecoration: 'underline',
  },
};
