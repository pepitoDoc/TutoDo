package edu.dam.rest.microservice.bean.user;

import edu.dam.rest.microservice.persistence.model.User;
import lombok.*;

import java.io.Serializable;
import java.util.List;

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
    private List<String> preferences;

    public UserSession(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.preferences = user.getPreferences();
    }

}
