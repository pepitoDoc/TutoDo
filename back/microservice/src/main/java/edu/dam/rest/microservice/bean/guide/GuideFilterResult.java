package edu.dam.rest.microservice.bean.guide;

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
