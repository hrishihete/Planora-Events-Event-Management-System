package com.planora.api.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.planora.api.error.ApiExceptionHandler;
import com.planora.api.event.dto.CreateEventRequest;
import com.planora.api.event.dto.EventResponse;
import com.planora.api.identity.CurrentUserService;
import com.planora.api.identity.PlanoraUserDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EventController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(ApiExceptionHandler.class)
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EventService eventService;

    @MockBean
    private CurrentUserService currentUsers;

    private final PlanoraUserDetails client = new PlanoraUserDetails(
            UUID.randomUUID(),
            "ada@planora.example",
            "hash",
            "Ada",
            null,
            true,
            Set.of(PlanoraUserDetails.CLIENT)
    );

    @BeforeEach
    void actor() {
        when(currentUsers.requireUser()).thenReturn(client);
    }

    @Test
    void createRejectsPastDatesAndMissingName() throws Exception {
        CreateEventRequest request = new CreateEventRequest(
                "Ada",
                "ada@planora.example",
                null,
                "",
                EventType.WEDDING,
                OffsetDateTime.parse("2020-01-01T00:00:00Z"),
                "Austin",
                50,
                1000,
                "USD",
                null,
                null
        );

        mockMvc.perform(post("/api/v1/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Validation failed"))
                .andExpect(jsonPath("$.errors.eventName").exists())
                .andExpect(jsonPath("$.errors.startsAt").exists());
    }

    @Test
    void getReturns404ForUnknownEvent() throws Exception {
        UUID id = UUID.randomUUID();
        when(eventService.get(eq(id), any())).thenThrow(new EventNotFoundException(id));

        mockMvc.perform(get("/api/v1/events/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Event not found"));
    }

    @Test
    void listReturnsEvents() throws Exception {
        UUID id = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.parse("2030-01-01T00:00:00Z");
        when(eventService.list(any())).thenReturn(List.of(
                new EventResponse(
                        id, client.getId(), "Ada", "ada@planora.example", null, "Gala", EventType.CORPORATE,
                        now, "Dallas", 10, 5000, "USD", null, null,
                        EventStatus.DRAFT_REQUEST, 0, now, now
                )
        ));

        mockMvc.perform(get("/api/v1/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(id.toString()))
                .andExpect(jsonPath("$[0].eventName").value("Gala"));
    }

    @Test
    void createReturns201() throws Exception {
        OffsetDateTime starts = OffsetDateTime.parse("2030-06-01T18:00:00Z");
        CreateEventRequest request = new CreateEventRequest(
                "Ada", "ada@planora.example", null, "Gala", EventType.CORPORATE,
                starts, "Dallas", 10, 5000, "USD", null, null
        );
        UUID id = UUID.randomUUID();
        when(eventService.create(any(), any())).thenReturn(
                new EventResponse(
                        id, client.getId(), "Ada", "ada@planora.example", null, "Gala", EventType.CORPORATE,
                        starts, "Dallas", 10, 5000, "USD", null, null,
                        EventStatus.DRAFT_REQUEST, 0, starts, starts
                )
        );

        mockMvc.perform(post("/api/v1/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.status").value("DRAFT_REQUEST"));
    }
}
