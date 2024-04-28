package edu.dam.rest.microservice.bean;

import edu.dam.rest.microservice.persistence.model.User;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserSession implements Serializable {

    private String id;
    private String username;
    private String email;
    private String password;

    public UserSession(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.password = user.getPassword();
    }

}
