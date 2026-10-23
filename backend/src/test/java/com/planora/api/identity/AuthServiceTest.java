package com.planora.api.identity;

import com.planora.api.identity.dto.LoginRequest;
import com.planora.api.identity.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserAccountRepository users;
    @Mock
    private RoleRepository roles;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;

    private AuthService service;

    @BeforeEach
    void setUp() {
        service = new AuthService(users, roles, passwordEncoder, jwtService);
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(users.existsByEmailIgnoreCase("ada@planora.example")).thenReturn(true);
        assertThatThrownBy(() -> service.register(
                new RegisterRequest("Ada", "Ada@Planora.example", null, "password1")
        )).isInstanceOf(DuplicateEmailException.class);
    }

    @Test
    void loginRejectsBadPassword() {
        UserAccount user = new UserAccount();
        user.setEmail("ada@planora.example");
        user.setPasswordHash("hashed");
        user.setFullName("Ada");
        when(users.findByEmailIgnoreCase("ada@planora.example")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("nope", "hashed")).thenReturn(false);

        assertThatThrownBy(() -> service.login(new LoginRequest("ada@planora.example", "nope")))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void registerIssuesTokenForClient() {
        Role client = new Role();
        client.setName(PlanoraUserDetails.CLIENT);
        when(users.existsByEmailIgnoreCase("ada@planora.example")).thenReturn(false);
        when(roles.findByName(PlanoraUserDetails.CLIENT)).thenReturn(Optional.of(client));
        when(passwordEncoder.encode("password1")).thenReturn("hashed");
        when(users.save(any(UserAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.issueToken(any())).thenReturn("jwt-token");

        var response = service.register(new RegisterRequest("Ada", "Ada@Planora.example", null, "password1"));
        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.email()).isEqualTo("ada@planora.example");
        assertThat(response.roles()).contains(PlanoraUserDetails.CLIENT);
        assertThat(response.userId()).isNull();
    }
}
