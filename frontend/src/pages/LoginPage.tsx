import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../api/http";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not log in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-4xl">Welcome back</h1>
      <p className="mt-2 text-slate-500">Log in to send or review event requests.</p>
      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        {error && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800" role="alert">
            {error}
          </p>
        )}
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            className="input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-planora-rose px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        New client? <Link to="/register" className="text-planora-rose">Create an account</Link>
      </p>
      <p className="mt-3 text-xs text-slate-400">Demo manager: manager@planora.local / Planora123!</p>
    </div>
  );
}
