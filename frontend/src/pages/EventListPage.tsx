import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, listEvents } from "../api/events";
import { eventTypeLabel, formatDateTime, formatMoney, statusLabel } from "../lib/format";
import type { EventRecord, EventType } from "../types";

const FILTERS: Array<{ id: "ALL" | EventType; label: string }> = [
  { id: "ALL", label: "All Events" },
  { id: "WEDDING", label: "Wedding" },
  { id: "CORPORATE", label: "Corporate" },
  { id: "PRIVATE_PARTY", label: "Private Party" },
  { id: "FESTIVAL", label: "Festival" },
  { id: "CULTURAL", label: "Cultural" },
];

export default function EventListPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [filter, setFilter] = useState<"ALL" | EventType>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listEvents()
      .then((data) => {
        if (!cancelled) {
          setEvents(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Could not load events. Is the API running?");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(
    () => (filter === "ALL" ? events : events.filter((event) => event.eventType === filter)),
    [events, filter],
  );

  return (
    <div>
      <section className="relative overflow-hidden bg-planora-plum">
        <div className="absolute inset-0 bg-gradient-to-r from-planora-plum via-rose-800 to-fuchsia-900 opacity-90" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="font-serif text-4xl italic text-white sm:text-5xl">
            Our Events. Your Vision, Realized.
          </p>
          <p className="mt-4 max-w-xl text-rose-100">
            Crafting unforgettable moments with precision, creativity, and elegance.
          </p>
          <Link
            to="/events/new"
            className="mt-8 inline-block rounded-full bg-planora-rose px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-planora-roseDark"
          >
            Start Planning Your Event
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-4 py-2 text-sm ${
                filter === item.id
                  ? "bg-planora-rose text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading && <p className="mt-8 text-slate-500">Loading event requests…</p>}
        {error && (
          <p className="mt-8 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="mt-12 rounded-2xl border border-slate-100 px-6 py-16 text-center">
            <h2 className="font-serif text-3xl">Ready to Plan Your Event?</h2>
            <p className="mt-2 text-slate-500">
              No requests yet{filter === "ALL" ? "" : ` for ${eventTypeLabel(filter as EventType)}`}. Send details and we
              will start the requirements gathering flow.
            </p>
            <Link
              to="/events/new"
              className="mt-6 inline-block rounded-full bg-planora-rose px-5 py-2 text-sm font-semibold text-white"
            >
              Send Event Request
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="rounded-2xl border border-slate-100 p-5 shadow-sm transition hover:border-rose-200"
            >
              <p className="text-xs uppercase tracking-wide text-planora-rose">{eventTypeLabel(event.eventType)}</p>
              <h2 className="mt-2 font-serif text-2xl">{event.eventName}</h2>
              <p className="mt-1 text-slate-500">{event.location}</p>
              <p className="mt-3 text-sm text-slate-600">{formatDateTime(event.startsAt)}</p>
              <p className="mt-1 text-sm text-slate-600">
                {event.headcount} guests · {formatMoney(event.budgetCents, event.currency)}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {statusLabel(event.status)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
