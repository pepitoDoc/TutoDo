package edu.dam.rest.microservice.persistence.model;

import lombok.*;
import org.bson.types.ObjectId;
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
    private List<Progress> progress;
    private List<String> creating;

}
