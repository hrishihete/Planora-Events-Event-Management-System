import { FormEvent, type ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, createEvent, dollarsToCents, toOffsetDateTime } from "../api/events";
import { EVENT_TYPES, type EventType } from "../types";
import { eventTypeLabel } from "../lib/format";

type FormState = {
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  location: string;
  eventType: EventType;
  headcount: string;
  budgetDollars: string;
  details: string;
  specialRequests: string;
};

const INITIAL: FormState = {
  requesterName: "",
  requesterEmail: "",
  requesterPhone: "",
  eventName: "",
  eventDate: "",
  eventTime: "",
  location: "",
  eventType: "WEDDING",
  headcount: "",
  budgetDollars: "",
  details: "",
  specialRequests: "",
};

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      const created = await createEvent({
        requesterName: form.requesterName,
        requesterEmail: form.requesterEmail,
        requesterPhone: form.requesterPhone || undefined,
        eventName: form.eventName,
        eventType: form.eventType,
        startsAt: toOffsetDateTime(form.eventDate, form.eventTime),
        location: form.location,
        headcount: Number(form.headcount),
        budgetCents: dollarsToCents(form.budgetDollars),
        currency: "USD",
        details: form.details || undefined,
        specialRequests: form.specialRequests || undefined,
      });
      navigate(`/events/${created.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.problem.errors ?? {});
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Could not submit the event request.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1.2fr_0.8fr]">
      <section>
        <p className="text-sm uppercase tracking-wide text-planora-rose">Event Request</p>
        <h1 className="mt-2 font-serif text-4xl">Start Planning Your Event</h1>
        <p className="mt-3 text-slate-500">
          Share the date, type, budget, and headcount. An event manager will review this draft request.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
          {error && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800" role="alert">
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your Name" error={fieldErrors.requesterName}>
              <input
                required
                value={form.requesterName}
                onChange={(e) => update("requesterName", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Email Address" error={fieldErrors.requesterEmail}>
              <input
                required
                type="email"
                value={form.requesterEmail}
                onChange={(e) => update("requesterEmail", e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Phone" error={fieldErrors.requesterPhone}>
            <input
              value={form.requesterPhone}
              onChange={(e) => update("requesterPhone", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Event Name" error={fieldErrors.eventName}>
            <input
              required
              value={form.eventName}
              onChange={(e) => update("eventName", e.target.value)}
              className="input"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Event Date" error={fieldErrors.startsAt}>
              <input
                required
                type="date"
                value={form.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Event Time">
              <input
                required
                type="time"
                value={form.eventTime}
                onChange={(e) => update("eventTime", e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Event Location" error={fieldErrors.location}>
            <input
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="input"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type of Event" error={fieldErrors.eventType}>
              <select
                value={form.eventType}
                onChange={(e) => update("eventType", e.target.value as EventType)}
                className="input"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {eventTypeLabel(type)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Number of Attendees" error={fieldErrors.headcount}>
              <input
                required
                min={1}
                type="number"
                value={form.headcount}
                onChange={(e) => update("headcount", e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Budget (USD)" error={fieldErrors.budgetCents}>
            <input
              required
              min={0}
              step="0.01"
              type="number"
              value={form.budgetDollars}
              onChange={(e) => update("budgetDollars", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Event Details" error={fieldErrors.details}>
            <textarea
              rows={3}
              value={form.details}
              onChange={(e) => update("details", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Special Requests" error={fieldErrors.specialRequests}>
            <textarea
              rows={3}
              value={form.specialRequests}
              onChange={(e) => update("specialRequests", e.target.value)}
              className="input"
              placeholder="Pre-wedding dinner, rehearsal, accessibility needs…"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-planora-rose px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-planora-roseDark disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Event Request"}
          </button>
        </form>
      </section>

      <aside className="h-fit rounded-2xl bg-slate-900 p-6 text-white">
        <h2 className="font-serif text-2xl">Request summary</h2>
        <dl className="mt-6 space-y-3 text-sm text-slate-200">
          <div className="flex justify-between gap-4">
            <dt>Type</dt>
            <dd>{eventTypeLabel(form.eventType)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Date</dt>
            <dd>{form.eventDate || "Not selected"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Location</dt>
            <dd className="text-right">{form.location || "Not selected"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Guests</dt>
            <dd>{form.headcount || "—"}</dd>
          </div>
        </dl>
        <p className="mt-8 text-xs text-slate-400">
          Phase 1 captures the request only. Invoices, vendor booking, and AI budgeting are later slices.
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-rose-700">{error}</span>}
    </label>
  );
}
