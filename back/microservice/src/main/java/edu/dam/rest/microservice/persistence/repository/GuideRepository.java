package edu.dam.rest.microservice.persistence.repository;

import edu.dam.rest.microservice.persistence.model.Guide;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface GuideRepository extends MongoRepository<Guide, String> {

    List<Guide> findByUserId(String userId);

    @Query("{ '_id' : { $in: ?0 } }")
    Page<Guide> findById(List<String> ids, Pageable pageable);

}
