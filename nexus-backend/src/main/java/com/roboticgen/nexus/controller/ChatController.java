package com.roboticgen.nexus.controller;

import com.roboticgen.nexus.dto.ChatRequest;
import com.roboticgen.nexus.dto.ChatResponse;
import com.roboticgen.nexus.exception.ChatException;
import com.roboticgen.nexus.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List; 

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody ChatRequest req) {
        try {
            ChatResponse resp = chatService.chat(req);
            return ResponseEntity.ok(resp);
        } catch (ChatException ex) {
            // you can inspect ex.getCause() for details
            return ResponseEntity
                .status(500)
                .body(Map.of("error", "Chat failed. Please try again later."));
        }
    }
}
