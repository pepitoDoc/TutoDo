package edu.dam.rest.microservice.bean.user;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangePasswordByEmailRequest {

    private String email;
    private String newPassword;

}
