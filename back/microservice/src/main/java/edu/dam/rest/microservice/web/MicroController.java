package edu.dam.rest.microservice.web;

import edu.dam.rest.microservice.bean.InsertUserRequest;
import edu.dam.rest.microservice.bean.UserLoginRequest;
import edu.dam.rest.microservice.bean.UserSession;
import edu.dam.rest.microservice.constants.ApiConstants;
import edu.dam.rest.microservice.persistence.model.User;
import edu.dam.rest.microservice.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiConstants.ENDPOINT)
public class MicroController {

    private UserService userService;


    @Autowired
    public MicroController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("user/insert")
    public ResponseEntity<String> insertUser(@RequestBody InsertUserRequest insertUserRequest) {
        var insertResult = userService.insertUser(insertUserRequest);
        if (!insertResult.equals("user_registered")) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(insertResult);
        } else {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(insertResult);
        }
    }

    @PostMapping("user/login")
    public ResponseEntity<String> loginUser(
            @RequestBody UserLoginRequest userLoginRequest, HttpSession httpSession
    ) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        if (userLogged != null) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("already_logged");
        } else {
            var loginResult = userService.loginUser(userLoginRequest);
            if (loginResult != null) {
                httpSession.setAttribute("user", loginResult);
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("login_succesful");
            } else {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("credentials_wrong");
            }
        }

    }

    @DeleteMapping("user/delete")
    public void deleteUser(HttpSession httpSession) {
        var user = (UserSession) httpSession.getAttribute("user");
        this.userService.deleteUser(user);
    }

}
