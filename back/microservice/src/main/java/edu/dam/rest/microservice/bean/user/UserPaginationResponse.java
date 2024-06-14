package edu.dam.rest.microservice.bean.user;

import lombok.*;

import java.util.List;

/**
 * Pagination response object for user search results.
 *
 * <p>This class represents a pagination response containing a list of {@link UserSearchData} objects
 * representing users found in a search, and the total count of users.</p>
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
public class UserPaginationResponse {

    /**
     * The list of users found in the search.
     */
    private List<UserSearchData> usersFound;

    /**
     * The total number of users that match the search criteria.
     */
    private long totalUsers;
}
