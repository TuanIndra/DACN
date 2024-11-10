package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.FriendshipDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Entity.Friendship;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Service.FriendshipService;
import com.example.WebSocialMedia_Server.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @Autowired
    private UserService userService;

    // Gửi yêu cầu kết bạn
    @PostMapping("/request")
    public ResponseEntity<String> sendFriendRequest(@RequestParam Long userId, Authentication authentication) {
        String username = authentication.getName();
        Long requesterId = userService.findByUsername(username).getId();

        friendshipService.sendFriendRequest(requesterId, userId);
        return ResponseEntity.ok("Friend request sent.");
    }

    // Chấp nhận yêu cầu kết bạn
    @PostMapping("/accept")
    public ResponseEntity<String> acceptFriendRequest(@RequestParam Long friendshipId, Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findByUsername(username).getId();

        friendshipService.acceptFriendRequest(friendshipId, userId);
        return ResponseEntity.ok("Friend request accepted.");
    }

    // Từ chối hoặc hủy yêu cầu kết bạn
    @PostMapping("/decline")
    public ResponseEntity<String> declineFriendRequest(@RequestParam Long friendshipId, Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findByUsername(username).getId();

        friendshipService.declineFriendRequest(friendshipId, userId);
        return ResponseEntity.ok("Friend request declined.");
    }
    // Endpoint lấy danh sách bạn bè
    @GetMapping("/accepted")
    public ResponseEntity<List<UserDTO>> getAcceptedFriends(Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findByUsername(username).getId();

        List<UserDTO> friends = friendshipService.getAcceptedFriends(userId);
        return ResponseEntity.ok(friends);
    }
    // Endpoint lấy danh sách yêu cầu kết bạn đã nhận (Pending Received)
    @GetMapping("/pending/received")
    public ResponseEntity<List<FriendshipDTO>> getPendingReceivedRequests(Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findByUsername(username).getId();

        List<FriendshipDTO> friendRequests = friendshipService.getPendingReceivedRequests(userId);
        return ResponseEntity.ok(friendRequests);
    }

    // Endpoint lấy danh sách yêu cầu kết bạn đã gửi (Pending Sent)
    @GetMapping("/pending/sent")
    public ResponseEntity<List<FriendshipDTO>> getPendingSentRequests(Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findByUsername(username).getId();

        List<FriendshipDTO> sentRequests = friendshipService.getPendingSentRequests(userId);
        return ResponseEntity.ok(sentRequests);
    }


//    @GetMapping("/requests")
//    public ResponseEntity<List<FriendshipDTO>> getReceivedFriendRequests(Authentication authentication) {
//        String username = authentication.getName();
//        Long userId = userService.findByUsername(username).getId();
//
//        List<Friendship> friendRequests = friendshipService.getReceivedFriendRequests(userId);
//        List<FriendshipDTO> dtoList = friendshipService.convertToDTOList(friendRequests);
//        return ResponseEntity.ok(dtoList);
//    }
//
//    // Lấy danh sách bạn bè
//    @GetMapping
//    public ResponseEntity<List<User>> getFriends(Authentication authentication) {
//        String username = authentication.getName();
//        Long userId = userService.findByUsername(username).getId();
//
//        List<User> friends = friendshipService.getFriends(userId);
//        return ResponseEntity.ok(friends);
//    }

}