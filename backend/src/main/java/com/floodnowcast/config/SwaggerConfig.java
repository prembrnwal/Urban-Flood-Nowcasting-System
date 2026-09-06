package com.floodnowcast.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI floodNowcastOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Urban Flood Nowcasting System API")
                        .description("⚠️ DEMO / SIMULATED DATA — SIH Prototype. " +
                                "Pipeline: Rainfall → Runoff → Drainage → Flood Depth → Risk → Alerts → Safe Routing")
                        .version("1.0.0-SIH-PROTOTYPE")
                        .contact(new Contact().name("Urban Flood Nowcasting Team"))
                        .license(new License().name("MIT")));
    }
}
