package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

/**
 * Projection object for obtaining the IDs of guides that were created by an user.
 *
 * <p>This class represents a MongoDB projection that contains a list of IDs of guides that were created by an user.</p>
 *
 * <p>Annotations:</p>
 * <ul>
 *   <li>{@link lombok.AllArgsConstructor @AllArgsConstructor}: Generates a constructor with parameters for all fields.</li>
 *   <li>{@link lombok.NoArgsConstructor @NoArgsConstructor}: Generates a no-argument constructor.</li>
 *   <li>{@link lombok.Getter @Getter}: Generates getter methods for all fields.</li>
 *   <li>{@link lombok.Setter @Setter}: Generates setter methods for all fields.</li>
 *   <li>{@link lombok.Builder @Builder}: Generates a builder for creating instances of this class.</li>
 * </ul>
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CreatedProjection {

    /**
     * The list of IDs of created guides.
     */
    private List<String> created;

}