package edu.dam.rest.microservice.bean.user;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangePasswordByIdRequest {

    private String oldPassword;
    private String newPassword;

}
