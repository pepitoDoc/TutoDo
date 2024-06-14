package edu.dam.rest.microservice.bean.guide;

import lombok.*;

/**
 * Request object for updating the published status of a guide.
 *
 * <p>This class represents the data required to update the published status of a guide,
 * including its ID and the new published status.</p>
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
public class UpdatePublishedRequest {

    /**
     * The ID of the guide whose published status is to be updated.
     */
    private String guideId;

    /**
     * The new published status to set for the guide.
     */
    private boolean published;
}
