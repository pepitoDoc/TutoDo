package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FindByFilterRequest {

    private String username;
    private String title;
    private List<String> guideTypes;
    private Integer rating;

}
