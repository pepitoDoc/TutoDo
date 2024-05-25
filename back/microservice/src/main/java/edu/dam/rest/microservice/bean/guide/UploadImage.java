package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UploadImage {

    private String title;
    private String description;
    private List<String> guideTypes;
    private List<String> ingredients;

}
