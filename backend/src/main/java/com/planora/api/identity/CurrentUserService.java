package com.planora.api.identity;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserService {

    public PlanoraUserDetails requireUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof PlanoraUserDetails user)) {
            throw new UnauthorizedException("Authentication required");
        }
        return user;
    }
}
