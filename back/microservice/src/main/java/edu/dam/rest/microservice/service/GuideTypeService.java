package edu.dam.rest.microservice.service;

import edu.dam.rest.microservice.persistence.model.GuideType;
import edu.dam.rest.microservice.persistence.repository.GuideTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GuideTypeService {

    private GuideTypeRepository guideTypeRepository;

    @Autowired
    public GuideTypeService(GuideTypeRepository guideTypeRepository) {
        this.guideTypeRepository = guideTypeRepository;
    }

    public List<String> findAllGuideTypes() {
        var allGuideTypes = this.guideTypeRepository.findAll();
        return allGuideTypes.stream().map(GuideType::getType).collect(Collectors.toList());
    }

}
