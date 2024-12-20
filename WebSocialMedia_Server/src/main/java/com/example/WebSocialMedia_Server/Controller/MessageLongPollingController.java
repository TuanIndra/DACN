//package com.example.WebSocialMedia_Server.Controller;
//
//import com.example.WebSocialMedia_Server.DTO.MessageDTO;
//import com.example.WebSocialMedia_Server.Service.MessageService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/messages")
//public class MessageLongPollingController {
//
//    private static final long TIMEOUT = 30000;
//    private final MessageService messageService;
//
//    public MessageLongPollingController(MessageService messageService) {
//        this.messageService = messageService;
//    }
//
//    @GetMapping("/long-poll")
//    public ResponseEntity<List<MessageDTO>> longPoll(
//            @RequestParam Long userId,
//            @RequestParam Long conversationId) {
//        long startTime = System.currentTimeMillis();
//        List<MessageDTO> newMessages;
//
//        do {
//            newMessages = messageService.getNewMessages(userId, conversationId);
//
//            if (!newMessages.isEmpty()) {
//                return ResponseEntity.ok(newMessages);
//            }
//
//            try {
//                Thread.sleep(1000);
//            } catch (InterruptedException e) {
//                return ResponseEntity.noContent().build();
//            }
//        } while ((System.currentTimeMillis() - startTime) < TIMEOUT);
//
//        return ResponseEntity.noContent().build();
//    }
//
//    @PostMapping("/send")
//    public ResponseEntity<MessageDTO> sendMessage(
//            @RequestParam Long senderId,
//            @RequestParam Long receiverId,
//            @RequestParam String content) {
//
//        MessageDTO msg = messageService.sendMessage(senderId, receiverId, content);
//        return ResponseEntity.ok(msg);
//    }
//}
