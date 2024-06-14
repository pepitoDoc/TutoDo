package edu.dam.rest.microservice.web;

import edu.dam.rest.microservice.bean.guideType.GuideTypes;
import edu.dam.rest.microservice.bean.user.*;
import edu.dam.rest.microservice.constants.ApiConstants;
import edu.dam.rest.microservice.constants.Constants;
import edu.dam.rest.microservice.service.UserService;
import edu.dam.rest.microservice.util.VerificationCodeGenerator;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

/**
 * Controller class for managing user-related operations.
 */
@RestController
@RequestMapping(ApiConstants.USER_ENDPOINT)
public class UserController {

    private UserService userService;

    /**
     * Constructor injection to initialize UserController with a UserService instance.
     *
     * @param userService UserService instance to handle user-related operations.
     */
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint to create a new user.
     *
     * @param insertUserRequest Request body containing user information for creation.
     * @param httpSession       HttpSession instance for session management.
     * @return ResponseEntity indicating the result of user creation.
     */
    @PostMapping("create")
    public ResponseEntity<String> create(@RequestBody InsertUserRequest insertUserRequest, HttpSession httpSession) {
        var insertResult = this.userService.create(insertUserRequest);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(insertResult);
    }

    /**
     * Endpoint to handle user login.
     *
     * @param loginUserRequest Request body containing user login credentials.
     * @param httpSession      HttpSession instance for session management.
     * @return ResponseEntity indicating the result of the login attempt.
     */
    @PostMapping("login")
    public ResponseEntity<String> loginUser(
            @RequestBody LoginUserRequest loginUserRequest, HttpSession httpSession
    ) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        if (userLogged != null && (
                Objects.equals(userLogged.getUsername(), loginUserRequest.getEmail())
                        || Objects.equals(userLogged.getEmail(), loginUserRequest.getEmail()))) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("already_logged");
        } else {
            var loginResult = this.userService.login(loginUserRequest);
            if (loginResult != null) {
                httpSession.setAttribute("user", loginResult);
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("login_succesful");
            } else {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("credentials_wrong");
            }
        }
    }

    /**
     * Endpoint to handle user logout.
     *
     * @param httpSession HttpSession instance for session management.
     */
    @PostMapping("logout")
    public void logout(HttpSession httpSession) {
        httpSession.invalidate();
    }

    /**
     * Endpoint to check the validity of the user session.
     *
     * @param httpSession HttpSession instance for session management.
     * @return ResponseEntity indicating whether the session is valid or expired.
     */
    @GetMapping("check-session")
    public ResponseEntity<String> checkSession(HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN)
                .body(userLogged != null ? "session_confirmed" : "session_expired");
    }

    /**
     * Endpoint to retrieve detailed user information.
     *
     * @param httpSession HttpSession instance for session management.
     * @return ResponseEntity containing detailed user information.
     */
    @GetMapping("get-user")
    public ResponseEntity<UserData> getUser(HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var userInfo = this.userService.findById(userLogged.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON).body(userInfo);
    }

    /**
     * Endpoint to retrieve basic user information.
     *
     * @param httpSession HttpSession instance for session management.
     * @return ResponseEntity containing basic user information.
     */
    @GetMapping("get-user-basic")
    public ResponseEntity<UserBasicInfo> getUserBasic(HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var userBasicInfo = UserBasicInfo.builder()
                .username(userLogged.getUsername())
                .email(userLogged.getEmail())
                .preferences(userLogged.getPreferences())
                .build();
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON).body(userBasicInfo);
    }

    /**
     * Endpoint to add a guide to the user's saved list.
     *
     * @param httpSession HttpSession instance for session management.
     * @param guideId     ID of the guide to be added to saved list.
     * @return ResponseEntity indicating the result of adding the guide.
     */
    @PatchMapping("add-saved/{guideId}")
    public ResponseEntity<String> addGuideToSaved(HttpSession httpSession, @PathVariable String guideId) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.addToUserStringArray(userLogged.getId(), guideId, Constants.SAVED);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    /**
     * Endpoint to remove a guide from the user's saved list.
     *
     * @param httpSession HttpSession instance for session management.
     * @param guideId     ID of the guide to be removed from saved list.
     * @return ResponseEntity indicating the result of removing the guide.
     */
    @PatchMapping("remove-saved/{guideId}")
    public ResponseEntity<String> deleteGuideFromSaved(HttpSession httpSession, @PathVariable String guideId) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.deleteFromUserStringArray(userLogged.getId(), guideId, Constants.SAVED);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    /**
     * Endpoint to check if the user's account is confirmed.
     *
     * @param httpSession HttpSession instance for session management.
     * @return ResponseEntity indicating whether the user account is confirmed or not.
     */
    @GetMapping("check-valid")
    public ResponseEntity<String> checkConfirmed(HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        if (userLogged != null) {
            var result = this.userService.checkUserConfirmed(userLogged.getId());
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON)
                    .body(result);
        } else {
            return ResponseEntity.status(HttpStatus.OK).contentType(
                    MediaType.APPLICATION_JSON).body("session_expired");
        }
    }

    /**
     * Endpoint to update the confirmation status of the user's account.
     *
     * @param status     New confirmation status to be updated.
     * @param httpSession HttpSession instance for session management.
     * @return ResponseEntity indicating the result of updating the confirmation status.
     */
    @PatchMapping("update-confirmed/{status}")
    public ResponseEntity<String> updateConfirmed(
            @PathVariable("status") boolean status, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.updateUserConfirmed(userLogged.getId(), status);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    /**
     * Endpoint to verify a user using a verification code.
     *
     * @param codeType   Type of the verification code.
     * @param codeValue  Value of the verification code.
     * @param httpSession HttpSession instance for session management.
     * @return ResponseEntity indicating whether the verification operation was successful or not.
     */
    @GetMapping("verify-code/{codeType}")
    public ResponseEntity<String> verifyUser(
            @PathVariable("codeType") String codeType, @RequestParam("codeValue") String codeValue,
            HttpSession httpSession) {
        var generatedCode = (String) httpSession.getAttribute(codeType);
        if (codeValue.equals(generatedCode)) {
            httpSession.removeAttribute(codeType);
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN)
                    .body("operation_successful");
        } else {
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN)
                    .body("operation_unsuccessful");
        }
    }

    /**
     * Endpoint to send a verification code to the user via email or session.
     *
     * @param codeType      Type of the verification code.
     * @param httpSession   HttpSession instance for session management.
     * @param emailRequest  Request body containing email details (optional).
     * @return ResponseEntity indicating whether the operation to send the verification code was successful or not.
     */
    @PostMapping("send-code/{codeType}")
    public ResponseEntity<String> sendVerification(
            @PathVariable("codeType") String codeType, HttpSession httpSession,
            @RequestBody(required = false) EmailRequest emailRequest) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var codeValue = new VerificationCodeGenerator().generateVerificationCode();
        httpSession.setAttribute(codeType, codeValue);
        var result = this.userService.sendVerification(codeType, codeValue,
                userLogged == null ? emailRequest.getEmail() : userLogged.getEmail());
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN)
                .body(result ? "operation_successful" : "operation_unsuccessful");
    }

    /**
     * Endpoint to change the user's password using email verification.
     *
     * @param changePasswordByEmailRequest Request body containing details for changing password by email.
     * @return ResponseEntity indicating the result of changing the password.
     */
    @PatchMapping("change-password-by-email")
    public ResponseEntity<String> changePasswordByEmail(
            @RequestBody ChangePasswordByEmailRequest changePasswordByEmailRequest) {
        var result = this.userService.changePasswordByEmail(changePasswordByEmailRequest);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    /**
     * Endpoint to change the user's password using current password verification.
     *
     * @param changePasswordByIdRequest Request body containing details for changing password by ID.
     * @param httpSession               HttpSession instance for session management.
     * @return ResponseEntity indicating the result of changing the password.
     */
    @PatchMapping("change-password-by-id")
    public ResponseEntity<String> changePasswordById(
            @RequestBody ChangePasswordByIdRequest changePasswordByIdRequest, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.changePasswordById(
                userLogged.getId(),
                changePasswordByIdRequest.getOldPassword(),
                changePasswordByIdRequest.getNewPassword());
        if (result.equals("operation_successful")) {
            userLogged.setPassword(changePasswordByIdRequest.getNewPassword());
            httpSession.setAttribute("user", userLogged);
        }
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    /**
     * Endpoint to find users by username.
     *
     * @param username   Username to search for.
     * @param pageNumber Optional page number for pagination.
     * @return ResponseEntity containing the paginated response of users.
     */
    @GetMapping("find-users/{username}")
    public ResponseEntity<UserPaginationResponse> findUsers(
            @PathVariable("username") String username, @RequestParam(required = false) Integer pageNumber) {
        var result = this.userService.findAllByUsername(username, pageNumber);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }

    /**
     * Endpoint to add a completed guide to the user's profile.
     *
     * @param guideId     ID of the guide that has been completed.
     * @param httpSession HttpSession instance for session management.
     * @return ResponseEntity indicating the result of adding the completed guide.
     */
    @PatchMapping("add-completed/{guideId}")
    public ResponseEntity<String> addCompleted(
            @PathVariable("guideId") String guideId, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.addCompleted(guideId, userLogged.getId());
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    /**
     * Endpoint to change the username of the user.
     *
     * @param username   New username to be set.
     * @param httpSession HttpSession instance for session management.
     * @return ResponseEntity indicating the result of changing the username.
     */
    @PatchMapping("change-username/{username}")
    public ResponseEntity<String> changeUsername(
            @PathVariable("username") String username, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.changeUsername(username, userLogged.getId());
        if (result.equals("operation_successful")) {
            userLogged.setUsername(username);
            httpSession.setAttribute("user", userLogged);
        }
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    /**
     * Endpoint to change the email address of the user.
     *
     * @param emailRequest Request body containing the new email address.
     * @param httpSession  HttpSession instance for session management.
     * @return ResponseEntity indicating the result of changing the email address.
     */
    @PatchMapping("change-email")
    public ResponseEntity<String> changeEmail(
            @RequestBody EmailRequest emailRequest, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.changeEmail(emailRequest.getEmail(), userLogged.getId());
        if (result.equals("operation_successful")) {
            userLogged.setEmail(emailRequest.getEmail());
            httpSession.setAttribute("user", userLogged);
        }
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    /**
     * Endpoint to change the preferences of the user.
     *
     * @param guideTypes  Request body containing the new user preferences.
     * @param httpSession HttpSession instance for session management.
     * @return ResponseEntity indicating the result of changing the user preferences.
     */
    @PatchMapping("change-preferences")
    public ResponseEntity<String> changePreferences(@RequestBody GuideTypes guideTypes, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.changeUserPreferences(guideTypes.getGuideTypes(), userLogged.getId());
        if (result.equals("operation_successful")) {
            userLogged.setPreferences(guideTypes.getGuideTypes());
            httpSession.setAttribute("user", userLogged);
        }
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }
}
