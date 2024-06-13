package edu.dam.rest.microservice.constants;

import java.util.Map;

public class Constants {

    public static final String ID = "_id";

    public static final String GUIDE_COLLECTION = "guide";
    public static final String USER_ID = "userId";
    public static final String TITLE = "title";
    public static final String DESCRIPTION = "description";
    public static final String PUBLISHED = "published";
    public static final String CREATION_DATE = "creationDate";
    public static final String STEPS = "steps";
    public static final String GUIDE_TYPES = "guideTypes";
    public static final String INGREDIENTS = "ingredients";
    public static final String COMMENTS = "comments";
    public static final String RATINGS = "ratings";
    public static final String PUNCTUATION = "punctuation";
    public static final String THUMBNAIL = "thumbnail";

    public static final String USER_COLLECTION = "user";
    public static final String USERNAME = "username";
    public static final String EMAIL = "email";
    public static final String PASSWORD = "password";
    public static final String CONFIRMED = "confirmed";
    public static final String COMPLETED = "completed";
    public static final String SAVED = "saved";
    public static final String CREATED = "created";
    public static final String PREFERENCES = "preferences";

    public static final String GUIDE_TYPE_COLLECTION = "guideType";
    public static final String[] VALID_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif"};
    public static final String[] FILTERED_ENDPOINTS = {"/v1/tutodo/guide/*", "/v1/tutodo/user/get-user",
            "/v1/tutodo/user/add-saved", "/v1/tutodo/user/remove-saved", "/v1/tutodo/user/logout",
            "/v1/tutodo/user/check-valid", "/v1/tutodo/user/update-confirmed", "/v1/tutodo/user/change-password-by-id",
            "/v1/tutodo/user/find-users", "/v1/tutodo/user/get-user-basic", "/v1/tutodo/user/add-completed",
            "/v1/tutodo/user/change-username", "/v1/tutodo/user/change-email", "/v1/tutodo/user/change-preferences"};
    public static final String MAIL_PASSWORD = "mail.smtp.password";
    public static final String MAIL_USER = "mail.smtp.user";
    public static final String MAIL_PROPERTIES = "mail.properties";
    public static final String CREDENTIAL_PROPERTIES = "credentials.properties";
    public static final String VERIFICATION_TITLE = "Código de verificación para verificar su cuenta en TutoDo";
    public static final String VERIFICATION_KEY = "verification";
    public static final String PASSWORD_TITLE = "Código de verificación para restablecer contraseña en TutoDo";
    public static final String PASSWORD_KEY = "password";
    public static final Map<String, String> EMAIL_TITLES = Map.ofEntries(
            Map.entry(VERIFICATION_KEY, VERIFICATION_TITLE),
            Map.entry(PASSWORD_KEY, PASSWORD_TITLE)
    );

    public static final int PAGE_SIZE = 8;

}
