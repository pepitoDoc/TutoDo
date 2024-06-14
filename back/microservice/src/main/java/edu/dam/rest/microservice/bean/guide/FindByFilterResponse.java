package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

/**
 * Response object for finding guides by filter criteria.
 *
 * <p>This class represents the response returned after finding guides
 * based on filter criteria. It includes a list of {@link GuideFilterResult} objects
 * representing the found guides, and the total count of guides matching the criteria.</p>
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
public class FindByFilterResponse {

    /**
     * The list of guides found based on the filter criteria.
     */
    private List<GuideFilterResult> guidesFound;

    /**
     * The total number of guides that match the filter criteria.
     */
    private long totalGuides;

}
