package edu.dam.rest.microservice.web;

import edu.dam.rest.microservice.bean.guide.*;
import edu.dam.rest.microservice.bean.user.UserSession;
import edu.dam.rest.microservice.constants.ApiConstants;
import edu.dam.rest.microservice.service.GuideService;
import jakarta.servlet.http.HttpSession;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controller class for managing guide-related operations.
 */
@RestController
@RequestMapping(ApiConstants.GUIDE_ENDPOINT)
public class GuideController {

    private GuideService guideService;

    @Autowired
    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    /**
     * Endpoint to create a new guide.
     *
     * @param createGuideRequest request object containing guide details
     * @param guideThumbnail     optional thumbnail image for the guide
     * @param httpSession        HttpSession object for user session management
     * @return ResponseEntity with operation result as plain text
     */
    @PostMapping("create")
    public ResponseEntity<String> createGuide(
            @RequestPart CreateGuideRequest createGuideRequest,
            @RequestPart(required = false) MultipartFile guideThumbnail, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.guideService.guideCreate(createGuideRequest, userLogged.getId(), guideThumbnail);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body(result);
    }

    /**
     * Endpoint to delete a guide.
     *
     * @param httpSession HttpSession object for user session management
     * @param guideId     ID of the guide to delete
     * @return ResponseEntity with operation result as plain text
     */
    @DeleteMapping("delete/{guideId}")
    public ResponseEntity<String> deleteGuide(HttpSession httpSession, @PathVariable String guideId) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.guideService.deleteGuide(guideId, userLogged.getId());
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    /**
     * Endpoint to save a guide step.
     *
     * @param saveGuideStepRequest request object containing step details
     * @param stepImage            optional image for the step
     * @return ResponseEntity with operation result as plain text
     */
    @PatchMapping("save-step")
    public ResponseEntity<String> saveGuideStep(
            @RequestPart SaveGuideStepRequest saveGuideStepRequest,
            @RequestPart(required = false) MultipartFile stepImage) {
        var result = this.guideService.saveGuideStep(saveGuideStepRequest, stepImage);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body(result);
    }

    /**
     * Endpoint to delete a guide step.
     *
     * @param deleteGuideStepRequest request object containing step deletion details
     * @return ResponseEntity with operation result as plain text
     */
    @PatchMapping("delete-step")
    public ResponseEntity<String> deleteGuideStep(
            @RequestBody DeleteGuideStepRequest deleteGuideStepRequest) {
        var result = this.guideService.deleteGuideStep(deleteGuideStepRequest);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body(result);
    }

    /**
     * Endpoint to save guide information.
     *
     * @param saveGuideInfoRequest request object containing guide information
     * @param guideThumbnail       optional thumbnail image for the guide
     * @return ResponseEntity with operation result as plain text
     */
    @PatchMapping("save-info")
    public ResponseEntity<String> saveGuideInfo(
            @RequestPart SaveGuideInfoRequest saveGuideInfoRequest,
            @RequestPart(required = false) MultipartFile guideThumbnail) {
        var result = this.guideService.saveGuideInfo(saveGuideInfoRequest, guideThumbnail);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN)
                .body(result);
    }

    /**
     * Endpoint to find guide information for visualization.
     *
     * @param guideId     ID of the guide to find
     * @param httpSession HttpSession object for user session management
     * @return ResponseEntity with GuideVisualizeInfo object as JSON
     */
    @GetMapping("find-by-id-visualize/{guideId}")
    public ResponseEntity<GuideVisualizeInfo> findGuideVisualize(
            @PathVariable("guideId") String guideId, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var guideFound = this.guideService.findGuideVisualize(guideId, userLogged.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(guideFound);
    }

    /**
     * Endpoint to find guide steps for modification.
     *
     * @param guideId ID of the guide to find steps for
     * @return ResponseEntity with GuideModifySteps object as JSON
     */
    @GetMapping("find-by-id-steps/{guideId}")
    public ResponseEntity<GuideModifySteps> findGuideModifySteps(
            @PathVariable("guideId") String guideId) {
        var guideFound = this.guideService.findGuideModifySteps(guideId);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(guideFound);
    }

    /**
     * Endpoint to find guide information for modification.
     *
     * @param guideId ID of the guide to find information for
     * @return ResponseEntity with GuideModifyInfo object as JSON
     */
    @GetMapping("find-by-id-info/{guideId}")
    public ResponseEntity<GuideModifyInfo> findGuideModifyInfo(
            @PathVariable("guideId") String guideId) {
        var guideFound = this.guideService.findGuideModifyInfo(guideId);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(guideFound);
    }

    /**
     * Endpoint to check if a guide is published.
     *
     * @param guideId ID of the guide to check
     * @return ResponseEntity with boolean indicating if the guide is published
     */
    @GetMapping("find-published-by-id")
    public ResponseEntity<Boolean> findGuideIsPublished(@RequestParam("guideId") String guideId) {
        var result = this.guideService.findGuidePublished(guideId);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
    }

    /**
     * Endpoint to get published permission for a guide.
     *
     * @param guideId     ID of the guide to check permission for
     * @param httpSession HttpSession object for user session management
     * @return ResponseEntity with boolean indicating if user has permission to publish the guide
     */
    @GetMapping("get-published-permission")
    public ResponseEntity<Boolean> getPublishedPermission(
            @PathParam("guideId") String guideId, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.guideService.getPublishedPermission(guideId, userLogged.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
    }

    /**
     * Endpoint to find guides by applying a filter.
     *
     * @param findByFilterRequest request object containing filter criteria
     * @return ResponseEntity with FindByFilterResponse object as JSON
     */
    @PostMapping("find-by-filter")
    public ResponseEntity<FindByFilterResponse> findByFilter(
            @RequestBody FindByFilterRequest findByFilterRequest) {
        var result = this.guideService.findByFilter(findByFilterRequest);
        return ResponseEntity.status(HttpStatus.OK).
                contentType(MediaType.APPLICATION_JSON).body(result);
    }

    /**
     * Endpoint to find user's own guides.
     *
     * @param httpSession HttpSession object for user session management
     * @param pageNumber  optional page number for pagination
     * @return ResponseEntity with GuidePaginationResponse object as JSON
     */
    @GetMapping("find-own-guides")
    public ResponseEntity<GuidePaginationResponse> findOwnGuides(
            HttpSession httpSession, @RequestParam(required = false) Integer pageNumber) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.guideService.findOwnGuides(userLogged.getId(), pageNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON).body(result);
    }

    /**
     * Endpoint to find user's saved guides.
     *
     * @param httpSession HttpSession object for user session management
     * @param pageNumber  optional page number for pagination
     * @return ResponseEntity with GuidePaginationResponse object as JSON
     */
    @GetMapping("find-saved")
    public ResponseEntity<GuidePaginationResponse> findSaved(
            HttpSession httpSession, @RequestParam(required = false) Integer pageNumber) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.guideService.findSaved(userLogged.getId(), pageNumber);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON).body(result);
    }

    /**
     * Endpoint to add a comment to a guide.
     *
     * @param addCommentRequest request object containing comment details
     * @param httpSession       HttpSession object for user session management
     * @return ResponseEntity with AddCommentResponse object as JSON
     */
    @PatchMapping("add-comment")
    public ResponseEntity<AddCommentResponse> addComment(
            @RequestBody AddCommentRequest addCommentRequest, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.guideService.addComent(addCommentRequest, userLogged);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }

    /**
     * Endpoint to delete a comment from a guide.
     *
     * @param deleteCommentRequest request object containing comment deletion details
     * @return ResponseEntity with operation result as plain text
     */
    @PatchMapping("delete-comment")
    public ResponseEntity<String> deleteComment(
            @RequestBody DeleteCommentRequest deleteCommentRequest) {
        var result = this.guideService.deleteComment(deleteCommentRequest);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    /**
     * Endpoint to add a rating to a guide.
     *
     * @param addRatingRequest request object containing rating details
     * @param httpSession     HttpSession object for user session management
     * @return ResponseEntity with operation result as plain text or internal server error status
     */
    @PatchMapping("add-rating")
    public ResponseEntity<String> addRating(
            @RequestBody AddRatingRequest addRatingRequest, HttpSession httpSession) {
        var userLogged = (UserSession) httpSession.getAttribute("user");
        var result = this.guideService.addRating(addRatingRequest, userLogged.getId());
        return !(result.equals("internal_server_error")) ?
        ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.TEXT_PLAIN).body(result) :
        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.TEXT_PLAIN).body(result);
    }

    /**
     * Endpoint to find the newest guides.
     *
     * @return ResponseEntity with list of GuideInfo objects as JSON
     */
    @GetMapping("find-newest")
    public ResponseEntity<List<GuideInfo>> findNewest() {
        var result = this.guideService.findNewestGuides();
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }

    /**
     * Endpoint to find the newest guides filtered by user preference.
     *
     * @param preference user preference for filtering guides
     * @return ResponseEntity with list of GuideInfo objects as JSON
     */
    @GetMapping("find-newest-by-preference")
    public ResponseEntity<List<GuideInfo>> findNewestByPreference(@RequestParam("preference") String preference) {
        var result = this.guideService.findNewestGuidesByPreference(preference);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }

}
