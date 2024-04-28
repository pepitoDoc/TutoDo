package edu.dam.rest.microservice.bean;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Builder
@Getter
@Setter
public class UserLoginRequest {

    private String userIdentifier;
    private String password;

}
