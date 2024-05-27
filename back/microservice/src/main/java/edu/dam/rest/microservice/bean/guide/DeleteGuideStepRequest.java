package edu.dam.rest.microservice.bean.guide;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeleteGuideStepRequest {

    private String guideId;
    private int stepIndex;

}
