package edu.dam.rest.microservice.persistence.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
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
    private String userId;
    private String title;
    private String description;
    private boolean published;
    private LocalDateTime creationDate;
    private List<Step> steps;
    private List<String> guideTypes;
    private List<String> ingredients;
    private List<Comment> comments;
    private List<Rating> ratings;
    private String thumbnail;

}
