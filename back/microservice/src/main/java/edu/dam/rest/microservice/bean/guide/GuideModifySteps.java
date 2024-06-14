package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Guide;
import edu.dam.rest.microservice.persistence.model.Step;
import lombok.*;

import java.util.List;

/**
 * Information object for modifying steps of a guide.
 *
 * <p>This class represents the information needed to modify the steps of a guide,
 * including its ID, title, and list of steps.</p>
 *
 * <p>It provides both a builder for creating instances and a constructor that takes
 * an existing {@link Guide} object to initialize its values.</p>
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
public class GuideModifySteps {

    /**
     * The ID of the guide.
     */
    private String id;

    /**
     * The title of the guide.
     */
    private String title;

    /**
     * The list of steps in the guide.
     */
    private List<Step> steps;

    /**
     * Constructor for initializing with an existing guide.
     *
     * @param guide The existing guide object from which to initialize values.
     */
    public GuideModifySteps(Guide guide) {
        this.id = guide.getId();
        this.title = guide.getTitle();
        this.steps = guide.getSteps();
    }

}
