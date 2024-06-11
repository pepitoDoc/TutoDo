package edu.dam.rest.microservice.bean.user;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangePasswordRequest {

    private String email;
    private String newPassword;

}
