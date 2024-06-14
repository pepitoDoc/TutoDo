package edu.dam.rest.microservice.bean.guide;

import lombok.*;

/**
 * Request object for adding a comment.
 *
 * <p>This class represents the data required to add a comment
 * to a specific guide. It includes the guide ID and the comment content.</p>
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
public class AddCommentRequest {

    /**
     * The ID of the guide to which the comment is to be added.
     */
    private String guideId;
    /**
     * The content of the comment to be added.
     */
    private String comment;

}
