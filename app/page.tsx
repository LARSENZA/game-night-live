"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createRoom() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/rooms", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create room");
      localStorage.setItem(`host-token:${data.code}`, data.hostToken);
      router.push(`/host/${data.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create room");
    } finally {
      setLoading(false);
    }
  }

  function joinDisplay() {
    const room = code.trim().toUpperCase();
    if (room.length !== 6)
      return setError("Enter the six-character room code.");
    router.push(`/display/${room}`);
  }

  return (
    <main className="landing-shell">
      <section className="landing-card">
        <div className="eyebrow">One screen · Host controlled</div>
        <h1>
          GAME <span>NIGHT</span> ZA
        </h1>
        <p className="lead">
          Open the game, share this browser window, and run all seven team games
          from the same screen—on phone or PC.
        </p>
        <div className="landing-actions">
          <button
            className="primary-action"
            onClick={createRoom}
            disabled={loading}
          >
            {loading ? "Starting…" : "Start game · host & share"}
          </button>
          <p className="quick-note">
            No second monitor or player login needed.
          </p>
          <details className="optional-display">
            <summary>Optional: use a second display</summary>
            <div className="join-row">
              <input
                aria-label="Room code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ROOM CODE"
                onKeyDown={(e) => e.key === "Enter" && joinDisplay()}
              />
              <button onClick={joinDisplay}>Open display</button>
            </div>
          </details>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="feature-strip">
          <span>2 teams</span>
          <span>7 games</span>
          <span>No player accounts</span>
          <span>Live score sync</span>
        </div>
      </section>
    </main>
  );
}
