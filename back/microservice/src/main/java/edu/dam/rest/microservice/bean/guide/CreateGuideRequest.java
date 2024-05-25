package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateGuideRequest {

    private String title;
    private String description;
    private List<String> guideTypes;
    private List<String> ingredients;

}
