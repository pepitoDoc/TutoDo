package edu.dam.rest.microservice.bean.user;

import lombok.*;

/**
 * Request object for user login.
 *
 * <p>This class represents the data required for a user to authenticate and login,
 * including the user's email address and password.</p>
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
public class LoginUserRequest {

    /**
     * The email address of the user trying to login.
     */
    private String email;

    /**
     * The password of the user trying to login.
     */
    private String password;
}
