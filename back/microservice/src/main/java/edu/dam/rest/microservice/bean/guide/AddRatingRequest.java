package edu.dam.rest.microservice.bean.guide;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddRatingRequest {

    private String guideId;
    private int rating;

}
