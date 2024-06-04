package edu.dam.rest.microservice.web;

import edu.dam.rest.microservice.bean.user.InsertUserRequest;
import edu.dam.rest.microservice.bean.user.LoginUserRequest;
import edu.dam.rest.microservice.bean.user.UserSession;
import edu.dam.rest.microservice.constants.ApiConstants;
import edu.dam.rest.microservice.constants.Constants;
import edu.dam.rest.microservice.persistence.model.User;
import edu.dam.rest.microservice.service.UserService;
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

    @DeleteMapping("delete")
    public void deleteUser(HttpSession httpSession) {
        var user = (UserSession) httpSession.getAttribute("user");
        this.userService.delete(user);
    }

    @GetMapping("get-user")
    public ResponseEntity<User> getUser(HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var userInfo = this.userService.findById(userLogged.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON).body(userInfo);
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

}
