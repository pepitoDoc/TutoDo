package edu.dam.rest.microservice.constants;

import java.util.List;

public class ApiConstants {

    public static final String ENDPOINT = "v1/tutodo/";
    public static final String USER_ENDPOINT = ENDPOINT + "user/";
    public static final String GUIDE_ENDPOINT = ENDPOINT + "guide/";
    public static final String GUIDE_TYPE_ENDPOINT = ENDPOINT + "guideType/";
    public static final String SHARED_ENDPOINT = ENDPOINT + "shared/";
    public static final String MULTIPART_FORM_DATA = "multipart/form-data";
    public static final List<String> VALID_IMAGE_TYPES = List.of("image/jpeg", "image/png", "image/gif");
    public static final long MAX_AGE = 1800;

}
