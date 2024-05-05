package edu.dam.rest.microservice.bean.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Builder
@Getter
@Setter
public class LoginUserRequest {

    private String userIdentifier;
    private String password;

}
