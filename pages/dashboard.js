import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCurrentUser } from "../lib/auth/currentUser";

export default function Dashboard({ user }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>Dashboard | Zakzum Online</title>
        <meta
          name="description"
          content="The protected Zakzum Online dashboard shell for future characters and saved progress."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="auth-page">
        <section className="auth-panel" aria-labelledby="dashboard-title">
          <Link className="text-link" href="/">
            Zakzum Online
          </Link>
          <p className="eyebrow">Protected Game Shell</p>
          <h1 id="dashboard-title">Dashboard</h1>
          <p className="supporting-text">
            The road opens from here. Saved progress and surviving names will
            gather in this place.
          </p>
          <p className="lead compact-lead">Welcome, {user.username}.</p>

          <section className="session-panel" aria-labelledby="characters-title">
            <h2 id="characters-title">Characters</h2>
            <p className="empty-state">No characters yet.</p>
            <p className="supporting-text">Character creation coming soon.</p>
          </section>

          <div className="account-actions">
            <Link className="secondary-button" href="/account">
              Account
            </Link>
            <Link className="secondary-button" href="/">
              Home
            </Link>
            <button className="primary-button" type="button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const user = await getCurrentUser(context.req);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}
