import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Zakzum Online</title>
        <meta
          name="description"
          content="Zakzum Online is a dark fantasy text-based RPG shaped by old wars, dangerous roads, and the shadow of the Lord of Crystals."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="home-page">
        <section className="hero" aria-labelledby="home-title">
          <p className="eyebrow">Text-based RPG</p>
          <h1 id="home-title">Zakzum Online</h1>
          <p className="lead">
            A dark, grounded fantasy world shaped by old wars, dangerous roads,
            broken oaths, and the shadow of the Lord of Crystals.
          </p>
          <p className="supporting-text">
            The Freefolk still endure beneath prophecy and ruin. Your first
            character will begin here when character creation is ready.
          </p>

          <nav className="home-actions" aria-label="Account navigation">
            <Link className="primary-button" href="/register">
              Create Account
            </Link>
            <Link className="secondary-button" href="/login">
              Enter Zakzum
            </Link>
            <Link className="secondary-button" href="/account">
              Account
            </Link>
          </nav>

          <div className="coming-soon" aria-label="Coming soon">
            <span className="coming-soon-label">Begin Journey</span>
            <span className="coming-soon-note">
              Character creation coming soon
            </span>
          </div>
        </section>
      </main>
    </>
  );
}
