package edu.dam.rest.microservice.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.dam.rest.microservice.constants.ApiConstants;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller class for managing persisted data in the session for sharing between parts of the application.
 */
@RestController
@RequestMapping(ApiConstants.SHARED_ENDPOINT)
public class SharedController {

    private ObjectMapper objectMapper;

    /**
     * Constructor injection to initialize SharedController with an ObjectMapper instance.
     *
     * @param objectMapper ObjectMapper instance for JSON processing.
     */
    @Autowired
    public SharedController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Retrieves session attributes based on provided request parameters.
     *
     * @param httpServletRequest HttpServletRequest containing parameters to retrieve from session.
     * @return ResponseEntity containing a map of session attributes matching the requested parameters in JSON format with HTTP status OK.
     */
    @GetMapping("get-data")
    public ResponseEntity<Map<String, Object>> getData(HttpServletRequest httpServletRequest) {
        Enumeration<String> params = httpServletRequest.getParameterNames();
        var payload = new HashMap<String, Object>();
        params.asIterator().forEachRemaining(param -> {
            var attribute = httpServletRequest.getSession().getAttribute(param);
            if (attribute != null) {
                payload.put(param, attribute);
            }
        });
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload);
    }

    /**
     * Stores shared data into the HttpSession attributes.
     *
     * @param sharedData  Map containing data to be stored in HttpSession attributes.
     * @param httpSession HttpSession instance to store data into.
     */
    @PostMapping("post-data")
    public void postData(@RequestBody Map<String, Object> sharedData, HttpSession httpSession) {
        sharedData.forEach(httpSession::setAttribute);
    }

    /**
     * Deletes specified attributes from HttpSession.
     *
     * @param sharedData  List of attribute names to be removed from HttpSession.
     * @param httpSession HttpSession instance to remove attributes from.
     */
    @PutMapping("delete-data")
    public void deleteData(@RequestBody List<String> sharedData, HttpSession httpSession) {
        sharedData.forEach(httpSession::removeAttribute);
    }

}
