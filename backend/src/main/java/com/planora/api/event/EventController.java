package com.planora.api.event;

import com.planora.api.event.dto.CreateEventRequest;
import com.planora.api.event.dto.EventDecisionRequest;
import com.planora.api.event.dto.EventResponse;
import com.planora.api.event.dto.UpdateEventDetailsRequest;
import com.planora.api.identity.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;
    private final CurrentUserService currentUsers;

    public EventController(EventService eventService, CurrentUserService currentUsers) {
        this.eventService = eventService;
        this.currentUsers = currentUsers;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse create(@Valid @RequestBody CreateEventRequest request) {
        return eventService.create(request, currentUsers.requireUser());
    }

    @GetMapping
    public List<EventResponse> list() {
        return eventService.list(currentUsers.requireUser());
    }

    @GetMapping("/{id}")
    public EventResponse get(@PathVariable UUID id) {
        return eventService.get(id, currentUsers.requireUser());
    }

    @PostMapping("/{id}/request-details")
    public EventResponse requestDetails(@PathVariable UUID id) {
        return eventService.requestDetails(id, currentUsers.requireUser());
    }

    @PatchMapping("/{id}")
    public EventResponse submitDetails(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEventDetailsRequest request
    ) {
        return eventService.submitDetails(id, request, currentUsers.requireUser());
    }

    @PostMapping("/{id}/decision")
    public EventResponse decide(
            @PathVariable UUID id,
            @Valid @RequestBody EventDecisionRequest request
    ) {
        return eventService.decide(id, request, currentUsers.requireUser());
    }
}
