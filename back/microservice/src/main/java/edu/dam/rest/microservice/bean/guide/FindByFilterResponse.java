package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Guide;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FindByFilterResponse {

    private Guide guideFound;
    private String creatorUsername;

}
