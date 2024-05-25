package edu.dam.rest.microservice.web;

import edu.dam.rest.microservice.bean.guide.*;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping(ApiConstants.GUIDE_ENDPOINT)
public class GuideController {

    private GuideService guideService;

    @Autowired
    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @PostMapping("create")
    public ResponseEntity<String> createGuide(
            @RequestPart CreateGuideRequest createGuideRequest,
            @RequestPart MultipartFile guideThumbnail, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.guideService.guideCreate(createGuideRequest, userLogged.getId(), guideThumbnail);
        return ResponseEntity.status(result.contains("creating_updated")
                        ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.TEXT_PLAIN)
                .body(result);
    }

    @PostMapping("save-steps")
    public ResponseEntity<String> saveGuideSteps(
            @RequestBody SaveGuideStepsRequest saveGuideStepsRequest) {
        var result = this.guideService.saveGuideSteps(saveGuideStepsRequest);
        return ResponseEntity.status(result.contains("guide_updated")
                        ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.TEXT_PLAIN)
                .body(result);
    }

    @PostMapping("save-info")
    public ResponseEntity<String> saveGuideInfo(
            @RequestBody SaveGuideInfoRequest saveGuideInfoRequest) {
        var result = this.guideService.saveGuideInfo(saveGuideInfoRequest);
        return ResponseEntity.status(result.contains("guide_updated")
                        ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.TEXT_PLAIN)
                .body(result);
    }

    @GetMapping("find-by-id")
    public ResponseEntity<Guide> findGuide(@PathParam("guideId") String guideId) {
        var guideFound = this.guideService.findGuide(guideId);
        return ResponseEntity.status(guideFound == null ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(guideFound);
    }

    @GetMapping("find-published-by-id")
    public ResponseEntity<Boolean> findGuideIsPublished(@PathParam("guideId") String guideId) {
        var result = this.guideService.findGuidePublished(guideId);
        return ResponseEntity.status(result == null ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
    }

    @PostMapping("find-by-filter")
    public ResponseEntity<List<Guide>> findByFilter(
            @RequestBody FindByFilterRequest findByFilterRequest) {
        var result = this.guideService.findByFilter(findByFilterRequest);
        return ResponseEntity.status(!result.isEmpty() ? HttpStatus.OK : HttpStatus.NO_CONTENT).
                contentType(MediaType.APPLICATION_JSON).body(result);
    }

    @GetMapping("find-own-guides")
    public ResponseEntity<List<Guide>> findOwnGuides(HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.guideService.findOwnGuides(userLogged.getId());
        return ResponseEntity.status(result == null ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON).body(result);
    }

//    @PutMapping("add-comment")
//    public ResponseEntity<String> addComment(
//            @RequestBody AddCommentRequest addCommentRequest, HttpSession httpSession) {
//
//    }

    @PutMapping("add-rating")
    public ResponseEntity<String> addRating(
            @RequestBody AddRatingRequest addRatingRequest, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.guideService.addRating(addRatingRequest, userLogged.getId());
        return !(result.equals("internal_server_error")) ?
        ResponseEntity.status(result.equals("guide_updated") ? HttpStatus.OK : HttpStatus.NO_CONTENT)
                .contentType(MediaType.TEXT_PLAIN).body(result) :
        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.TEXT_PLAIN).body(result);
    }

//    @PostMapping(value = "upload-image",  consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<String> uploadImage(@RequestPart("uploadImage") UploadImage uploadImage,
//                            @RequestPart("image") MultipartFile image) {
//
//    }

}
