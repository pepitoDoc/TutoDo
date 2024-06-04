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
import java.util.stream.Collectors;

@RestController
@RequestMapping(ApiConstants.SHARED_ENDPOINT)
public class SharedController {

    private ObjectMapper objectMapper;

    @Autowired
    public SharedController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

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

    @PostMapping("post-data")
    public void postData(@RequestBody Map<String, Object> sharedData, HttpSession httpSession) {
        sharedData.forEach(httpSession::setAttribute);
    }

    @PutMapping("delete-data")
    public void deleteData(@RequestBody List<String> sharedData, HttpSession httpSession) {
        sharedData.forEach(httpSession::removeAttribute);
    }

}
