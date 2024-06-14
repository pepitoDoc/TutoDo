package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Comment;
import edu.dam.rest.microservice.persistence.model.Guide;
import edu.dam.rest.microservice.persistence.model.Step;
import lombok.*;

import java.util.List;

/**
 * Information object for visualizing a guide.
 *
 * <p>This class represents detailed information about a guide,
 * including its ID, user ID, username, title, description, steps,
 * guide types, ingredients, comments, average rating, user's rating,
 * thumbnail URL, and flags indicating if the guide is rated, completed,
 * or owned by the user.</p>
 *
 * <p>It provides both a builder for creating instances and a constructor that takes
 * an existing {@link Guide} object, username, comments, rating mean, user rating,
 * completion status, rating status, and ownership status to initialize its values.</p>
 *
 * <p>Annotations:</p>
 * <ul>
 *   <li>{@link lombok.Getter @Getter}: Generates getter methods for all fields.</li>
 *   <li>{@link lombok.Setter @Setter}: Generates setter methods for all fields.</li>
 *   <li>{@link lombok.AllArgsConstructor @AllArgsConstructor}: Generates a constructor with parameters for all fields.</li>
 *   <li>{@link lombok.NoArgsConstructor @NoArgsConstructor}: Generates a no-argument constructor.</li>
 *   <li>{@link lombok.Builder @Builder}: Generates a builder for creating instances of this class.</li>
 * </ul>
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GuideVisualizeInfo {

    /**
     * The ID of the guide.
     */
    private String id;

    /**
     * The ID of the user who created the guide.
     */
    private String userId;

    /**
     * The username of the user who created the guide.
     */
    private String username;

    /**
     * The title of the guide.
     */
    private String title;

    /**
     * The description of the guide.
     */
    private String description;

    /**
     * The list of steps in the guide.
     */
    private List<Step> steps;

    /**
     * The types/categories of the guide.
     */
    private List<String> guideTypes;

    /**
     * The list of ingredients for the guide.
     */
    private List<String> ingredients;

    /**
     * The list of comments on the guide.
     */
    private List<Comment> comments;

    /**
     * The average rating of the guide.
     */
    private float ratingMean;

    /**
     * The rating given by the current user (if applicable).
     */
    private int userRating;

    /**
     * The URL of the thumbnail image associated with the guide.
     */
    private String thumbnail;

    /**
     * Indicates if the guide has been rated by the current user.
     */
    private boolean rated;

    /**
     * Indicates if the guide has been completed by the current user.
     */
    private boolean completed;

    /**
     * Indicates if the guide is owned by the current user.
     */
    private boolean ownership;

    /**
     * Constructor for initializing with an existing guide and additional details.
     *
     * @param guide       The existing guide object from which to initialize values.
     * @param username    The username of the user who created the guide.
     * @param userId      The user id of the user who created the guide.
     * @param comments    The list of comments on the guide.
     * @param ratingMean  The average rating of the guide.
     * @param userRating  The rating given by the current user (if applicable).
     * @param completed   Indicates if the guide has been completed by the current user.
     * @param rated       Indicates if the guide has been rated by the current user.
     * @param ownership   Indicates if the guide is owned by the current user.
     */
    public GuideVisualizeInfo(
            Guide guide, String username, String userId, List<Comment> comments, float ratingMean, int userRating,
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
