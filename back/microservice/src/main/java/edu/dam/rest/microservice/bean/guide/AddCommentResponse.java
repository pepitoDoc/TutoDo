package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Comment;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddCommentResponse {

    private String result;
    private Comment comment;

}
