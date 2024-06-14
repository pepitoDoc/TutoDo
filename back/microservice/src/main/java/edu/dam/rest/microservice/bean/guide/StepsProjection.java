package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Step;
import lombok.*;

import java.util.List;

/**
 * Projection object for steps.
 *
 * <p>This class represents a MongoDB projection that contains a list of {@link Step} objects.</p>
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
public class StepsProjection {

    /**
     * The list of steps.
     */
    private List<Step> steps;
}
