package com.planora.api.event.dto;

import com.planora.api.event.Event;
import com.planora.api.event.EventStatus;
import com.planora.api.event.EventType;

import java.time.OffsetDateTime;
import java.util.UUID;

public record EventResponse(
        UUID id,
        String requesterName,
        String requesterEmail,
        String requesterPhone,
        String eventName,
        EventType eventType,
        OffsetDateTime startsAt,
        String location,
        int headcount,
        long budgetCents,
        String currency,
        String details,
        String specialRequests,
        EventStatus status,
        int version,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public static EventResponse from(Event event) {
        return new EventResponse(
                event.getId(),
                event.getRequesterName(),
                event.getRequesterEmail(),
                event.getRequesterPhone(),
                event.getEventName(),
                event.getEventType(),
                event.getStartsAt(),
                event.getLocation(),
                event.getHeadcount(),
                event.getBudgetCents(),
                event.getCurrency(),
                event.getDetails(),
                event.getSpecialRequests(),
                event.getStatus(),
                event.getVersion(),
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }
}
