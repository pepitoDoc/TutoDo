package edu.dam.rest.microservice.util;

import java.util.Random;
import java.util.stream.Collectors;

import java.util.Random;
import java.util.stream.Collectors;

/**
 * Utility class for generating random verification codes.
 */
public class VerificationCodeGenerator {

    private final Random random;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int CODE_LENGTH = 8;

    /**
     * Constructs a VerificationCodeGenerator instance.
     */
    public VerificationCodeGenerator() {
        this.random = new Random();
    }

    /**
     * Generates a random verification code.
     *
     * @return A string representing the generated verification code.
     */
    public String generateVerificationCode() {
        return this.random.ints(0, CHARACTERS.length())
                .mapToObj(CHARACTERS::charAt)
                .distinct()
                .limit(CODE_LENGTH)
                .map(Object::toString)
                .collect(Collectors.joining());
    }
}
