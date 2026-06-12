import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCurrentUser } from "../lib/auth/currentUser";

export default function Account({ user }) {
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
        <title>Account | Zakzum Online</title>
        <meta
          name="description"
          content="View your Zakzum Online account foundation before character creation opens."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="auth-page">
        <section className="auth-panel" aria-labelledby="account-title">
          <Link className="text-link" href="/">
            Zakzum Online
          </Link>
          <p className="eyebrow">Protected Account</p>
          <h1 id="account-title">Account</h1>
          <p className="supporting-text">
            The road knows your name now. Your first character has not stepped
            from the dark yet.
          </p>

          <section className="session-panel" aria-labelledby="account-details-title">
            <h2 id="account-details-title">Account Details</h2>
            <dl className="session-list">
              <div>
                <dt>Username</dt>
                <dd>{user.username}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{user.role}</dd>
              </div>
            </dl>
          </section>

          <p className="form-message success">Character creation coming soon.</p>

          <div className="account-actions">
            <Link className="primary-button" href="/dashboard">
              Dashboard
            </Link>
            <Link className="secondary-button" href="/">
              Home
            </Link>
            <button className="secondary-button" type="button" onClick={handleLogout}>
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
