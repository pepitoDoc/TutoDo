package edu.dam.rest.microservice.persistence.repository;

import edu.dam.rest.microservice.persistence.model.Guide;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GuideRepository extends MongoRepository<Guide, String> {

    List<Guide> findByUserId(String userid);

}
