package edu.dam.rest.microservice.service;

import com.mongodb.BasicDBObject;
import com.mongodb.client.result.UpdateResult;
import edu.dam.rest.microservice.bean.guide.*;
import edu.dam.rest.microservice.constants.Constants;
import edu.dam.rest.microservice.persistence.model.Comment;
import edu.dam.rest.microservice.persistence.model.Guide;
import edu.dam.rest.microservice.persistence.model.Rating;
import edu.dam.rest.microservice.persistence.model.User;
import edu.dam.rest.microservice.persistence.repository.GuideRepository;
import edu.dam.rest.microservice.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
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
            var dbCheck = this.guideRepository.save(guide);
            if (this.guideRepository.existsById(dbCheck.getId())) {
                String result = this.userService.updateCreating(userId, dbCheck.getId());
                return result.equals("creating_updated")
                        ? result + "?id=" + dbCheck.getId()
                        : result;
            } else {
                return "error_creating_guide";
            }
        } else {
            return "error_creating_guide";
        }
    }

    public String saveGuideSteps(SaveGuideStepsRequest saveGuideStepsRequest) {
        try {
            UpdateResult result = this.mongoTemplate.updateFirst(
                    query(where(Constants.ID).is(saveGuideStepsRequest.getGuideId())),
                    new Update().set(Constants.STEPS, saveGuideStepsRequest.getSteps())
                            .set(Constants.PUBLISHED, saveGuideStepsRequest.isPublished()),
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

    public String saveGuideInfo(SaveGuideInfoRequest saveGuideInfoRequest) {
        try {
            UpdateResult result = this.mongoTemplate.updateFirst(
                    query(where(Constants.ID).is(saveGuideInfoRequest.getGuideId())),
                    new Update().set(Constants.TITLE, saveGuideInfoRequest.getTitle())
                            .set(Constants.DESCRIPTION, saveGuideInfoRequest.getDescription())
                            .set(Constants.GUIDE_TYPES, saveGuideInfoRequest.getGuideTypes()),
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
            try {
                return foundGuide.orElseThrow();
            } catch (NoSuchElementException e) {
                return null;
            }
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
        List<AggregationOperation> operations = new ArrayList<>();
        if (!findByFilterRequest.getTitle().isEmpty()) {
            operations.add(match(new Criteria("title").regex(findByFilterRequest.getTitle(), "i")));
        }
        if (!findByFilterRequest.getGuideTypes().isEmpty()) {
            operations.add(match(new Criteria("guideTypes").in(findByFilterRequest.getGuideTypes())));
        }
        if (findByFilterRequest.getRating() != null && findByFilterRequest.getRating() >= 0) {
            operations.add(unwind("ratings"));
            operations.add(group("_id").avg("$ratings.punctuation").as("averagePunctuation"));
            operations.add(match(new Criteria("averagePunctuation").gt(findByFilterRequest.getRating())));
        }
        Aggregation aggregation = newAggregation(operations);
        AggregationResults<BasicDBObject> results = this.mongoTemplate.aggregate(
                aggregation, "guide", BasicDBObject.class);
        return results.getMappedResults().stream()
                .map(result -> this.guideRepository.findById(result.getObjectId("_id").toString()))
                .filter(result -> {
                    if (result.isPresent() && !findByFilterRequest.getUsername().isEmpty()) {
                        Pattern userPattern = Pattern.compile(
                                findByFilterRequest.getUsername(), Pattern.CASE_INSENSITIVE);
                        User foundUser = this.userRepository.findByUsernameRegex(userPattern.toString());
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
}
