package edu.dam.rest.microservice.bean.guide;

import lombok.*;

/**
 * Request object for saving or updating a guide step.
 *
 * <p>This class represents the data required to save or update a step in a guide,
 * including its guide ID, title, description, image URL, step index, and save status.</p>
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
public class SaveGuideStepRequest {

    /**
     * The ID of the guide to which the step belongs.
     */
    private String guideId;

    /**
     * The title of the step.
     */
    private String title;

    /**
     * The description of the step.
     */
    private String description;

    /**
     * The image associated with the step.
     */
    private String image;

    /**
     * The index of the step within the guide.
     */
    private int stepIndex;

    /**
     * Indicates if the step is saved or not.
     */
    private boolean saved;
}
