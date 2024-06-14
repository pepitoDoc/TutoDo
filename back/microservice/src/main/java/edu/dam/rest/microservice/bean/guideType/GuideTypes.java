package edu.dam.rest.microservice.bean.guideType;

import lombok.*;

import java.util.List;

/**
 * Container for guide types.
 *
 * <p>This class represents a container for holding a list of guide types.</p>
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
public class GuideTypes {

    /**
     * The list of guide types.
     */
    public List<String> guideTypes;
}
