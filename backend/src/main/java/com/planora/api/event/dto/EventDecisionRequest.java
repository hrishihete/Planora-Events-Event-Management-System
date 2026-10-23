package com.planora.api.event.dto;

import jakarta.validation.constraints.NotNull;

public record EventDecisionRequest(@NotNull EventDecision decision) {
}
