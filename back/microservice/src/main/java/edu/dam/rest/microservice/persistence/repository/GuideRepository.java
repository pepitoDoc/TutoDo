package edu.dam.rest.microservice.persistence.repository;

import edu.dam.rest.microservice.persistence.model.Guide;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GuideRepository extends MongoRepository<Guide, String> {

    Guide findByUserid(String userid);

}
