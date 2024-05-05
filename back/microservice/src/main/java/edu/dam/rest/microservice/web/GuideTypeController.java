package edu.dam.rest.microservice.web;

import edu.dam.rest.microservice.bean.guideType.FindAllGuideTypesResponse;
import edu.dam.rest.microservice.constants.ApiConstants;
import edu.dam.rest.microservice.service.GuideTypeService;
import edu.dam.rest.microservice.util.GuideDbDump;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiConstants.GUIDE_TYPE_ENDPOINT)
public class GuideTypeController {

    private GuideTypeService guideTypeService;

    @Autowired
    public GuideTypeController(GuideTypeService guideTypeService) {
        this.guideTypeService = guideTypeService;
    }

    @GetMapping("findAll")
    public ResponseEntity<FindAllGuideTypesResponse> findAll() {
        var response = this.guideTypeService.findAllGuideTypes();
        if (response == null) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(response);
        } else {
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        }
    }


}
