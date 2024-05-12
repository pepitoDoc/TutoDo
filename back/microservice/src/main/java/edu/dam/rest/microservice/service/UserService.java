package edu.dam.rest.microservice.service;

import edu.dam.rest.microservice.bean.user.InsertUserRequest;
import edu.dam.rest.microservice.bean.user.LoginUserRequest;
import edu.dam.rest.microservice.bean.user.UserSession;
import edu.dam.rest.microservice.persistence.model.User;
import edu.dam.rest.microservice.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

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
                .completed(new ArrayList<>())
                .progress(new ArrayList<>())
                .creating(new ArrayList<>())
                .build();
        String checkUser = this.findUserByNameAndEmail(createUser);
        if (!checkUser.equals("user_valid")) {
            return checkUser;
        } else {
            var dbCheck = this.userRepository.save(createUser);
            if (this.userRepository.existsById(dbCheck.getId())) {
                return "user_registered";
            } else {
                return "error_registering_user";
            }
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

    public String updateUserCreating(String userId, String guideId) {
        var result = this.userRepository.findById(userId);
        if (result.isPresent()) {
            var user = result.orElseThrow();
            var creating = user.getCreating();
            creating.add(guideId);
            user.setCreating(creating);
            var dbCheck = this.userRepository.save(user);
            if (dbCheck.getCreating() == creating) {
                return "guides_updated";
            } else {
                return "guides_not_updated";
            }
        } else {
            return "user_does_not_exist";
        }
    }

}
