package edu.dam.rest.microservice.bean.guide;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdatePublishedRequest {

    private String guideId;
    private boolean published;

}
