package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Step;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaveGuideStepsRequest {

    private String guideId;
    private List<Step> steps;
    private boolean published;

}
