package edu.dam.rest.microservice.bean.guide;

import lombok.*;

/**
 * Result object representing a filtered guide.
 *
 * <p>This class represents a result of filtering guides. It includes
 * the {@link GuideInfo} object containing detailed information about the guide,
 * and the username of the user associated with the guide.</p>
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
public class GuideFilterResult {

    /**
     * The detailed information about the guide.
     */
    private GuideInfo guide;

    /**
     * The username of the user associated with the guide.
     */
    private String username;

}
