package edu.dam.rest.microservice.persistence.repository;

import edu.dam.rest.microservice.persistence.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    User findByUsername(String username);

    User findByEmail(String email);

    List<User> findByUsernameOrEmail(String username, String email);

    User findByUsernameRegex(String username);

}
