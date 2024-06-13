package edu.dam.rest.microservice.persistence.model;

import lombok.*;

import java.time.Instant;

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
