package edu.dam.rest.microservice.bean.user;

import lombok.*;

import java.util.List;

/**
 * Request object for inserting a new user.
 *
 * <p>This class represents the data required to insert a new user into the system,
 * including the username, email, password, and preferences.</p>
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
public class InsertUserRequest {

    /**
     * The username of the new user.
     */
    private String username;

    /**
     * The email address of the new user.
     */
    private String email;

    /**
     * The password of the new user.
     */
    private String password;

    /**
     * The list of preferences for the new user.
     */
    private List<String> preferences;
}
