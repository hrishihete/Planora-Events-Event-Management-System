package com.planora.api.event;

import com.planora.api.event.dto.CreateEventRequest;
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
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository repository;

    private EventService service;

    @BeforeEach
    void setUp() {
        service = new EventService(repository);
    }

    @Test
    void createNormalizesFieldsAndDefaultsStatus() {
        when(repository.save(any(Event.class))).thenAnswer(invocation -> {
            Event event = invocation.getArgument(0);
            event.setRequesterName(event.getRequesterName());
            return event;
        });

        CreateEventRequest request = new CreateEventRequest(
                "  Ada Lovelace  ",
                "Ada@Planora.example  ",
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

        var response = service.create(request);

        ArgumentCaptor<Event> captor = ArgumentCaptor.forClass(Event.class);
        verify(repository).save(captor.capture());
        Event saved = captor.getValue();
        assertThat(saved.getRequesterName()).isEqualTo("Ada Lovelace");
        assertThat(saved.getRequesterEmail()).isEqualTo("ada@planora.example");
        assertThat(saved.getRequesterPhone()).isEqualTo("555-0100");
        assertThat(saved.getEventName()).isEqualTo("Gala Night");
        assertThat(saved.getLocation()).isEqualTo("Dallas");
        assertThat(saved.getCurrency()).isEqualTo("USD");
        assertThat(saved.getStatus()).isEqualTo(EventStatus.DRAFT_REQUEST);
        assertThat(saved.getSpecialRequests()).isNull();
        assertThat(response.status()).isEqualTo(EventStatus.DRAFT_REQUEST);
    }

    @Test
    void getThrowsWhenMissing() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.get(id))
                .isInstanceOf(EventNotFoundException.class)
                .hasMessageContaining(id.toString());
    }

    @Test
    void listUsesCreatedAtDescending() {
        when(repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))).thenReturn(List.of());
        assertThat(service.list()).isEmpty();
        verify(repository).findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
