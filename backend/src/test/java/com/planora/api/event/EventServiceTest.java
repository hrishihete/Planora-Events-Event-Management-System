package com.planora.api.event;

import com.planora.api.event.dto.CreateEventRequest;
import com.planora.api.event.dto.EventDecision;
import com.planora.api.event.dto.EventDecisionRequest;
import com.planora.api.identity.ForbiddenException;
import com.planora.api.identity.PlanoraUserDetails;
import com.planora.api.identity.UserAccount;
import com.planora.api.identity.UserAccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository repository;

    @Mock
    private UserAccountRepository users;

    private EventService service;
    private PlanoraUserDetails client;
    private UserAccount owner;

    @BeforeEach
    void setUp() {
        service = new EventService(repository, users);
        UUID userId = UUID.randomUUID();
        client = new PlanoraUserDetails(
                userId, "ada@planora.example", "hash", "Ada Lovelace", "555-0100", true,
                Set.of(PlanoraUserDetails.CLIENT)
        );
        owner = new UserAccount();
        owner.setEmail("ada@planora.example");
        owner.setFullName("Ada Lovelace");
        lenient().when(users.findById(userId)).thenReturn(Optional.of(owner));
    }

    @Test
    void createNormalizesFieldsAndBindsOwnerFromLogin() {
        when(repository.save(any(Event.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CreateEventRequest request = new CreateEventRequest(
                "  Ada Lovelace  ",
                "someone-else@example.com",
                " 555-0100 ",
                "  Gala Night  ",
                EventType.CORPORATE,
                OffsetDateTime.parse("2030-06-01T18:00:00Z"),
                "  Dallas  ",
                120,
                250000,
                null,
                "  black tie  ",
                "  "
        );

        var response = service.create(request, client);

        ArgumentCaptor<Event> captor = ArgumentCaptor.forClass(Event.class);
        verify(repository).save(captor.capture());
        Event saved = captor.getValue();
        assertThat(saved.getOwner()).isEqualTo(owner);
        assertThat(saved.getRequesterName()).isEqualTo("Ada Lovelace");
        assertThat(saved.getRequesterEmail()).isEqualTo("ada@planora.example");
        assertThat(saved.getEventName()).isEqualTo("Gala Night");
        assertThat(saved.getStatus()).isEqualTo(EventStatus.DRAFT_REQUEST);
        assertThat(response.status()).isEqualTo(EventStatus.DRAFT_REQUEST);
    }

    @Test
    void clientCannotDecide() {
        UUID id = UUID.randomUUID();
        assertThatThrownBy(() -> service.decide(id, new EventDecisionRequest(EventDecision.REJECT), client))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void getThrowsWhenMissing() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.get(id, client))
                .isInstanceOf(EventNotFoundException.class);
    }

    @Test
    void listForClientUsesOwnerQuery() {
        when(repository.findByOwnerIdOrderByCreatedAtDesc(client.getId())).thenReturn(List.of());
        assertThat(service.list(client)).isEmpty();
        verify(repository).findByOwnerIdOrderByCreatedAtDesc(client.getId());
    }

    @Test
    void listForManagerUsesCreatedAtDescending() {
        PlanoraUserDetails manager = new PlanoraUserDetails(
                UUID.randomUUID(), "manager@planora.local", "hash", "Mgr", null, true,
                Set.of(PlanoraUserDetails.EVENT_MANAGER)
        );
        when(repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))).thenReturn(List.of());
        assertThat(service.list(manager)).isEmpty();
        verify(repository).findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
