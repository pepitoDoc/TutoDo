package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.time.Instant;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeleteCommentRequest {

    private String guideId;
    private String userId;
    private String username;
    private String text;
    private Instant date;

}
