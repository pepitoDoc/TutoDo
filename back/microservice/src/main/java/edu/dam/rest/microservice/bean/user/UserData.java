package edu.dam.rest.microservice.bean.user;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserData {

    private String id;
    private String username;
    private List<String> saved;
    private List<String> created;
    private List<String> preferences;

}
