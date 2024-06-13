package edu.dam.rest.microservice.util;

import java.util.Random;
import java.util.stream.Collectors;

/**
 * Clase que genera la clave que se usará para autorizar
 * una operación a través de correo electrónico
 * @author : Álvaro Terrasa
 * @version : 1.0
 */
public class VerificationCodeGenerator {

    /**
     * Objeto Random
     */
    private Random random;
    /**
     * String que contiene los diferentes caracteres que se usarán en la generación de la clave
     */
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    /**
     * Longitud de caracteres de la clave que se va a generar
     */
    private static final int CODE_LENGTH = 8;

    /**
     * Constructor sin argumentos que inicializa el atributo random.
     */
    public VerificationCodeGenerator() {
        this.random = new Random();
    }

    /**
     * Método que genera la clave
     * @return - String - La clave
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