package edu.dam.rest.microservice.service;

import com.mongodb.BasicDBObject;
import com.mongodb.client.result.UpdateResult;
import edu.dam.rest.microservice.bean.guide.*;
import edu.dam.rest.microservice.constants.Constants;
import edu.dam.rest.microservice.persistence.model.*;
import edu.dam.rest.microservice.persistence.repository.GuideRepository;
import edu.dam.rest.microservice.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class GuideService {

    private final GuideRepository guideRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public GuideService(GuideRepository guideRepository, UserService userService,
                        MongoTemplate mongoTemplate, UserRepository userRepository) {
        this.guideRepository = guideRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public String guideCreate(CreateGuideRequest createGuideRequest, String userId, MultipartFile guideThumbnail) {
        if (guideThumbnail != null && Constants.VALID_IMAGE_TYPES.contains(guideThumbnail.getContentType())) {
            var encodedThumbnail = this.encodeImageAsBase64(guideThumbnail);
            if (!encodedThumbnail.equals("error_encoding")) {
                var guide = Guide.builder()
                        .userId(userId)
                        .title(createGuideRequest.getTitle())
                        .description(createGuideRequest.getDescription())
                        .published(false)
                        .creationDate(LocalDate.now())
                        .steps(new ArrayList<>())
                        .guideTypes(createGuideRequest.getGuideTypes())
                        .ingredients(createGuideRequest.getIngredients().isEmpty()
                                ? new ArrayList<>() : createGuideRequest.getIngredients())
                        .comments(new ArrayList<>())
                        .ratings(new ArrayList<>())
                        .thumbnail(encodedThumbnail)
                        .build();
                return insertGuide(userId, guide);
            } else {
                return "error_creating_guide";
            }
        } else {
            var guide = Guide.builder()
                    .userId(userId)
                    .title(createGuideRequest.getTitle())
                    .description(createGuideRequest.getDescription())
                    .published(false)
                    .creationDate(LocalDate.now())
                    .steps(new ArrayList<>())
                    .guideTypes(createGuideRequest.getGuideTypes())
                    .ingredients(createGuideRequest.getIngredients().isEmpty()
                            ? new ArrayList<>() : createGuideRequest.getIngredients())
                    .comments(new ArrayList<>())
                    .ratings(new ArrayList<>())
                    .build();
            return insertGuide(userId, guide);
        }
    }

    public String saveGuideStep(SaveGuideStepRequest saveGuideStepRequest, MultipartFile stepImage) {
        try {
            var step = new Step();
            if (stepImage != null && Constants.VALID_IMAGE_TYPES.contains(stepImage.getContentType())) {
                var encodedImage = this.encodeImageAsBase64(stepImage);
                if (!encodedImage.equals("error_encoding")) {
                    step.setImage(encodedImage);
                } else {
                    return "error_updating_step";
                }
            } else {
                step.setImage(saveGuideStepRequest.getImage());
            }
            step.setTitle(saveGuideStepRequest.getTitle());
            step.setDescription(saveGuideStepRequest.getDescription());
            var query = new Query().addCriteria(where(Constants.ID).is(saveGuideStepRequest.getGuideId()));
            query.fields().include(Constants.STEPS);
            var queryResult = this.mongoTemplate.findOne(query, StepsProjection.class, Constants.GUIDE_COLLECTION);
            if (queryResult != null) {
                if (saveGuideStepRequest.isSaved()) {
                    queryResult.getSteps().set(saveGuideStepRequest.getStepIndex(), step);
                } else {
                    queryResult.getSteps().add(saveGuideStepRequest.getStepIndex(), step);
                }
                var updateResult = this.mongoTemplate.updateFirst(
                        query(where(Constants.ID).is(saveGuideStepRequest.getGuideId())),
                        new Update().set(Constants.STEPS, queryResult.getSteps()),
                        Constants.GUIDE_COLLECTION);
                if (updateResult.wasAcknowledged()) {
                    return "guide_updated";
                } else {
                    return "guide_not_found";
                }
            } else {
                return "guide_not_found";
            }
        } catch (Exception e) {
            return "internal_server_error";
        }
    }

    public String deleteGuideStep(DeleteGuideStepRequest deleteGuideStepRequest) {
        var query = new Query().addCriteria(where(Constants.ID).is(deleteGuideStepRequest.getGuideId()));
        query.fields().include(Constants.STEPS);
        var queryResult = this.mongoTemplate.findOne(query, StepsProjection.class, Constants.GUIDE_COLLECTION);
        if (queryResult != null) {
            queryResult.getSteps().remove(deleteGuideStepRequest.getStepIndex());
            var updateResult = this.mongoTemplate.updateFirst(
                    query(where(Constants.ID).is(deleteGuideStepRequest.getGuideId())),
                    new Update().set(Constants.STEPS, queryResult.getSteps()),
                    Constants.GUIDE_COLLECTION);
            if (updateResult.wasAcknowledged()) {
                return "guide_updated";
            } else {
                return "guide_not_found";
            }
        } else {
            return "guide_not_found";
        }
    }

    public String saveGuideInfo(SaveGuideInfoRequest saveGuideInfoRequest, MultipartFile guideThumbnail) {
        try {
            var updates = new Update();
            if (guideThumbnail != null && Constants.VALID_IMAGE_TYPES.contains(guideThumbnail.getContentType())) {
                var encodedThumbnail = this.encodeImageAsBase64(guideThumbnail);
                if (!encodedThumbnail.equals("error_encoding")) {
                    updates.set(Constants.THUMBNAIL, encodedThumbnail);
                } else {
                    return "error_saving_thumbnail";
                }
            }
            var result = this.mongoTemplate.updateFirst(
                    query(where(Constants.ID).is(saveGuideInfoRequest.getGuideId())),
                    updates.set(Constants.TITLE, saveGuideInfoRequest.getTitle())
                            .set(Constants.DESCRIPTION, saveGuideInfoRequest.getDescription())
                            .set(Constants.GUIDE_TYPES, saveGuideInfoRequest.getGuideTypes())
                            .set(Constants.INGREDIENTS, saveGuideInfoRequest.getIngredients())
                            .set(Constants.PUBLISHED, saveGuideInfoRequest.isPublished()),
                    Constants.GUIDE_COLLECTION);
            if (result.wasAcknowledged()) {
                return "guide_updated";
            } else {
                return "guide_not_found";
            }
        } catch (Exception e) {
            return "internal_server_error";
        }
    }

    public String updateGuidePublished(UpdatePublishedRequest updatePublishedRequest) {
        var result = this.mongoTemplate.updateFirst(
                query(where(Constants.ID).is(updatePublishedRequest.getGuideId())),
                new Update().set(Constants.PUBLISHED, updatePublishedRequest.isPublished()),
                Constants.GUIDE_COLLECTION);
        if (result.wasAcknowledged()) {
            return "guide_updated";
        } else {
            return "guide_not_found";
        }
    }

    public Guide findGuide(String guideId) {
        var foundGuide = this.guideRepository.findById(guideId);
        if (foundGuide.isPresent()) {
            return foundGuide.orElseThrow();
        } else {
            return null;
        }
    }

    public Boolean findGuidePublished(String guideId) {
        var foundGuide = this.guideRepository.findById(guideId);
        if (foundGuide.isPresent()) {
            try {
                return foundGuide.orElseThrow().isPublished();
            } catch (NoSuchElementException e) {
                return null;
            }
        } else {
            return null;
        }
    }

    public List<Guide> findByFilter(FindByFilterRequest findByFilterRequest) {
        var operations = new ArrayList<AggregationOperation>();
        if (!findByFilterRequest.getTitle().isEmpty()) {
            operations.add(match(where(Constants.TITLE).regex(findByFilterRequest.getTitle(), "i")));
        }
        if (!findByFilterRequest.getGuideTypes().isEmpty()) {
            operations.add(match(where(Constants.GUIDE_TYPES).in(findByFilterRequest.getGuideTypes())));
        }
        if (findByFilterRequest.getRating() != null && findByFilterRequest.getRating() >= 0) {
            operations.add(unwind(Constants.RATINGS));
            operations.add(group(Constants.ID).avg("$ratings.punctuation")
                    .as("averagePunctuation"));
            operations.add(match(where("averagePunctuation").gt(findByFilterRequest.getRating())));
        }
        operations.add(match(where(Constants.PUBLISHED).is(true)));
        var results = this.mongoTemplate.aggregate(
                newAggregation(operations), Constants.GUIDE_COLLECTION, BasicDBObject.class);
        return results.getMappedResults().stream()
                .map(result -> this.guideRepository.findById(result.getObjectId(Constants.ID).toString()))
                .filter(result -> {
                    if (result.isPresent() && !findByFilterRequest.getUsername().isEmpty()) {
                        var userPattern = Pattern.compile(
                                findByFilterRequest.getUsername(), Pattern.CASE_INSENSITIVE);
                        var foundUser = this.userRepository.findByUsernameRegex(userPattern.toString());
                        return result.orElseThrow().getUserId().equals(foundUser.getId());
                    } else {
                        return true;
                    }
                })
                .map(Optional::orElseThrow)
                .collect(Collectors.toList());
    }

    public List<Guide> findOwnGuides(String userId) {
        var result = this.guideRepository.findByUserId(userId);
        if (!result.isEmpty()) {
            return result;
        } else {
            return null;
        }
    }

    public String addComent(AddCommentRequest addCommentRequest, String userId) {
        try {
            UpdateResult result = this.mongoTemplate.updateFirst(
                    query(where(Constants.ID).is(addCommentRequest.getGuideId())),
                    new Update().push(Constants.COMMENTS, Comment.builder()
                            .userId(userId).comment(addCommentRequest.getComment())),
                    Constants.GUIDE_COLLECTION);
            if (result.wasAcknowledged() && result.getModifiedCount() > 0) {
                return "guide_updated";
            } else {
                return "guide_not_found";
            }
        } catch (Exception e) {
            return "internal_server_error";
        }
    }

    public String addRating(AddRatingRequest addRatingRequest, String userId) {
        try {
            UpdateResult setResult = this.mongoTemplate.updateFirst(
                    query(where(Constants.ID).is(addRatingRequest.getGuideId())
                            .and(Constants.RATINGS + "." + Constants.USERID).is(userId)),
                    new Update().set(Constants.RATINGS + ".$." + Constants.PUNCTUATION,
                            addRatingRequest.getRating()),
                    Constants.GUIDE_COLLECTION);
            if (setResult.wasAcknowledged() && setResult.getModifiedCount() > 0) {
                return "guide_updated";
            } else {
                UpdateResult pushResult = this.mongoTemplate.updateFirst(
                        query(where(Constants.ID).is(addRatingRequest.getGuideId())
                                .and(Constants.RATINGS + "." + Constants.USERID).ne(userId)),
                        new Update().push(Constants.RATINGS, Rating.builder().userId(userId)
                                .punctuation(addRatingRequest.getRating()).build()),
                        Constants.GUIDE_COLLECTION);
                if (pushResult.wasAcknowledged() && pushResult.getModifiedCount() > 0) {
                    return "guide_updated";
                } else {
                    return "guide_not_found";
                }
            }
        } catch (Exception e) {
            return "internal_server_error";
        }
    }

    private String encodeImageAsBase64(MultipartFile image) {
        try {
            return Base64.getEncoder().encodeToString(image.getBytes());
        } catch (IOException e) {
            return "error_encoding";
        }
    }

    private String insertGuide(String userId, Guide guide) {
        var dbCheck = this.guideRepository.save(guide);
        if (this.guideRepository.existsById(dbCheck.getId())) {
            String result = this.userService.updateCreating(userId, dbCheck.getId());
            return result.equals("creating_updated")
                    ? result + "?id=" + dbCheck.getId()
                    : result;
        } else {
            return "error_creating_guide";
        }
    }
}
