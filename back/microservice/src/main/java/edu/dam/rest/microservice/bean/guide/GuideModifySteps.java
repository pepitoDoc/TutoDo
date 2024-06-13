package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Guide;
import edu.dam.rest.microservice.persistence.model.Step;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GuideModifySteps {

    private String id;
    private String title;
    private List<Step> steps;

    public GuideModifySteps(Guide guide) {
        this.id = guide.getId();
        this.title = guide.getTitle();
        this.steps = guide.getSteps();
    }

}
