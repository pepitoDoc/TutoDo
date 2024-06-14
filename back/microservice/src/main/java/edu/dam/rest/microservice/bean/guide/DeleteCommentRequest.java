package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.time.Instant;

/**
 * Request object for deleting a comment.
 *
 * <p>This class represents the data required to delete a comment,
 * including the guide ID, user ID, username, comment text, and deletion date.</p>
 *
 * <p>Annotations:</p>
 * <ul>
 *   <li>{@link lombok.Builder @Builder}: Generates a builder for creating instances of this class.</li>
 *   <li>{@link lombok.Getter @Getter}: Generates getter methods for all fields.</li>
 *   <li>{@link lombok.Setter @Setter}: Generates setter methods for all fields.</li>
 *   <li>{@link lombok.AllArgsConstructor @AllArgsConstructor}: Generates a constructor with parameters for all fields.</li>
 *   <li>{@link lombok.NoArgsConstructor @NoArgsConstructor}: Generates a no-argument constructor.</li>
 * </ul>
 */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeleteCommentRequest {

    /**
     * The ID of the guide from which the comment is to be deleted.
     */
    private String guideId;

    /**
     * The ID of the user who created the comment.
     */
    private String userId;

    /**
     * The username of the user who created the comment.
     */
    private String username;

    /**
     * The text content of the comment to be deleted.
     */
    private String text;

    /**
     * The date and time when the comment was created.
     */
    private Instant date;

}
