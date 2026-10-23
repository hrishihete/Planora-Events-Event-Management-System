package com.planora.api.event;

import com.planora.api.event.dto.CreateEventRequest;
import com.planora.api.event.dto.EventDecision;
import com.planora.api.event.dto.EventDecisionRequest;
import com.planora.api.event.dto.EventResponse;
import com.planora.api.event.dto.UpdateEventDetailsRequest;
import com.planora.api.identity.ForbiddenException;
import com.planora.api.identity.PlanoraUserDetails;
import com.planora.api.identity.UserAccount;
import com.planora.api.identity.UserAccountRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository events;
    private final UserAccountRepository users;

    public EventService(EventRepository events, UserAccountRepository users) {
        this.events = events;
        this.users = users;
    }

    @Transactional
    public EventResponse create(CreateEventRequest request, PlanoraUserDetails actor) {
        UserAccount owner = users.findById(actor.getId())
                .orElseThrow(() -> new ForbiddenException("Unknown account"));
        Event event = new Event();
        event.setOwner(owner);
        event.setRequesterName(request.requesterName().trim());
        event.setRequesterEmail(actor.getUsername());
        event.setRequesterPhone(blankToNull(request.requesterPhone()) != null
                ? blankToNull(request.requesterPhone())
                : blankToNull(actor.getPhone()));
        event.setEventName(request.eventName().trim());
        event.setEventType(request.eventType());
        event.setStartsAt(request.startsAt());
        event.setLocation(request.location().trim());
        event.setHeadcount(request.headcount());
        event.setBudgetCents(request.budgetCents());
        event.setCurrency(
                request.currency() == null || request.currency().isBlank()
                        ? "USD"
                        : request.currency().trim().toUpperCase()
        );
        event.setDetails(blankToNull(request.details()));
        event.setSpecialRequests(blankToNull(request.specialRequests()));
        event.setStatus(EventStatus.DRAFT_REQUEST);
        return EventResponse.from(events.save(event));
    }

    @Transactional(readOnly = true)
    public List<EventResponse> list(PlanoraUserDetails actor) {
        List<Event> found = actor.isManager()
                ? events.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                : events.findByOwnerIdOrderByCreatedAtDesc(actor.getId());
        return found.stream().map(EventResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public EventResponse get(UUID id, PlanoraUserDetails actor) {
        return EventResponse.from(visibleEvent(id, actor));
    }

    @Transactional
    public EventResponse requestDetails(UUID id, PlanoraUserDetails actor) {
        requireManager(actor);
        Event event = events.findById(id).orElseThrow(() -> new EventNotFoundException(id));
        if (event.getStatus() != EventStatus.DRAFT_REQUEST) {
            throw new IllegalEventStateException("Details can only be requested on a draft request");
        }
        event.setStatus(EventStatus.DETAILS_PENDING);
        return EventResponse.from(event);
    }

    @Transactional
    public EventResponse submitDetails(UUID id, UpdateEventDetailsRequest request, PlanoraUserDetails actor) {
        Event event = visibleEvent(id, actor);
        if (actor.isManager()) {
            throw new ForbiddenException("Clients submit extra details");
        }
        if (event.getStatus() != EventStatus.DETAILS_PENDING) {
            throw new IllegalEventStateException("This request is not waiting for details");
        }
        if (request.details() != null) {
            event.setDetails(blankToNull(request.details()));
        }
        if (request.specialRequests() != null) {
            event.setSpecialRequests(blankToNull(request.specialRequests()));
        }
        event.setStatus(EventStatus.DRAFT_REQUEST);
        return EventResponse.from(event);
    }

    @Transactional
    public EventResponse decide(UUID id, EventDecisionRequest request, PlanoraUserDetails actor) {
        requireManager(actor);
        Event event = events.findById(id).orElseThrow(() -> new EventNotFoundException(id));
        if (event.getStatus() != EventStatus.DRAFT_REQUEST && event.getStatus() != EventStatus.DETAILS_PENDING) {
            throw new IllegalEventStateException("This request can no longer be decided");
        }
        event.setStatus(request.decision() == EventDecision.ACCEPT_TO_PLANNING
                ? EventStatus.PLANNING
                : EventStatus.REJECTED);
        return EventResponse.from(event);
    }

    private Event visibleEvent(UUID id, PlanoraUserDetails actor) {
        Event event = events.findById(id).orElseThrow(() -> new EventNotFoundException(id));
        if (!actor.isManager() && (event.getOwner() == null || !event.getOwner().getId().equals(actor.getId()))) {
            throw new ForbiddenException("You cannot view this event");
        }
        return event;
    }

    private static void requireManager(PlanoraUserDetails actor) {
        if (!actor.isManager()) {
            throw new ForbiddenException("Event managers only");
        }
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
