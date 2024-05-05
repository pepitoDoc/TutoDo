package edu.dam.rest.microservice.persistence.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("guideType")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GuideType {

    @Id
    private String id;
    private String type;

}
