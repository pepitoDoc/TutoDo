package edu.dam.rest.microservice.service;

import edu.dam.rest.microservice.bean.user.InsertUserRequest;
import edu.dam.rest.microservice.bean.user.LoginUserRequest;
import edu.dam.rest.microservice.bean.user.UserSession;
import edu.dam.rest.microservice.constants.Constants;
import edu.dam.rest.microservice.bean.guide.CreatedProjection;
import edu.dam.rest.microservice.persistence.model.User;
import edu.dam.rest.microservice.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;


    @Autowired
    public UserService(UserRepository userRepository, MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
        this.userRepository = userRepository;
    }

    public String create(InsertUserRequest insertUserRequest) {
        var createUser = User.builder()
                .username(insertUserRequest.getUsername())
                .email(insertUserRequest.getEmail())
                .password(insertUserRequest.getPassword())
                .confirmed(false)
                .completed(new ArrayList<>())
                .saved(new ArrayList<>())
                .created(new ArrayList<>())
                .build();
        String checkUser = this.findByNameAndEmail(createUser);
        if (!checkUser.equals("user_valid")) {
            return checkUser;
        } else {
            var dbCheck = this.userRepository.save(createUser);
            if (this.userRepository.existsById(dbCheck.getId())) {
                return "operation_successful";
            } else {
                return "operation_unsuccessful";
            }
        }

    }

    public UserSession login(LoginUserRequest loginUserRequest) {
        var foundUser = this.userRepository.findByEmail(loginUserRequest.getEmail());
        if (foundUser != null) {
            if (foundUser.getPassword().equals(loginUserRequest.getPassword())) {
                return new UserSession(foundUser);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    public void delete(UserSession userLogged) {
        this.userRepository.deleteById(userLogged.getId());
    }

    public String findByNameAndEmail(User user) {
        var foundUsers = this.userRepository.findByUsernameOrEmail(user.getUsername(), user.getEmail());
        var sb = new StringBuilder();
        foundUsers.forEach( (foundUser) -> {
            if (foundUser.getUsername().equals(user.getUsername())
                    && foundUser.getEmail().equals(user.getEmail())) {
                sb.append("username_takenemail_taken");
            } else if (foundUser.getUsername().equals(user.getUsername())) {
                sb.append("username_taken");
            } else if (foundUser.getEmail().equals(user.getEmail())) {
                sb.append("email_taken");
            }
        });
        if (sb.toString().isEmpty()) {
            sb.append("user_valid");
        }
        return sb.toString();
    }

    public User findById(String userId) {
        var foundUser = this.userRepository.findById(userId);
        if (foundUser.isPresent()) {
            return foundUser.orElseThrow();
            // TODO devolver null si hay isPresent()
        } else {
            return null;
        }
    }

    public String addToUserStringArray(String userId, String guideId, String field) {
        var result = this.mongoTemplate.updateFirst(
                query(where(Constants.ID).is(userId)),
                new Update().push(field, guideId), Constants.USER_COLLECTION);
        if (result.wasAcknowledged() && result.getModifiedCount() == 1) {
            return "operation_successful";
        } else {
            return "operation_unsuccessful";
        }
    }

    public String deleteFromUserStringArray(String userId, String guideId, String field) {
        var result = this.mongoTemplate.updateFirst(
                query(where(Constants.ID).is(userId)),
                new Update().pull(field, guideId), Constants.USER_COLLECTION);
        if (result.wasAcknowledged() && result.getModifiedCount() == 1) {
            return "operation_successful";
        } else {
            return "operation_unsuccessful";
        }
    }

    public String checkUserConfirmed(String userId) {
        var result = this.userRepository.findById(userId);
        if (result.isPresent()) {
            var foundUser = result.orElseThrow();
            if (foundUser.isConfirmed()) {
                return "user_confirmed";
            } else {
                return "user_not_confirmed";
            }
        } else {
            return "user_not_found";
        }
    }

    public String updateUserConfirmed(String userId, boolean confirmed) {
        var result = this.mongoTemplate.updateFirst(
                query(where(Constants.ID).is(userId)),
                new Update().set(Constants.CONFIRMED, confirmed),
                Constants.GUIDE_COLLECTION
        );
        if (result.wasAcknowledged() && result.getModifiedCount() > 0) {
            return "operation_successful";
        } else {
            return "operation_unsuccessful";
        }
    }

}
