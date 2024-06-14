package edu.dam.rest.microservice.bean.user;

import edu.dam.rest.microservice.persistence.model.User;
import lombok.*;

import java.io.Serializable;
import java.util.List;

/**
 * Serializable session object representing user information.
 *
 * <p>This class represents a serializable session object containing user information,
 * including their ID, username, email, password, and preferences.</p>
 *
 * <p>Annotations:</p>
 * <ul>
 *   <li>{@link lombok.Getter @Getter}: Generates getter methods for all fields.</li>
 *   <li>{@link lombok.Setter @Setter}: Generates setter methods for all fields.</li>
 *   <li>{@link lombok.AllArgsConstructor @AllArgsConstructor}: Generates a constructor with parameters for all fields.</li>
 *   <li>{@link lombok.NoArgsConstructor @NoArgsConstructor}: Generates a no-argument constructor.</li>
 *   <li>{@link lombok.Builder @Builder}: Generates a builder for creating instances of this class.</li>
 *   <li>{@link java.io.Serializable}: Implements the Serializable interface for object serialization.</li>
 * </ul>
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSession implements Serializable {

    /**
     * The ID of the user.
     */
    private String id;

    /**
     * The username of the user.
     */
    private String username;

    /**
     * The email address of the user.
     */
    private String email;

    /**
     * The password of the user.
     */
    private String password;

    /**
     * The preferences or interests of the user, represented as a list of strings.
     */
    private List<String> preferences;

    /**
     * Constructor to create a UserSession object from a User instance.
     *
     * @param user The User object from which to initialize the UserSession.
     */
    public UserSession(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.preferences = user.getPreferences();
    }
}