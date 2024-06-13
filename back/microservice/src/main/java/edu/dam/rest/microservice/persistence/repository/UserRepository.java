package edu.dam.rest.microservice.persistence.repository;

import edu.dam.rest.microservice.persistence.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);

    List<User> findAllByUsernameOrEmail(String username, String email);

    @Query("{ 'username': { $regex: ?0, $options: 'i' } }")
    User findByUsernameRegex(String username);

    @Query("{ 'username': { $regex: ?0, $options: 'i' } }")
    Page<User> findAllByUsernameRegex(String username, Pageable pageable);


}
