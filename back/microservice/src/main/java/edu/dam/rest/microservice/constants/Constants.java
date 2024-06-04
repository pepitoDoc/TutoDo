package edu.dam.rest.microservice.constants;

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
    public static final String DATE = "date";

    public static final String USER_COLLECTION = "user";
    public static final String USERNAME = "username";
    public static final String EMAIL = "email";
    public static final String PASSWORD = "password";
    public static final String CONFIRMED = "confirmed";
    public static final String COMPLETED = "completed";
    public static final String SAVED = "saved";
    public static final String CREATED = "created";

    public static final String GUIDE_TYPE_COLLECTION = "guideType";
    public static final String[] VALID_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif"};
    public static final String[] FILTERED_ENDPOINTS = {"/v1/tutodo/guide/*", "/v1/tutodo/user/delete",
            "/v1/tutodo/user/add-saved", "/v1/tutodo/user/get-user", "/v1/tutodo/user/add-saved",
            "/v1/tutodo/user/delete-saved", "/v1/tutodo/user/logout"};

}
