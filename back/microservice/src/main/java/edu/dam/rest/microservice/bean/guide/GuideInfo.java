package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Information object representing a guide.
 *
 * <p>This class represents detailed information about a guide,
 * including its ID, user ID, title, description, publication status,
 * creation date, number of steps, types, comments count, average rating,
 * and thumbnail.</p>
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
public class GuideInfo {

    /**
     * The ID of the guide.
     */
    private String id;

    /**
     * The ID of the user who created the guide.
     */
    private String userId;

    /**
     * The title of the guide.
     */
    private String title;

    /**
     * The description of the guide.
     */
    private String description;

    /**
     * Indicates if the guide is published or not.
     */
    private boolean published;

    /**
     * The date and time when the guide was created.
     */
    private LocalDateTime creationDate;

    /**
     * The number of steps in the guide.
     */
    private int amountSteps;

    /**
     * The types/categories of the guide.
     */
    private List<String> guideTypes;

    /**
     * The number of comments on the guide.
     */
    private int amountComments;

    /**
     * The average rating of the guide.
     */
    private float ratingMean;

    /**
     * The URL of the thumbnail image associated with the guide.
     */
    private String thumbnail;

}
