package edu.dam.rest.microservice.persistence.model;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Step {

    private String title;
    private String description;

}
