package com.planora.api.event.dto;

import com.planora.api.event.EventType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

public record CreateEventRequest(
        @NotBlank @Size(max = 120) String requesterName,
        @NotBlank @Email @Size(max = 255) String requesterEmail,
        @Size(max = 32) String requesterPhone,
        @NotBlank @Size(max = 200) String eventName,
        @NotNull EventType eventType,
        @NotNull @Future OffsetDateTime startsAt,
        @NotBlank @Size(max = 255) String location,
        @Min(1) int headcount,
        @Min(0) long budgetCents,
        @Pattern(regexp = "^[A-Z]{3}$", message = "currency must be a 3-letter ISO code")
        String currency,
        @Size(max = 4000) String details,
        @Size(max = 4000) String specialRequests
) {
}
