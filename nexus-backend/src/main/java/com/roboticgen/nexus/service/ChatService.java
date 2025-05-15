package com.roboticgen.nexus.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.roboticgen.nexus.dto.ChatRequest;
import com.roboticgen.nexus.dto.ChatResponse;
import com.roboticgen.nexus.exception.ChatException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public ChatResponse chat(ChatRequest req) {
        try {
            // Build messages array
            ArrayNode messages = mapper.createArrayNode();
            messages.addObject()
                    .put("role", "system")
                    .put("content", "You are an expert software engineer and coding assistant. Help users resolve programming-related issues with clear explanations and code examples.");

            List<Map<String, String>> history = req.getHistory();
            if (history != null) {
                for (var msg : history) {
                    messages.addObject()
                            .put("role", msg.get("role"))
                            .put("content", msg.get("content"));
                }
            }

            messages.addObject()
                    .put("role", "user")
                    .put("content", req.getMessage());

            // Build request body
            ObjectNode body = mapper.createObjectNode()
                    .put("model", "gpt-3.5-turbo")
                    .set("messages", messages);

            HttpRequest httpReq = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                    .build();

            HttpResponse<String> response =
                httpClient.send(httpReq, HttpResponse.BodyHandlers.ofString());

            JsonNode json = mapper.readTree(response.body());
            String reply = json.path("choices")
                               .get(0)
                               .path("message")
                               .path("content")
                               .asText();

            return new ChatResponse(reply);

        } catch (Exception e) {
            throw new ChatException("Failed to call OpenAI", e);
        }
    }
}
