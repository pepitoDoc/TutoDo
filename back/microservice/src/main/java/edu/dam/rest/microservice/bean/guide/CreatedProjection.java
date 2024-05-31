package edu.dam.rest.microservice.bean.guide;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CreatedProjection {

    private List<String> created;

}
