package edu.dam.rest.microservice.persistence.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("user")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class User {

    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private boolean confirmed;
    private List<String> completed;
    private List<String> saved;
    private List<String> created;
    private List<String> preferences;

}
