package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateGuideRequest {

    String title;
    String description;
    List<String> guideTypes;

}
