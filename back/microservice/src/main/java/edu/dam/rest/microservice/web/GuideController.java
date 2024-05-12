package edu.dam.rest.microservice.web;

import edu.dam.rest.microservice.bean.guide.CreateGuideRequest;
import edu.dam.rest.microservice.bean.guide.SaveGuideStepsRequest;
import edu.dam.rest.microservice.bean.user.UserSession;
import edu.dam.rest.microservice.constants.ApiConstants;
import edu.dam.rest.microservice.persistence.model.Guide;
import edu.dam.rest.microservice.service.GuideService;
import jakarta.servlet.http.HttpSession;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiConstants.GUIDE_ENDPOINT)
public class GuideController {

    private GuideService guideService;

    @Autowired
    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @PostMapping("create-guide")
    public ResponseEntity<String> createGuide(
            @RequestBody CreateGuideRequest createGuideRequest, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.guideService.guideCreate(createGuideRequest, userLogged.getId());
        return ResponseEntity.status(result.contains("guides_updated")
                        ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.TEXT_PLAIN)
                .body(result);
    }

    @PostMapping("save-guide-steps")
    public ResponseEntity<String> saveGuideSteps(
            @RequestBody SaveGuideStepsRequest saveGuideStepsRequest) {
        var result = this.guideService.saveGuideSteps(saveGuideStepsRequest);
        return ResponseEntity.status(result.contains("guide_updated")
                        ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.TEXT_PLAIN)
                .body(result);
    }

    @GetMapping("find-guide")
    public ResponseEntity<Guide> findGuide(@PathParam("guideId") String guideId) {
        var guideFound = this.guideService.findGuide(guideId);
        return ResponseEntity.status(guideFound == null ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(guideFound);
    }

    @GetMapping("find-guide-published")
    public ResponseEntity<Boolean> findGuideIsPublished(@PathParam("guideId") String guideId) {
        var result = this.guideService.findGuidePublished(guideId);
        return ResponseEntity.status(result == null ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
    }

}
