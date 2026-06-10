import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const initialForm = {
  email: "",
  username: "",
  password: "",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Account creation failed.");
        return;
      }

      setStatus("success");
      setForm(initialForm);
      setMessage(
        `Account created for ${data.user.username}. You can now enter Zakzum from the login page.`,
      );
    } catch {
      setStatus("error");
      setMessage("Account creation failed. Check your connection and try again.");
    }
  }

  return (
    <>
      <Head>
        <title>Create Account | Zakzum Online</title>
        <meta
          name="description"
          content="Create a Zakzum Online account for the dark fantasy text-based RPG."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="auth-page">
        <section className="auth-panel" aria-labelledby="register-title">
          <Link className="text-link" href="/">
            Zakzum Online
          </Link>
          <p className="eyebrow">Account</p>
          <h1 id="register-title">Create Account</h1>
          <p className="supporting-text">
            Claim a name before the road opens. Character creation comes after
            the account gates are steady.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={updateField}
              required
            />

            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              minLength={3}
              value={form.username}
              onChange={updateField}
              required
            />

            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={form.password}
              onChange={updateField}
              required
            />

            <button className="primary-button" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Creating..." : "Create Account"}
            </button>
          </form>

          {message ? (
            <p className={`form-message ${status === "error" ? "error" : "success"}`}>
              {message}
            </p>
          ) : null}

          <p className="auth-switch">
            Already have an account?{" "}
            <Link className="text-link" href="/login">
              Enter Zakzum
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
