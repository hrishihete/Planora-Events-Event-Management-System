package com.planora.api.event;

import com.planora.api.event.dto.CreateEventRequest;
import com.planora.api.event.dto.EventResponse;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository events;

    public EventService(EventRepository events) {
        this.events = events;
    }

    @Transactional
    public EventResponse create(CreateEventRequest request) {
        Event event = new Event();
        event.setRequesterName(request.requesterName().trim());
        event.setRequesterEmail(request.requesterEmail().trim().toLowerCase());
        event.setRequesterPhone(blankToNull(request.requesterPhone()));
        event.setEventName(request.eventName().trim());
        event.setEventType(request.eventType());
        event.setStartsAt(request.startsAt());
        event.setLocation(request.location().trim());
        event.setHeadcount(request.headcount());
        event.setBudgetCents(request.budgetCents());
        event.setCurrency(request.currency() == null || request.currency().isBlank() ? "USD" : request.currency());
        event.setDetails(blankToNull(request.details()));
        event.setSpecialRequests(blankToNull(request.specialRequests()));
        event.setStatus(EventStatus.DRAFT_REQUEST);
        return EventResponse.from(events.save(event));
    }

    @Transactional(readOnly = true)
    public List<EventResponse> list() {
        return events.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(EventResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse get(UUID id) {
        return events.findById(id)
                .map(EventResponse::from)
                .orElseThrow(() -> new EventNotFoundException(id));
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
