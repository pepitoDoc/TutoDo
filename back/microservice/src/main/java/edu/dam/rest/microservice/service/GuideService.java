package edu.dam.rest.microservice.service;

import edu.dam.rest.microservice.bean.guide.CreateGuideRequest;
import edu.dam.rest.microservice.bean.guide.SaveGuideStepsRequest;
import edu.dam.rest.microservice.persistence.model.Guide;
import edu.dam.rest.microservice.persistence.repository.GuideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.NoSuchElementException;

@Service
public class GuideService {

    private GuideRepository guideRepository;
    private UserService userService;

    @Autowired
    public GuideService(GuideRepository guideRepository, UserService userService) {
        this.guideRepository = guideRepository;
        this.userService = userService;
    }

    public String guideCreate(CreateGuideRequest createGuideRequest, String userid) {
        var guide = Guide.builder().userid(userid).
                title(createGuideRequest.getTitle())
                .description(createGuideRequest.getDescription())
                .published(false)
                .guideTypes(createGuideRequest.getGuideTypes())
                .creationDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")))
                .build();
        var dbCheck = this.guideRepository.save(guide);
        if (this.guideRepository.existsById(dbCheck.getId())) {
            String result = this.userService.updateUserCreating(userid, dbCheck.getId());
            return result.equals("guides_updated")
                    ? new StringBuilder(result).append("?id=").append(dbCheck.getId()).toString()
                    : result;
        } else {
            return "error_creating_guide";
        }
    }

    public String saveGuideSteps(SaveGuideStepsRequest saveGuideStepsRequest) {
        var savedGuideOpt = this.guideRepository.findById(saveGuideStepsRequest.getGuideId());
        if (savedGuideOpt.isPresent()) {
            try {
                var savedGuide = savedGuideOpt.orElseThrow();
                savedGuide.setSteps(saveGuideStepsRequest.getSteps());
                savedGuide.setPublished(saveGuideStepsRequest.isPublished());
                var dbCheck = this.guideRepository.save(savedGuide);
                if (this.guideRepository.existsById(dbCheck.getId())) {
                    return "guide_updated";
                } else {
                    return "error_updating_guide";
                }
            } catch (NoSuchElementException e) {
                return "error_updating_guide";
            }
        } else {
            return "guide_not_found";
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

}
