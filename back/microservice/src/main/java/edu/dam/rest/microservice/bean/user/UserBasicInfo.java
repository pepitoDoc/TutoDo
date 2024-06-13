package edu.dam.rest.microservice.bean.user;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserBasicInfo {

    private String username;
    private String email;
    private List<String> preferences;

}
