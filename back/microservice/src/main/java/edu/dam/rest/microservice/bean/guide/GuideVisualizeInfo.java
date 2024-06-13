package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Comment;
import edu.dam.rest.microservice.persistence.model.Guide;
import edu.dam.rest.microservice.persistence.model.Step;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GuideVisualizeInfo {

    private String id;
    private String userId;
    private String username;
    private String title;
    private String description;
    private List<Step> steps;
    private List<String> guideTypes;
    private List<String> ingredients;
    private List<Comment> comments;
    private float ratingMean;
    private int userRating;
    private String thumbnail;
    private boolean rated;
    private boolean completed;
    private boolean ownership;

    public GuideVisualizeInfo(
            Guide guide, String username, List<Comment> comments, float ratingMean, int userRating,
            boolean completed, boolean rated, boolean ownership) {
        this.id = guide.getId();
        this.userId = guide.getId();
        this.username = username;
        this.title = guide.getTitle();
        this.description = guide.getDescription();
        this.steps = guide.getSteps();
        this.guideTypes = guide.getGuideTypes();
        this.ingredients = guide.getIngredients();
        this.comments = comments;
        this.ratingMean = ratingMean;
        this.thumbnail = guide.getThumbnail();
        this.rated = rated;
        this.userRating = userRating;
        this.completed = completed;
        this.ownership = ownership;
    }

}
