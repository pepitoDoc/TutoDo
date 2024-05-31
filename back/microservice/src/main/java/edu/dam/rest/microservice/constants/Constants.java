package edu.dam.rest.microservice.constants;

import java.util.List;

public class Constants {

    public static final String ID = "_id";

    public static final String GUIDE_COLLECTION = "guide";
    public static final String USERID = "userId";
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

    public static final String GUIDE_TYPE_COLLECTION = "guideType";
    public static final List<String> VALID_IMAGE_TYPES = List.of("image/jpeg", "image/png", "image/gif");

}
