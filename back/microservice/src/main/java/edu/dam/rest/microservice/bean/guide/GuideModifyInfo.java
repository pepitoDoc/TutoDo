package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Guide;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GuideModifyInfo {

    private String id;
    private String title;
    private String description;
    private boolean published;
    private List<String> guideTypes;
    private List<String> ingredients;
    private int amountSteps;
    private String thumbnail;

    public GuideModifyInfo(Guide guide, int amountSteps) {
        this.id = guide.getId();
        this.title = guide.getTitle();
        this.description = guide.getDescription();
        this.published = guide.isPublished();
        this.guideTypes = guide.getGuideTypes();
        this.ingredients = guide.getIngredients();
        this.thumbnail = guide.getThumbnail();
        this.amountSteps = amountSteps;
    }

}
