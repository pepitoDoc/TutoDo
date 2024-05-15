package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaveGuideInfoRequest {

    private String guideId;
    private String title;
    private String description;
    private List<String> guideTypes;

}
