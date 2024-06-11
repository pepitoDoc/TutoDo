package edu.dam.rest.microservice.bean.user;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserPaginationResponse {

    private List<UserSearchData> usersFound;
    private long totalUsers;

}
