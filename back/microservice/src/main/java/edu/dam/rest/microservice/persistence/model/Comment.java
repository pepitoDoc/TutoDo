package edu.dam.rest.microservice.persistence.model;

import lombok.*;
import org.springframework.cglib.core.Local;
import org.springframework.data.annotation.Id;

import java.time.Instant;
import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Comment {

    private String userId;
    private String username;
    private String text;
    private Instant date;

}
