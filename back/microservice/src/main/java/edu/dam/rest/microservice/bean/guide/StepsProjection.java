package edu.dam.rest.microservice.bean.guide;

import edu.dam.rest.microservice.persistence.model.Step;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StepsProjection {

    private List<Step> steps;

}
