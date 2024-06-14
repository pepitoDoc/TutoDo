package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

/**
 * Request object for saving guide information.
 *
 * <p>This class represents the data required to save or update guide information,
 * including its ID, title, description, guide types, ingredients, and publication status.</p>
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
public class SaveGuideInfoRequest {

    /**
     * The ID of the guide.
     */
    private String guideId;

    /**
     * The title of the guide.
     */
    private String title;

    /**
     * The description of the guide.
     */
    private String description;

    /**
     * The types/categories of the guide.
     */
    private List<String> guideTypes;

    /**
     * The list of ingredients for the guide.
     */
    private List<String> ingredients;

    /**
     * Indicates if the guide is published or not.
     */
    private boolean published;
}
