package edu.dam.rest.microservice.persistence.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("guide")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Guide {

    @Id
    private String id;
    private String userid;
    private String title;
    private String description;
    private boolean published;
    private String creationDate;
    private List<Step> steps;
    private String guideType;
    private List<String> checkList;
    private List<String> comments;
    private List<Integer> ratings;

}
