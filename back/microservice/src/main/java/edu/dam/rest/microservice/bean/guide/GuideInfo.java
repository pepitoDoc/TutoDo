package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GuideInfo {

    private String id;
    private String userId;
    private String title;
    private String description;
    private boolean published;
    private LocalDateTime creationDate;
    private int amountSteps;
    private List<String> guideTypes;
    private int amountComments;
    private float ratingMean;
    private String thumbnail;

}
