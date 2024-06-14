package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

/**
 * Request object for finding guides by filter criteria.
 *
 * <p>This class represents the criteria for finding guides based on
 * username, title, guide types, rating, and page number.</p>
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
public class FindByFilterRequest {

    /**
     * The username to filter guides by.
     */
    private String username;

    /**
     * The title to filter guides by.
     */
    private String title;

    /**
     * The types of guides to filter by.
     */
    private List<String> guideTypes;

    /**
     * The minimum rating to filter guides by.
     */
    private int rating;

    /**
     * The page number of the results to retrieve.
     */
    private int pageNumber;

}
