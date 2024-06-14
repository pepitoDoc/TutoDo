package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Comment;
import lombok.*;

/**
 * Response object for adding a comment.
 *
 * <p>This class represents the response returned after adding a comment
 * to a specific guide. It includes the result of the operation and the added comment.</p>
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
public class AddCommentResponse {

    /**
     * The result of the add comment operation.
     */
    private String result;

    /**
     * The comment that was added.
     */
    private Comment comment;

}
