package edu.dam.rest.microservice.bean.user;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserSearchData {

    private String id;
    private String username;
    private List<String> created;
    private List<String> saved;
    private List<String> preferences;


}
