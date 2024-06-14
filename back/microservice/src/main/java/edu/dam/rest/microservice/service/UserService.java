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

/**
 * Service class for managing user-related operations.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    /**
     * Constructs a UserService instance with necessary dependencies.
     *
     * @param userRepository The repository for managing user data.
     * @param mongoTemplate  The MongoDB template for executing queries.
     */
    @Autowired
    public UserService(UserRepository userRepository, MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
        this.userRepository = userRepository;
    }

    /**
     * Creates a new user based on the provided request.
     *
     * @param insertUserRequest The request containing user data.
     * @return A string indicating the operation status ("operation_successful" or "operation_unsuccessful").
     */
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

    /**
     * Logs in a user using the provided credentials.
     *
     * @param loginUserRequest The request containing login credentials.
     * @return A UserSession object if login is successful, otherwise null.
     */
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

    /**
     * Finds a user by their ID.
     *
     * @param id The ID of the user to find.
     * @return A UserData object representing the user's data, or null if not found.
     */
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

    /**
     * Adds a value to a specific string array field in an user's document.
     *
     * @param id      The ID of the user.
     * @param guideId The ID of the guide to add.
     * @param field   The field in the user's document (e.g., "completed", "saved") to add the value to.
     * @return A string indicating the operation status ("operation_successful" or "operation_unsuccessful").
     */
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

    /**
     * Deletes a value from a specific string array field in an user's document.
     *
     * @param id      The ID of the user.
     * @param guideId The ID of the guide to delete.
     * @param field   The field in the user's document (e.g., "completed", "saved") to delete the value from.
     * @return A string indicating the operation status ("operation_successful" or "operation_unsuccessful").
     */
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

    /**
     * Checks if a user is confirmed.
     *
     * @param id The ID of the user to check.
     * @return A string indicating the user's confirmation status ("user_confirmed", "user_not_confirmed", or "user_not_found").
     */
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

    /**
     * Updates a user's confirmation status.
     *
     * @param id        The ID of the user to update.
     * @param confirmed The new confirmation status.
     * @return A string indicating the operation status ("operation_successful" or "operation_unsuccessful").
     */
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

    /**
     * Sends a verification email to the user.
     *
     * @param codeType  The type of verification code.
     * @param codeValue The value of the verification code.
     * @param email     The email address to send the verification to.
     * @return true if the email was sent successfully, otherwise false.
     */
    public boolean sendVerification(String codeType, String codeValue, String email) {
        var sender = new Sender();
        return sender.send("TutoDo", email, Constants.EMAIL_TITLES.get(codeType), codeValue);
    }

    /**
     * Changes the user's password using their email.
     *
     * @param changePasswordByEmailRequest The request containing the user's email and new password.
     * @return A string indicating the operation status ("operation_successful" or "operation_unsuccessful").
     */
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

    /**
     * Changes the user's password using their ID and old password.
     *
     * @param id          The ID of the user.
     * @param oldPassword The user's current password.
     * @param newPassword The new password to set.
     * @return A string indicating the operation status ("operation_successful", "operation_unsuccessful", or "password_incorrect").
     */
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

    /**
     * Finds users by their username, supporting pagination.
     *
     * @param username   The username to search for.
     * @param pageNumber The page number of results to retrieve.
     * @return A UserPaginationResponse object containing found users.
     */
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

    /**
     * Adds a guide ID to the "completed" field in a user's document.
     *
     * @param guideId The ID of the guide to mark as completed.
     * @param id      The ID of the user.
     * @return A string indicating the operation status ("operation_successful" or "operation_unsuccessful").
     */
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

    /**
     * Changes the user's username.
     *
     * @param username The new username to set.
     * @param id       The ID of the user.
     * @return A string indicating the operation status ("operation_successful", "operation_unsuccessful", or "username_taken").
     */
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

    /**
     * Changes the user's email address.
     *
     * @param email The new email address to set.
     * @param id    The ID of the user.
     * @return A string indicating the operation status ("operation_successful", "operation_unsuccessful", or "email_taken").
     */
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

    /**
     * Changes the user's preferences.
     *
     * @param preferences The new list of preferences to set.
     * @param id          The ID of the user.
     * @return A string indicating the operation status ("operation_successful" or "operation_unsuccessful").
     */
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

    /**
     * Finds all users matching the given username or email.
     *
     * @param username The username to search for.
     * @param email    The email to search for.
     * @return A string indicating the result of the search ("username_taken", "email_taken", "username_takenemail_taken", or "user_valid").
     */
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
