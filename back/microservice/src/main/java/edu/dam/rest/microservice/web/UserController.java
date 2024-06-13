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

@RestController
@RequestMapping(ApiConstants.USER_ENDPOINT)
public class UserController {

    private UserService userService;


    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("create")
    public ResponseEntity<String> create(@RequestBody InsertUserRequest insertUserRequest, HttpSession httpSession) {
        var insertResult = this.userService.create(insertUserRequest);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(insertResult);
    }

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

    @PostMapping("logout")
    public void logout(HttpSession httpSession) {
        httpSession.invalidate();
    }

    @GetMapping("check-session")
    public ResponseEntity<String> checkSession(HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN)
                .body(userLogged != null ? "session_confirmed" : "session_expired");
    }

    @GetMapping("get-user")
    public ResponseEntity<UserData> getUser(HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var userInfo = this.userService.findById(userLogged.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON).body(userInfo);
    }

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

    @PatchMapping("add-saved/{guideId}")
    public ResponseEntity<String> addGuideToSaved(HttpSession httpSession, @PathVariable String guideId) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.addToUserStringArray(userLogged.getId(), guideId, Constants.SAVED);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    @PatchMapping("remove-saved/{guideId}")
    public ResponseEntity<String> deleteGuideFromSaved(HttpSession httpSession, @PathVariable String guideId) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.deleteFromUserStringArray(userLogged.getId(), guideId, Constants.SAVED);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

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

    @PatchMapping("update-confirmed/{status}")
    public ResponseEntity<String> updateConfirmed(
            @PathVariable("status") boolean status, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.updateUserConfirmed(userLogged.getId(), status);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    @GetMapping("verify-code/{codeType}")
    public ResponseEntity<String> verifyUser(
            @PathVariable("codeType") String codeType, @RequestParam("codeValue") String codeValue,
            HttpSession httpSession) {
        var generatedCode = (String) httpSession.getAttribute(codeType);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN)
                .body(codeValue.equals(generatedCode) ? "operation_successful" : "operation_unsuccessful");
    }

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

    @PatchMapping("change-password-by-email")
    public ResponseEntity<String> changePasswordByEmail(
            @RequestBody ChangePasswordByEmailRequest changePasswordByEmailRequest) {
        var result = this.userService.changePasswordByEmail(changePasswordByEmailRequest);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

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

    @GetMapping("find-users/{username}")
    public ResponseEntity<UserPaginationResponse> findUsers(
            @PathVariable("username") String username, @RequestParam(required = false) Integer pageNumber) {
        var result = this.userService.findAllByUsername(username, pageNumber);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }

    @PatchMapping("add-completed/{guideId}")
    public ResponseEntity<String> addCompleted(
            @PathVariable("guideId") String guideId, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.userService.addCompleted(guideId, userLogged.getId());
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

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
