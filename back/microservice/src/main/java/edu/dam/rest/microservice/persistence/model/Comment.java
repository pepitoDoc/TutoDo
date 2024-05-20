package edu.dam.rest.microservice.persistence.model;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Comment {

    private String userId;
    private String comment;

}
