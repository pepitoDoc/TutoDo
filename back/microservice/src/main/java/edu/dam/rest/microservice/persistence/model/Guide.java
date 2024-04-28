package edu.dam.rest.microservice.persistence.model;

import edu.dam.rest.microservice.constants.GuideType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("guide")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Guide {

    private String id;
    private String userid;
    private String title;
    private String description;
    private boolean published;
    private List<Step> steps;
    private int guideType;
    private List<String> checkList;
    private List<String> comments;
    private List<Integer> ratings;

}
