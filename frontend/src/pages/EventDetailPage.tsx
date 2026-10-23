import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError, getEvent } from "../api/events";
import { eventTypeLabel, formatDateTime, formatMoney, statusLabel } from "../lib/format";
import type { EventRecord } from "../types";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    getEvent(id)
      .then((data) => {
        if (!cancelled) {
          setEvent(data);
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

  if (error) {
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

  if (!event) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-slate-500">Loading event…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm uppercase tracking-wide text-planora-rose">{eventTypeLabel(event.eventType)}</p>
      <h1 className="mt-2 font-serif text-4xl">{event.eventName}</h1>
      <p className="mt-2 text-slate-500">{statusLabel(event.status)}</p>

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

      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/" className="text-planora-rose">
          All events
        </Link>
        <Link to="/events/new" className="text-planora-rose">
          Send another request
        </Link>
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
