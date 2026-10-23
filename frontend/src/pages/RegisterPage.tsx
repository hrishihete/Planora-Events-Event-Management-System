import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/http";
import { useAuth } from "../auth/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({ fullName, email, phone: phone || undefined, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not register.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-4xl">Create your account</h1>
      <p className="mt-2 text-slate-500">Self-service registration is for clients. Event managers are seeded internally.</p>
      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        {error && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800" role="alert">
            {error}
          </p>
        )}
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Full name</span>
          <input className="input" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Phone</span>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password (8+ characters)</span>
          <input
            className="input"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-planora-rose px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Register"}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        Already have an account? <Link to="/login" className="text-planora-rose">Log in</Link>
      </p>
    </div>
  );
}
