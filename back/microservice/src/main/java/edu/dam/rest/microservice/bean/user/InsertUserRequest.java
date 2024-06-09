package edu.dam.rest.microservice.bean.user;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InsertUserRequest {

    private String username;
    private String email;
    private String password;
    private List<String> preferences;

}
