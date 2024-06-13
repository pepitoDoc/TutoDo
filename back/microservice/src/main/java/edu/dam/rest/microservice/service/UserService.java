package edu.dam.rest.microservice.service;

import edu.dam.rest.microservice.bean.user.*;
import edu.dam.rest.microservice.constants.Constants;
import edu.dam.rest.microservice.persistence.model.User;
import edu.dam.rest.microservice.persistence.repository.UserRepository;
import edu.dam.rest.microservice.util.email.Sender;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

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
                .preferences(insertUserRequest.getPreferences())
                .build();
        String checkUser = this.findAllByUsernameOrEmail(createUser.getUsername(), createUser.getEmail());
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

    public UserData findById(String id) {
        var foundUser = this.userRepository.findById(id);
        if (foundUser.isPresent()) {
            var user = foundUser.orElseThrow();
            return UserData.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .saved(user.getSaved())
                    .created(user.getCreated())
                    .preferences(user.getPreferences())
                    .build();
        } else {
            return null;
        }
    }

    public String addToUserStringArray(String id, String guideId, String field) {
        var result = this.mongoTemplate.updateFirst(
                query(where(Constants.ID).is(id)),
                new Update().push(field, guideId), Constants.USER_COLLECTION);
        if (result.wasAcknowledged() && result.getModifiedCount() == 1) {
            return "operation_successful";
        } else {
            return "operation_unsuccessful";
        }
    }

    public String deleteFromUserStringArray(String id, String guideId, String field) {
        var result = this.mongoTemplate.updateFirst(
                query(where(Constants.ID).is(id)),
                new Update().pull(field, guideId), Constants.USER_COLLECTION);
        if (result.wasAcknowledged() && result.getModifiedCount() == 1) {
            return "operation_successful";
        } else {
            return "operation_unsuccessful";
        }
    }

    public String checkUserConfirmed(String id) {
        var result = this.userRepository.findById(id);
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

    public String updateUserConfirmed(String id, boolean confirmed) {
        var result = this.mongoTemplate.updateFirst(
                query(where(Constants.ID).is(id)),
                new Update().set(Constants.CONFIRMED, confirmed),
                Constants.USER_COLLECTION
        );
        if (result.wasAcknowledged() && result.getModifiedCount() > 0) {
            return "operation_successful";
        } else {
            return "operation_unsuccessful";
        }
    }

    public boolean sendVerification(String codeType, String codeValue, String email) {
        var sender = new Sender();
        return sender.send("TutoDo", email, Constants.EMAIL_TITLES.get(codeType), codeValue);
    }

    public String changePasswordByEmail(ChangePasswordByEmailRequest changePasswordByEmailRequest) {
        var userFound = this.userRepository.findByEmail(changePasswordByEmailRequest.getEmail());
        if (userFound != null) {
            var result = this.mongoTemplate.updateFirst(
                    query(where(Constants.ID).is(userFound.getId())),
                    new Update().set(Constants.PASSWORD, changePasswordByEmailRequest.getNewPassword()),
                    Constants.USER_COLLECTION
            );
            if (result.wasAcknowledged()) {
                return "operation_successful";
            } else {
                return "operation_unsuccessful";
            }
        } else {
            return "operation_unsuccessful";
        }
    }

    public String changePasswordById(String id, String oldPassword, String newPassword) {
        var userFound = this.userRepository.findById(id);
        if (userFound.isPresent()) {
            var user = userFound.orElseThrow();
            if (user.getPassword().equals(oldPassword)) {
                var result = this.mongoTemplate.updateFirst(
                        query(where(Constants.ID).is(id)),
                        new Update().set(Constants.PASSWORD, newPassword),
                        Constants.USER_COLLECTION);
                if (result.wasAcknowledged() && result.getMatchedCount() > 0) {
                    return "operation_successful";
                } else {
                    return "operation_unsuccessful";
                }
            } else {
                return "password_incorrect";
            }
        } else {
            return "operation_unsuccessful";
        }
    }

    public UserPaginationResponse findAllByUsername(String username, Integer pageNumber) {
        var userPattern = Pattern.compile(username, Pattern.CASE_INSENSITIVE);
        var pageable = PageRequest.of(pageNumber == null ? 0 : pageNumber, Constants.PAGE_SIZE,
                Sort.by(Sort.Order.desc(Constants.CREATION_DATE)));
        var userPage = this.userRepository.findAllByUsernameRegex(userPattern.toString(), pageable);
        return UserPaginationResponse.builder()
                .totalUsers(userPage.getTotalElements())
                .usersFound(userPage.stream().map(user -> UserSearchData.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .created(user.getCreated())
                        .preferences(user.getPreferences())
                        .saved(user.getSaved())
                        .build()).toList())
                .build();
    }

    public String addCompleted(String guideId, String id) {
        var result = this.mongoTemplate.updateFirst(
                query(where(Constants.ID).is(id)),
                new Update().push(Constants.COMPLETED, guideId),
                Constants.USER_COLLECTION);
        if (result.wasAcknowledged() && result.getModifiedCount() > 0) {
            return "operation_successful";
        } else {
            return "operation_unsuccessful";
        }
    }

    public String changeUsername(String username, String id) {
        var usernameCheck = this.findAllByUsernameOrEmail(username, StringUtils.EMPTY);
        if (!usernameCheck.equals("username_taken")) {
            var result = this.mongoTemplate.updateFirst(
                    query(where(Constants.ID).is(id)),
                    new Update().set(Constants.USERNAME, username),
                    Constants.USER_COLLECTION);
            if (result.wasAcknowledged() && result.getModifiedCount() > 0) {
                return "operation_successful";
            } else {
                return "operation_unsuccessful";
            }
        } else {
            return usernameCheck;
        }
    }

    public String changeEmail(String email, String id) {
        var emailCheck = this.findAllByUsernameOrEmail(StringUtils.EMPTY, email);
        if (!emailCheck.equals("email_taken")) {
            var result = this.mongoTemplate.updateFirst(
                    query(where(Constants.ID).is(id)),
                    new Update().set(Constants.EMAIL, email),
                    Constants.USER_COLLECTION);
            if (result.wasAcknowledged() && result.getModifiedCount() > 0) {
                return this.updateUserConfirmed(id, false);
            } else {
                return "operation_unsuccessful";
            }
        } else {
            return emailCheck;
        }
    }

    public String changeUserPreferences(List<String> preferences, String id) {
        var result = this.mongoTemplate.updateFirst(
                query(where(Constants.ID).is(id)),
                new Update().set(Constants.PREFERENCES, preferences),
                Constants.USER_COLLECTION);
        if (result.wasAcknowledged() && result.getMatchedCount() > 0) {
            return "operation_successful";
        } else {
            return "operation_unsuccessful";
        }
    }

    private String findAllByUsernameOrEmail(String username, String email) {
        var foundUsers = this.userRepository.findAllByUsernameOrEmail(username, email);
        var sb = new StringBuilder();
        foundUsers.forEach( (foundUser) -> {
            if (foundUser.getUsername().equals(username)
                    && foundUser.getEmail().equals(email)) {
                sb.append("username_takenemail_taken");
            } else if (foundUser.getUsername().equals(username)) {
                sb.append("username_taken");
            } else if (foundUser.getEmail().equals(email)) {
                sb.append("email_taken");
            }
        });
        if (sb.toString().isEmpty()) {
            sb.append("user_valid");
        }
        return sb.toString();
    }
}
