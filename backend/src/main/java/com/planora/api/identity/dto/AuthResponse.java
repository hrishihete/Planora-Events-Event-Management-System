package com.planora.api.identity.dto;

import java.util.Set;
import java.util.UUID;

public record AuthResponse(
        String token,
        UUID userId,
        String email,
        String fullName,
        Set<String> roles
) {
}
