package edu.dam.rest.microservice.bean;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InsertUserRequest {

    private String username;
    private String email;
    private String password;

}
