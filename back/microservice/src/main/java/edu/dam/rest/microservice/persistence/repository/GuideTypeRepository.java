package edu.dam.rest.microservice.persistence.repository;

import edu.dam.rest.microservice.persistence.model.GuideType;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GuideTypeRepository extends MongoRepository<GuideType, String> {

    GuideType findByType(String type);
    boolean existsByType(String type);

}
