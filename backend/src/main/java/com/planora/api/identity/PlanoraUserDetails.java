package com.planora.api.identity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class PlanoraUserDetails implements UserDetails {

    public static final String CLIENT = "CLIENT";
    public static final String EVENT_MANAGER = "EVENT_MANAGER";

    private final UUID id;
    private final String email;
    private final String passwordHash;
    private final String fullName;
    private final String phone;
    private final boolean enabled;
    private final Set<GrantedAuthority> authorities;

    public PlanoraUserDetails(UserAccount user) {
        this(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getFullName(),
                user.getPhone(),
                user.isEnabled(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
        );
    }

    public PlanoraUserDetails(
            UUID id,
            String email,
            String passwordHash,
            String fullName,
            String phone,
            boolean enabled,
            Set<String> roles
    ) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.phone = phone;
        this.enabled = enabled;
        this.authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    public UUID getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public boolean isManager() {
        return authorities.stream().anyMatch(auth -> EVENT_MANAGER.equals(auth.getAuthority()));
    }

    public Set<String> roleNames() {
        return authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
