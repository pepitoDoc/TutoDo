package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Guide;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GuideFilterResult {

    private GuideInfo guide;
    private String username;

}
