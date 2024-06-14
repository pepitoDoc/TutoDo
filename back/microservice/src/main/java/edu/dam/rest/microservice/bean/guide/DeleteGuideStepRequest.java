package edu.dam.rest.microservice.bean.guide;

import lombok.*;

/**
 * Request object for deleting a step from a guide.
 *
 * <p>This class represents the data required to delete a step from a guide,
 * including the guide ID and the index of the step to be deleted.</p>
 *
 * <p>Annotations:</p>
 * <ul>
 *   <li>{@link lombok.Builder @Builder}: Generates a builder for creating instances of this class.</li>
 *   <li>{@link lombok.Getter @Getter}: Generates getter methods for all fields.</li>
 *   <li>{@link lombok.Setter @Setter}: Generates setter methods for all fields.</li>
 *   <li>{@link lombok.AllArgsConstructor @AllArgsConstructor}: Generates a constructor with parameters for all fields.</li>
 *   <li>{@link lombok.NoArgsConstructor @NoArgsConstructor}: Generates a no-argument constructor.</li>
 * </ul>
 */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeleteGuideStepRequest {

    /**
     * The ID of the guide from which the step is to be deleted.
     */
    private String guideId;

    /**
     * The index of the step to be deleted from the guide.
     */
    private int stepIndex;

}
