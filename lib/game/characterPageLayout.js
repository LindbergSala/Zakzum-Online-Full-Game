import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  getCharacterPageLinks,
  getLocationDisplayName,
} from "./characterPageHelpers";

function getCurrentPath(asPath) {
  return typeof asPath === "string" ? asPath.split("?")[0] : "";
}

export default function CharacterPageLayout({
  character,
  pageTitle,
  description,
  summaryText,
  children,
}) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = getCharacterPageLinks(character.id);
  const currentPath = getCurrentPath(router.asPath);
  const defaultSummaryText = `${character.race} ${character.characterClass} at ${getLocationDisplayName(character.currentLocation)}.`;

  return (
    <>
      <Head>
        <title>{`${pageTitle} | ${character.name} | Zakzum Online`}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="game-page">
        <section className="game-shell" aria-labelledby="character-title">
          <div className="game-shell-topbar">
            <div className="game-shell-heading">
              <Link className="text-link" href="/dashboard">
                Back to Dashboard
              </Link>
              <p className="eyebrow">{pageTitle}</p>
              <h1 id="character-title">{character.name}</h1>
              <p className="supporting-text">{summaryText || defaultSummaryText}</p>
              <p className="supporting-text">{description}</p>
            </div>

            <button
              aria-controls="character-page-nav"
              aria-expanded={isMenuOpen}
              className="game-shell-nav-toggle"
              onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
              type="button"
            >
              {isMenuOpen ? "Close Menu" : "Open Menu"}
            </button>
          </div>

          <nav
            aria-label="Character pages"
            className={`game-shell-nav ${isMenuOpen ? "is-open" : ""}`}
            id="character-page-nav"
          >
            <div className="game-shell-nav-list">
              {navItems.map((item) => {
                const isActive = currentPath === item.href;

                return (
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`game-shell-nav-link ${isActive ? "is-active" : ""}`}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="game-shell-content">{children}</div>

          <div className="account-actions">
            <Link className="primary-button" href="/dashboard">
              Dashboard
            </Link>
            <Link className="secondary-button" href="/account">
              Account
            </Link>
            <Link className="secondary-button" href="/">
              Home
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}