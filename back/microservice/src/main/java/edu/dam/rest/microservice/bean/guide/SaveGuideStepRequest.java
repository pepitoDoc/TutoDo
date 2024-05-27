package edu.dam.rest.microservice.bean.guide;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaveGuideStepRequest {

    private String guideId;
    private String title;
    private String description;
    private String image;
    private int stepIndex;
    private boolean saved;

}
