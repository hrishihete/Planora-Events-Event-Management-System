package com.planora.api.event.dto;

import jakarta.validation.constraints.Size;

public record UpdateEventDetailsRequest(
        @Size(max = 4000) String details,
        @Size(max = 4000) String specialRequests
) {
}
