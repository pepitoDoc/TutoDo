package edu.dam.rest.microservice.bean.guideType;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FindAllGuideTypesResponse {

    public List<String> guideTypes;

}
