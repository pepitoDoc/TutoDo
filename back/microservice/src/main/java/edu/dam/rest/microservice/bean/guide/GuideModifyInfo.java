package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Guide;
import lombok.*;

import java.util.List;

/**
 * Information object for modifying a guide.
 *
 * <p>This class represents the information needed to modify attributes of a guide,
 * including its ID, title, description, publication status, types, ingredients,
 * number of steps, and thumbnail URL.</p>
 *
 * <p>It provides both a builder for creating instances and a constructor that takes
 * an existing {@link Guide} object and the number of steps to modify.</p>
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
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GuideModifyInfo {

    /**
     * The ID of the guide.
     */
    private String id;

    /**
     * The title of the guide.
     */
    private String title;

    /**
     * The description of the guide.
     */
    private String description;

    /**
     * Indicates if the guide is published or not.
     */
    private boolean published;

    /**
     * The types/categories of the guide.
     */
    private List<String> guideTypes;

    /**
     * The list of ingredients for the guide.
     */
    private List<String> ingredients;

    /**
     * The number of steps in the guide.
     */
    private int amountSteps;

    /**
     * The URL of the thumbnail image associated with the guide.
     */
    private String thumbnail;

    /**
     * Constructor for initializing with an existing guide and amount of steps.
     *
     * @param guide       The existing guide object from which to initialize values.
     * @param amountSteps The number of steps to set for the modified guide.
     */
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
