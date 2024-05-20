package edu.dam.rest.microservice.bean.guide;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddCommentRequest {

    private String guideId;
    private String comment;

}
