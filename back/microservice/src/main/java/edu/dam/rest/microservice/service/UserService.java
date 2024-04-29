package edu.dam.rest.microservice.service;

import edu.dam.rest.microservice.bean.InsertUserRequest;
import edu.dam.rest.microservice.bean.LoginUserRequest;
import edu.dam.rest.microservice.bean.UserSession;
import edu.dam.rest.microservice.persistence.model.User;
import edu.dam.rest.microservice.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String insertUser(InsertUserRequest insertUserRequest) {
        var createUser = User.builder()
                .username(insertUserRequest.getUsername())
                .email(insertUserRequest.getEmail())
                .password(insertUserRequest.getPassword())
                .confirmed(false)
                .build();
        String checkUser = this.findUserByNameAndEmail(createUser);
        if (!checkUser.equals("user_valid")) {
            return checkUser;
        } else {
            this.userRepository.save(createUser);
            return "user_registered";
        }
    }

    public UserSession loginUser(LoginUserRequest loginUserRequest) {
        var userFound = this.findUserByNameOrEmail(loginUserRequest.getUserIdentifier());
        if (userFound != null) {
            if (userFound.getPassword().equals(loginUserRequest.getPassword())) {
                return new UserSession(userFound);
            } else {
                return null;
            }
        } else {
            return null;
        }

    }

    public void deleteUser(UserSession userLogged) {
        this.userRepository.deleteById(userLogged.getId());
    }

    public String findUserByNameAndEmail(User user) {
        var usersFound = this.userRepository.findByUsernameOrEmail(user.getUsername(), user.getEmail());
        var sb = new StringBuilder();
        usersFound.forEach( (userFound) -> {
            if (userFound.getUsername().equals(user.getUsername())
                    && userFound.getEmail().equals(user.getEmail())) {
                sb.append("username_takenemail_taken");
            } else if (userFound.getUsername().equals(user.getUsername())) {
                sb.append("username_taken");
            } else if (userFound.getEmail().equals(user.getEmail())) {
                sb.append("email_taken");
            }
        });
        if (sb.toString().length() == 0) {
            sb.append("user_valid");
        }
        return sb.toString();
    }

    public User findUserByNameOrEmail(String userIdentifier) {
        if (userIdentifier.contains("@")) {
            return userRepository.findByEmail(userIdentifier);
        } else {
            return userRepository.findByUsername(userIdentifier);
        }
    }

}
