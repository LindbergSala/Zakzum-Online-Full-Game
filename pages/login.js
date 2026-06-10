import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const initialForm = {
  identifier: "",
  password: "",
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function loadCurrentUser() {
    const response = await fetch("/api/auth/me");

    if (!response.ok) {
      setCurrentUser(null);
      return null;
    }

    const data = await response.json();
    setCurrentUser(data.user);
    return data.user;
  }

  function updateField(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setCurrentUser(null);
        setMessage(data.error || "Login failed.");
        return;
      }

      const confirmedUser = await loadCurrentUser();

      setStatus("success");
      setForm(initialForm);
      setMessage(
        confirmedUser
          ? `Session confirmed for ${confirmedUser.username}.`
          : "Login succeeded, but the session could not be confirmed.",
      );
    } catch {
      setStatus("error");
      setCurrentUser(null);
      setMessage("Login failed. Check your connection and try again.");
    }
  }

  async function handleLogout() {
    setStatus("loading");
    setMessage("");

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setCurrentUser(null);
      setStatus("success");
      setMessage("You have left the road for now.");
    } catch {
      setStatus("error");
      setMessage("Logout failed. Check your connection and try again.");
    }
  }

  return (
    <>
      <Head>
        <title>Enter Zakzum | Zakzum Online</title>
        <meta
          name="description"
          content="Log in to Zakzum Online and confirm your current account session."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="auth-page">
        <section className="auth-panel" aria-labelledby="login-title">
          <Link className="text-link" href="/">
            Zakzum Online
          </Link>
          <p className="eyebrow">Account</p>
          <h1 id="login-title">Enter Zakzum</h1>
          <p className="supporting-text">
            Use your email or username to return. The road remembers the account
            that carries your name.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="identifier">
              Email or username
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              value={form.identifier}
              onChange={updateField}
              required
            />
            <p className="field-hint">Identifier can be your email or username.</p>

            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              value={form.password}
              onChange={updateField}
              required
            />

            <button className="primary-button" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Entering..." : "Enter Zakzum"}
            </button>
          </form>

          {message ? (
            <p className={`form-message ${status === "error" ? "error" : "success"}`}>
              {message}
            </p>
          ) : null}

          {currentUser ? (
            <section className="session-panel" aria-labelledby="session-title">
              <h2 id="session-title">Current Session</h2>
              <dl className="session-list">
                <div>
                  <dt>Username</dt>
                  <dd>{currentUser.username}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{currentUser.email}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{currentUser.role}</dd>
                </div>
              </dl>
              <button className="secondary-button" type="button" onClick={handleLogout}>
                Log Out
              </button>
            </section>
          ) : null}

          <p className="auth-switch">
            Need an account?{" "}
            <Link className="text-link" href="/register">
              Create Account
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
