package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

/**
 * Response object for paginated guide retrieval.
 *
 * <p>This class represents the response returned when retrieving a paginated list of guides.
 * It includes the total number of guides available and the list of {@link GuideInfo} objects
 * representing the guides retrieved for the current page.</p>
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
public class GuidePaginationResponse {

    /**
     * The total number of guides available.
     */
    private long totalGuides;

    /**
     * The list of guides retrieved for the current page.
     */
    private List<GuideInfo> guidesRetrieved;
}
