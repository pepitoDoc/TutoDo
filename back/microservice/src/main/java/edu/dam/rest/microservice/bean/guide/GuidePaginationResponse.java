package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Guide;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GuidePaginationResponse {

    private long totalGuides;
    private List<GuideInfo> guidesRetrieved;

}
