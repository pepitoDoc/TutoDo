package edu.dam.rest.microservice.service;

import edu.dam.rest.microservice.bean.guideType.FindAllGuideTypesResponse;
import edu.dam.rest.microservice.persistence.repository.GuideTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class GuideTypeService {

    private GuideTypeRepository guideTypeRepository;

    @Autowired
    public GuideTypeService(GuideTypeRepository guideTypeRepository) {
        this.guideTypeRepository = guideTypeRepository;
    }

    public FindAllGuideTypesResponse findAllGuideTypes() {
        var allGuideTypes = this.guideTypeRepository.findAll();
        if (allGuideTypes.size() == 0) {
            return null;
        } else {
            return FindAllGuideTypesResponse.builder()
                    .guideTypes(
                            allGuideTypes.stream().map( guideType -> guideType.getType()).collect(Collectors.toList()))
                    .build();
        }

    }

}
