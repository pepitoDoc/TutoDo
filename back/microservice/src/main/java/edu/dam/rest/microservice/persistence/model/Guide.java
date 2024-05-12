package edu.dam.rest.microservice.persistence.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("guide")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Guide {

    @Id
    private String id;
    private String userid;
    private String title;
    private String description;
    private boolean published;
    private String creationDate;
    private List<Step> steps;
    private List<String> guideTypes;
    private List<String> checkList;
    private List<String> comments;
    private List<Rating> ratings;

}
