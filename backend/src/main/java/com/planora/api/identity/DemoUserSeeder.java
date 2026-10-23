package com.planora.api.identity;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DemoUserSeeder implements CommandLineRunner {

    private final boolean enabled;
    private final String password;
    private final UserAccountRepository users;
    private final RoleRepository roles;
    private final PasswordEncoder passwordEncoder;

    public DemoUserSeeder(
            @Value("${planora.seed-users}") boolean enabled,
            @Value("${planora.seed-password}") String password,
            UserAccountRepository users,
            RoleRepository roles,
            PasswordEncoder passwordEncoder
    ) {
        this.enabled = enabled;
        this.password = password;
        this.users = users;
        this.roles = roles;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!enabled) {
            return;
        }
        seed("client@planora.local", "Planora Client", PlanoraUserDetails.CLIENT);
        seed("manager@planora.local", "Planora Manager", PlanoraUserDetails.EVENT_MANAGER);
    }

    private void seed(String email, String name, String roleName) {
        if (users.existsByEmailIgnoreCase(email)) {
            return;
        }
        Role role = roles.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("Missing role " + roleName));
        UserAccount user = new UserAccount();
        user.setEmail(email);
        user.setFullName(name);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.getRoles().add(role);
        users.save(user);
    }
}
