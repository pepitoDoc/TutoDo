package edu.dam.rest.microservice.service;

import edu.dam.rest.microservice.persistence.model.GuideType;
import edu.dam.rest.microservice.persistence.repository.GuideTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for managing guide types.
 */
@Service
public class GuideTypeService {

    private GuideTypeRepository guideTypeRepository;

    /**
     * Constructs a GuideTypeService instance with necessary dependencies.
     *
     * @param guideTypeRepository The repository for managing guide types.
     */
    @Autowired
    public GuideTypeService(GuideTypeRepository guideTypeRepository) {
        this.guideTypeRepository = guideTypeRepository;
    }

    /**
     * Retrieves all guide types from the repository.
     *
     * @return A list of strings representing all guide types.
     */
    public List<String> findAllGuideTypes() {
        var allGuideTypes = this.guideTypeRepository.findAll();
        return allGuideTypes.stream().map(GuideType::getType).collect(Collectors.toList());
    }

}
