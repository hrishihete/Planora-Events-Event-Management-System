import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError, decideEvent, getEvent, requestEventDetails, submitEventDetails } from "../api/events";
import { useAuth } from "../auth/AuthContext";
import { eventTypeLabel, formatDateTime, formatMoney, statusLabel } from "../lib/format";
import type { EventRecord } from "../types";

export default function EventDetailPage() {
  const { id } = useParams();
  const { isManager } = useAuth();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    getEvent(id)
      .then((data) => {
        if (!cancelled) {
          setEvent(data);
          setDetails(data.details ?? "");
          setSpecialRequests(data.specialRequests ?? "");
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Could not load this event.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function run(action: () => Promise<EventRecord>) {
    setBusy(true);
    setError(null);
    try {
      const updated = await action();
      setEvent(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That action failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmitDetails(formEvent: FormEvent) {
    formEvent.preventDefault();
    if (!id) {
      return;
    }
    await run(() => submitEventDetails(id, { details, specialRequests }));
  }

  if (error && !event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800" role="alert">
          {error}
        </p>
        <Link to="/" className="mt-6 inline-block text-planora-rose">
          Back to events
        </Link>
      </div>
    );
  }

  if (!event || !id) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-slate-500">Loading event…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm uppercase tracking-wide text-planora-rose">{eventTypeLabel(event.eventType)}</p>
      <h1 className="mt-2 font-serif text-4xl">{event.eventName}</h1>
      <p className="mt-2 text-slate-500">{statusLabel(event.status)}</p>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800" role="alert">
          {error}
        </p>
      )}

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <Item label="When" value={formatDateTime(event.startsAt)} />
        <Item label="Where" value={event.location} />
        <Item label="Guests" value={String(event.headcount)} />
        <Item label="Budget" value={formatMoney(event.budgetCents, event.currency)} />
        <Item label="Requester" value={`${event.requesterName} · ${event.requesterEmail}`} />
        <Item label="Phone" value={event.requesterPhone ?? "—"} />
      </dl>

      {event.details && (
        <section className="mt-8">
          <h2 className="font-serif text-2xl">Details</h2>
          <p className="mt-2 whitespace-pre-wrap text-slate-600">{event.details}</p>
        </section>
      )}
      {event.specialRequests && (
        <section className="mt-8">
          <h2 className="font-serif text-2xl">Special requests</h2>
          <p className="mt-2 whitespace-pre-wrap text-slate-600">{event.specialRequests}</p>
        </section>
      )}

      {isManager && (event.status === "DRAFT_REQUEST" || event.status === "DETAILS_PENDING") && (
        <div className="mt-10 flex flex-wrap gap-3">
          {event.status === "DRAFT_REQUEST" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => requestEventDetails(id))}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm"
            >
              Request more details
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => decideEvent(id, "ACCEPT_TO_PLANNING"))}
            className="rounded-full bg-planora-rose px-5 py-2 text-sm text-white"
          >
            Accept into planning
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => decideEvent(id, "REJECT"))}
            className="rounded-full border border-rose-300 px-5 py-2 text-sm text-rose-700"
          >
            Reject
          </button>
        </div>
      )}

      {!isManager && event.status === "DETAILS_PENDING" && (
        <form className="mt-10 space-y-4" onSubmit={onSubmitDetails}>
          <h2 className="font-serif text-2xl">The planner asked for more details</h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Details</span>
            <textarea className="input" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Special requests</span>
            <textarea
              className="input"
              rows={3}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-planora-rose px-5 py-2 text-sm text-white"
          >
            Send details
          </button>
        </form>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/" className="text-planora-rose">
          All events
        </Link>
        {!isManager && (
          <Link to="/events/new" className="text-planora-rose">
            Send another request
          </Link>
        )}
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-slate-800">{value}</dd>
    </div>
  );
}
