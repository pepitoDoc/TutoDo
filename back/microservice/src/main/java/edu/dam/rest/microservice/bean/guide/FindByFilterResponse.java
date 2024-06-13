package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FindByFilterResponse {

    private List<GuideFilterResult> guidesFound;
    private long totalGuides;

}
