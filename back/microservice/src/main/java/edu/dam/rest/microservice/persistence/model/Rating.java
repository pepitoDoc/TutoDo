package edu.dam.rest.microservice.persistence.model;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Rating {

    private String userId;
    private int punctuation;

}
