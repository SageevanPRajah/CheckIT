package com.roboticgen.nexus.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Directory on disk (relative to your working dir) where files are stored.
     * Make sure this matches your app.upload.dir in application.properties.
     */
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Allow CORS from your frontend origins.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "https://testmedhub.vercel.app"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }

    /**
     * Expose files under `uploadDir` at path /uploads/**
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                // note the trailing slash
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
