package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

/**
 * Request object for creating a guide.
 *
 * <p>This class represents the data required to create a guide. It includes the title,
 * description, types of guide, and list of ingredients.</p>
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
public class CreateGuideRequest {

    /**
     * The title of the guide.
     */
    private String title;

    /**
     * The description of the guide.
     */
    private String description;

    /**
     * The types of the guide.
     */
    private List<String> guideTypes;

    /**
     * The ingredients needed for the guide.
     */
    private List<String> ingredients;
}