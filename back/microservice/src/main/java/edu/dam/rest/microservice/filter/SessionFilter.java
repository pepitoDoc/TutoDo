package edu.dam.rest.microservice.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * Servlet Filter implementation for session validation.
 */
public class SessionFilter implements Filter {

    /**
     * Initializes the filter.
     *
     * @param filterConfig Filter configuration.
     * @throws ServletException If an error occurs during initialization.
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    /**
     * Filters incoming requests to check for session validity.
     *
     * @param servletRequest  The servlet request.
     * @param servletResponse The servlet response.
     * @param filterChain     The filter chain to proceed with the request.
     * @throws IOException      If an I/O error occurs during filtering.
     * @throws ServletException If an error occurs during filtering.
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    /**
     * Cleans up resources used by the filter.
     */
    @Override
    public void destroy() {
        Filter.super.destroy();
    }
}
