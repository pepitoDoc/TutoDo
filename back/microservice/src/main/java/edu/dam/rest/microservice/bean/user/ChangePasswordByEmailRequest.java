package edu.dam.rest.microservice.bean.user;

import lombok.*;

/**
 * Request object for changing password by email.
 *
 * <p>This class represents the data required to change a user's password by email,
 * including the user's email address and the new password.</p>
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
public class ChangePasswordByEmailRequest {

    /**
     * The email address of the user.
     */
    private String email;

    /**
     * The new password to set for the user.
     */
    private String newPassword;
}
