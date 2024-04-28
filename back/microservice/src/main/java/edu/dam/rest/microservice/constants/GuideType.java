package edu.dam.rest.microservice.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum GuideType {

    COCINA(1, "cocina"),
    INFORMATICA(2, "informatica");

    private int code;
    private String name;

}
