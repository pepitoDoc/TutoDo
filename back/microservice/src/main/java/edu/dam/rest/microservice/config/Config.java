package edu.dam.rest.microservice.config;

import edu.dam.rest.microservice.constants.Constants;
import edu.dam.rest.microservice.filter.SessionFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.session.data.mongo.JdkMongoSessionConverter;
import org.springframework.session.data.mongo.config.annotation.web.http.EnableMongoHttpSession;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.time.Duration;

/**
 * Configuration class for setting up session management, CORS, and filters.
 *
 * <p>This class configures:</p>
 * <ul>
 *   <li>{@link JdkMongoSessionConverter}: Converts sessions to and from MongoDB.</li>
 *   <li>{@link CorsFilter}: Configures CORS (Cross-Origin Resource Sharing) for allowing requests from localhost:4200.</li>
 *   <li>{@link SessionFilter}: Registers a session validation filter for specific endpoints.</li>
 * </ul>
 */
@Configuration(proxyBeanMethods = false)
@EnableMongoHttpSession
public class Config {

    /**
     * Configures the session converter for MongoDB sessions.
     *
     * @return JdkMongoSessionConverter instance with a session timeout of 30 minutes.
     */
    @Bean
    public JdkMongoSessionConverter jdkMongoSessionConverter() {
        return new JdkMongoSessionConverter(Duration.ofMinutes(30));
    }

    /**
     * Configures a CORS filter to allow requests from http://localhost:4200.
     *
     * @return FilterRegistrationBean<CorsFilter> instance configured for CORS.
     */
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:4200");
        config.setAllowCredentials(true);
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setMaxAge(3600L);
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

    /**
     * Configures a session validation filter using SessionFilter.
     *
     * @return FilterRegistrationBean<SessionFilter> instance configured for session validation.
     */
    @Bean
    public FilterRegistrationBean<SessionFilter> sessionValidationFilter() {
        FilterRegistrationBean<SessionFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new SessionFilter());
        registrationBean.addUrlPatterns(Constants.FILTERED_ENDPOINTS);
        registrationBean.setOrder(Ordered.LOWEST_PRECEDENCE);
        return registrationBean;
    }

}