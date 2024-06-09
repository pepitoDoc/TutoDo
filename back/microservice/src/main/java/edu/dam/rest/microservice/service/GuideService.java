package edu.dam.rest.microservice.service;

import com.mongodb.BasicDBObject;
import com.mongodb.client.result.UpdateResult;
import edu.dam.rest.microservice.bean.guide.*;
import edu.dam.rest.microservice.bean.user.UserSession;
import edu.dam.rest.microservice.constants.Constants;
import edu.dam.rest.microservice.persistence.model.*;
import edu.dam.rest.microservice.persistence.repository.GuideRepository;
import edu.dam.rest.microservice.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
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
        var guide = Guide.builder()
                .userId(userId)
                .title(createGuideRequest.getTitle())
                .description(createGuideRequest.getDescription())
                .published(false)
                .creationDate(LocalDateTime.now())
                .steps(new ArrayList<>())
                .guideTypes(createGuideRequest.getGuideTypes())
                .ingredients(createGuideRequest.getIngredients().isEmpty()
                        ? new ArrayList<>() : createGuideRequest.getIngredients())
                .comments(new ArrayList<>())
                .ratings(new ArrayList<>())
                .build();
        if (guideThumbnail != null && Arrays.asList(Constants.VALID_IMAGE_TYPES)
                .contains(guideThumbnail.getContentType())) {
            var encodedThumbnail = this.encodeImageAsBase64(guideThumbnail);
            if (encodedThumbnail.equals("error_encoding")) {
                return "error_creating_guide";
            }
        } else {
            guide.setThumbnail("");
        }
        return this.insertGuide(userId, guide);
    }

    public String saveGuideStep(SaveGuideStepRequest saveGuideStepRequest, MultipartFile stepImage) {
        try {
            var step = new Step();
            if (stepImage != null && Arrays.asList(Constants.VALID_IMAGE_TYPES)
                    .contains(stepImage.getContentType())) {
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
            if (guideThumbnail != null && Arrays.asList(Constants.VALID_IMAGE_TYPES)
                    .contains(guideThumbnail.getContentType())) {
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

    public List<FindByFilterResponse> findByFilter(FindByFilterRequest findByFilterRequest) {
        var operations = new ArrayList<AggregationOperation>();
        if (!findByFilterRequest.getTitle().isEmpty()) {
            operations.add(match(where(Constants.TITLE).regex(findByFilterRequest.getTitle(), "i")));
        }
        if (!findByFilterRequest.getGuideTypes().isEmpty()) {
            operations.add(match(where(Constants.GUIDE_TYPES).in(findByFilterRequest.getGuideTypes())));
        }
        if (!findByFilterRequest.getUsername().isEmpty()) {
            var userPattern = Pattern.compile(
                    findByFilterRequest.getUsername(), Pattern.CASE_INSENSITIVE);
            var userFound = this.userRepository.findByUsernameRegex(userPattern.toString());
            if (userFound != null) {
                operations.add(match(where(Constants.USER_ID).is(userFound.getId())));
            }
        }
        operations.add(match(where(Constants.PUBLISHED).is(true)));
        if (findByFilterRequest.getRating() != null && findByFilterRequest.getRating() > 0) {
            operations.add(unwind(Constants.RATINGS));
            operations.add(group(Constants.ID).avg("$ratings.punctuation")
                    .as("averagePunctuation"));
            operations.add(match(where("averagePunctuation").gte(findByFilterRequest.getRating())));
            var result = this.mongoTemplate.aggregate(
                    newAggregation(operations), Constants.GUIDE_COLLECTION, BasicDBObject.class);
            return result.getMappedResults().stream()
                    .map(guide -> this.guideRepository.findById(guide.getObjectId(Constants.ID).toString()))
                    .filter(Optional::isPresent)
                    .map(guide -> {
                        var guideOwner = this.userRepository.findById(guide.orElseThrow().getUserId());
                        if (guideOwner.isPresent()) {
                            return FindByFilterResponse.builder()
                                    .guideFound(guide.orElseThrow())
                                    .creatorUsername(guideOwner.orElseThrow().getUsername())
                                    .build();
                        } else {
                            return null;
                        }
                    })
                    .collect(Collectors.toList());
        } else {
            var result = this.mongoTemplate.aggregate(
                    newAggregation(operations), Constants.GUIDE_COLLECTION, Guide.class);
            return result.getMappedResults().stream()
                    .map(guide -> {
                        var guideOwner = this.userRepository.findById(guide.getUserId());
                        if (guideOwner.isPresent()) {
                            return FindByFilterResponse.builder()
                                    .guideFound(guide)
                                    .creatorUsername(guideOwner.orElseThrow().getUsername())
                                    .build();
                        } else {
                            return null;
                        }
                    })
                    .collect(Collectors.toList());
        }
    }

    public List<Guide> findOwnGuides(String userId) {
        var userQuery = new Query().addCriteria(where(Constants.ID).is(userId));
        userQuery.fields().include(Constants.CREATED);
        var userQueryResult = this.mongoTemplate.findOne(userQuery, CreatedProjection.class, Constants.USER_COLLECTION);
        if (userQueryResult != null) {
            return this.guideRepository.findAllById(userQueryResult.getCreated());
        } else {
            return null;
        }
    }

    public AddCommentResponse addComent(AddCommentRequest addCommentRequest, UserSession userSession) {
        try {
            var comment = Comment.builder()
                    .userId(userSession.getId())
                    .username(userSession.getUsername())
                    .text(addCommentRequest.getComment())
                    .date(Instant.now())
                    .build();
            UpdateResult result = this.mongoTemplate.updateFirst(
                    query(where(Constants.ID).is(addCommentRequest.getGuideId())),
                    new Update().push(Constants.COMMENTS, comment),
                    Constants.GUIDE_COLLECTION);
            var addCommentResponse = AddCommentResponse.builder().comment(comment).build();
            if (result.wasAcknowledged() && result.getModifiedCount() > 0) {
                addCommentResponse.setResult("operation_successful");
            } else {
                addCommentResponse.setResult("operation_unsuccessful");
            }
            return addCommentResponse;
        } catch (Exception e) {
            return AddCommentResponse.builder().result("internal_server_error").comment(null).build();
        }
    }

    public String addRating(AddRatingRequest addRatingRequest, String userId) {
        try {
            UpdateResult setResult = this.mongoTemplate.updateFirst(
                    query(where(Constants.ID).is(addRatingRequest.getGuideId())
                            .and(Constants.RATINGS + "." + Constants.USER_ID).is(userId)),
                    new Update().set(Constants.RATINGS + ".$." + Constants.PUNCTUATION,
                            addRatingRequest.getPunctuation()),
                    Constants.GUIDE_COLLECTION);
            if (setResult.wasAcknowledged() && setResult.getMatchedCount() > 0) { // TODO no distingue si cambia la puntuación o no
                return "guide_updated";
            } else {
                UpdateResult pushResult = this.mongoTemplate.updateFirst(
                        query(where(Constants.ID).is(addRatingRequest.getGuideId())
                                .and(Constants.RATINGS + "." + Constants.USER_ID).ne(userId)),
                        new Update().push(Constants.RATINGS, Rating.builder().userId(userId)
                                .punctuation(addRatingRequest.getPunctuation()).build()),
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

    public boolean getPublishedPermission(String guideId, String userId) {
        var foundGuide = this.guideRepository.findById(guideId);
        if (foundGuide.isPresent()) {
            var result = foundGuide.orElseThrow();
            return result.isPublished() || result.getUserId().equals(userId);
        } else {
            return false;
        }
    }

    public String deleteGuide(String guideId, String userId) {
        var deleteResult = this.mongoTemplate.remove(
                query(where(Constants.ID).is(guideId)), Constants.GUIDE_COLLECTION);
        if (deleteResult.wasAcknowledged() && deleteResult.getDeletedCount() > 0) {
            var userUpdate = this.userService.deleteFromUserStringArray(userId, guideId, Constants.CREATED);
            if (userUpdate.equals("operation_successful")) {
                return "operation_successful";
            } else {
                return "operation_unsuccessful";
            }
        } else {
            return "operation_unsuccessful";
        }
    }

    public String deleteComment(DeleteCommentRequest deleteCommentRequest) {
        Comment comment = Comment.builder()
                .userId(deleteCommentRequest.getUserId())
                .username(deleteCommentRequest.getUsername())
                .text(deleteCommentRequest.getText())
                .date(deleteCommentRequest.getDate())
                .build();
        UpdateResult pushResult = this.mongoTemplate.updateFirst(
                query(where(Constants.ID).is(deleteCommentRequest.getGuideId())),
                new Update().pull(Constants.COMMENTS, comment),
                Constants.GUIDE_COLLECTION);
        if (pushResult.wasAcknowledged() && pushResult.getModifiedCount() > 0) {
            return "operation_successful";
        } else {
            return "operation_unsuccessful";
        }
    }

    public List<Guide> findNewestGuides() {
        var operations = new ArrayList<AggregationOperation>();
        operations.add(sort(Sort.by(Sort.Order.desc(Constants.CREATION_DATE))));
        operations.add(limit(10));
        var result = this.mongoTemplate.aggregate(
                newAggregation(operations), Constants.GUIDE_COLLECTION, Guide.class);
        return result.getMappedResults().stream().filter(Guide::isPublished).toList();
    }

    public List<Guide> findNewestGuidesByPreference(String preference) {
        var operations = new ArrayList<AggregationOperation>();
        operations.add(match(where(Constants.GUIDE_TYPES).in(preference)));
        operations.add(sort(Sort.by(Sort.Order.desc(Constants.CREATION_DATE))));
        operations.add(limit(10));
        var result = this.mongoTemplate.aggregate(
                newAggregation(operations), Constants.GUIDE_COLLECTION, Guide.class);
        return result.getMappedResults().stream().filter(Guide::isPublished).toList();
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
            String result = this.userService.addToUserStringArray(userId, dbCheck.getId(), Constants.CREATED);
            return result.equals("operation_successful")
                    ? result + "?id=" + dbCheck.getId()
                    : result;
        } else {
            return "operation_unsuccessful";
        }
    }
}
