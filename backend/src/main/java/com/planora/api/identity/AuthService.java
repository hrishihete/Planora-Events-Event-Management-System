package com.planora.api.identity;

import com.planora.api.identity.dto.AuthResponse;
import com.planora.api.identity.dto.LoginRequest;
import com.planora.api.identity.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserAccountRepository users;
    private final RoleRepository roles;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserAccountRepository users,
            RoleRepository roles,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.users = users;
        this.roles = roles;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            throw new DuplicateEmailException(email);
        }
        Role client = roles.findByName(PlanoraUserDetails.CLIENT)
                .orElseThrow(() -> new IllegalStateException("CLIENT role is missing"));
        UserAccount user = new UserAccount();
        user.setEmail(email);
        user.setFullName(request.fullName().trim());
        user.setPhone(blankToNull(request.phone()));
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.getRoles().add(client);
        UserAccount saved = users.save(user);
        return toAuth(new PlanoraUserDetails(saved));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        UserAccount user = users.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        return toAuth(new PlanoraUserDetails(user));
    }

    public AuthResponse me(PlanoraUserDetails user) {
        return toAuth(user);
    }

    private AuthResponse toAuth(PlanoraUserDetails user) {
        return new AuthResponse(
                jwtService.issueToken(user),
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.roleNames()
        );
    }

    private static String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
