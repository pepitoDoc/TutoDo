package edu.dam.rest.microservice.bean.user;

import lombok.*;

import java.util.List;

/**
 * Data structure representing user information.
 *
 * <p>This class encapsulates various data related to a user,
 * including their ID, username, lists of saved and created items, and preferences.</p>
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
public class UserData {

    /**
     * The ID of the user.
     */
    private String id;

    /**
     * The username of the user.
     */
    private String username;

    /**
     * The list of IDs of items saved by the user.
     */
    private List<String> saved;

    /**
     * The list of IDs of items created by the user.
     */
    private List<String> created;

    /**
     * The preferences or interests of the user, represented as a list of strings.
     */
    private List<String> preferences;
}
