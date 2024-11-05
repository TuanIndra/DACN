package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.FriendshipDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Entity.Friendship;
import com.example.WebSocialMedia_Server.Entity.FriendshipStatus;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Repository.FriendshipRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.DTO.FriendshipDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FriendshipService {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;

    // Gửi yêu cầu kết bạn
    @Transactional
    public Friendship sendFriendRequest(Long requesterId, Long addresseeId) {
        if (requesterId.equals(addresseeId)) {
            throw new IllegalArgumentException("Cannot send friend request to yourself.");
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester not found"));

        User addressee = userRepository.findById(addresseeId)
                .orElseThrow(() -> new RuntimeException("Addressee not found"));

        // Kiểm tra xem đã có yêu cầu kết bạn giữa hai người dùng chưa
        Optional<Friendship> existingFriendship = friendshipRepository.findByRequesterAndAddressee(requester, addressee);
        if (existingFriendship.isPresent()) {
            throw new RuntimeException("Friend request already sent.");
        }

        // Tạo yêu cầu kết bạn mới
        Friendship friendship = Friendship.builder()
                .requester(requester)
                .addressee(addressee)
                .status(FriendshipStatus.PENDING)
                .build();

        return friendshipRepository.save(friendship);
    }

    // Chấp nhận yêu cầu kết bạn
    @Transactional
    public Friendship acceptFriendRequest(Long friendshipId, Long addresseeId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!friendship.getAddressee().getId().equals(addresseeId)) {
            throw new RuntimeException("You are not authorized to accept this friend request.");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        return friendshipRepository.save(friendship);
    }

    // Từ chối hoặc hủy yêu cầu kết bạn
    @Transactional
    public void declineFriendRequest(Long friendshipId, Long userId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!friendship.getAddressee().getId().equals(userId) && !friendship.getRequester().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to decline this friend request.");
        }

        friendshipRepository.delete(friendship);
    }

//    // Lấy danh sách yêu cầu kết bạn đã nhận
//    public List<Friendship> getReceivedFriendRequests(Long userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        return friendshipRepository.findByAddresseeAndStatus(user, FriendshipStatus.PENDING);
//    }
//    public FriendshipDTO convertToDTO(Friendship friendship) {
//        FriendshipDTO dto = new FriendshipDTO();
//        dto.setId(friendship.getId());
//        dto.setStatus(friendship.getStatus());
//
//        UserDTO requesterDTO = new UserDTO();
//        requesterDTO.setId(friendship.getRequester().getId());
//        requesterDTO.setUsername(friendship.getRequester().getUsername());
//        requesterDTO.setFullName(friendship.getRequester().getFullName());
//        requesterDTO.setAvatarUrl(friendship.getRequester().getAvatarUrl());
//
//        UserDTO addresseeDTO = new UserDTO();
//        addresseeDTO.setId(friendship.getAddressee().getId());
//        addresseeDTO.setUsername(friendship.getAddressee().getUsername());
//        addresseeDTO.setFullName(friendship.getAddressee().getFullName());
//        addresseeDTO.setAvatarUrl(friendship.getAddressee().getAvatarUrl());
//
//        dto.setRequester(requesterDTO);
//        dto.setAddressee(addresseeDTO);
//
//        return dto;
//    }
//
//    public List<FriendshipDTO> convertToDTOList(List<Friendship> friendships) {
//        List<FriendshipDTO> dtoList = new ArrayList<>();
//        for (Friendship friendship : friendships) {
//            dtoList.add(convertToDTO(friendship));
//        }
//        return dtoList;
//    }
//    // Phương thức lấy danh sách bạn bè trả về danh sách User
    public List<User> getFriends(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Friendship> friendships = friendshipRepository.findByRequesterAndStatusOrAddresseeAndStatus(
                user, FriendshipStatus.ACCEPTED, user, FriendshipStatus.ACCEPTED);

        List<User> friends = new ArrayList<>();
        for (Friendship friendship : friendships) {
            if (friendship.getRequester().equals(user)) {
                friends.add(friendship.getAddressee());
            } else {
                friends.add(friendship.getRequester());
            }
        }
        return friends;
    }
    // Phương thức lấy danh sách bạn bè
    public List<UserDTO> getAcceptedFriends(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy danh sách các mối quan hệ bạn bè đã được chấp nhận
        List<Friendship> friendships = friendshipRepository.findAcceptedFriendships(user);

        // Chuyển đổi danh sách Friendship sang danh sách UserDTO
        List<UserDTO> friends = new ArrayList<>();
        for (Friendship friendship : friendships) {
            User friend;
            if (friendship.getRequester().equals(user)) {
                friend = friendship.getAddressee();
            } else {
                friend = friendship.getRequester();
            }
            UserDTO friendDTO = convertUserToDTO(friend);
            friends.add(friendDTO);
        }
        return friends;
    }

    // Phương thức chuyển đổi User sang UserDTO
    private UserDTO convertUserToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setFullName(user.getFullName());
        userDTO.setAvatarUrl(user.getAvatarUrl());
        return userDTO;
    }

    // Phương thức lấy danh sách yêu cầu kết bạn đã nhận (Pending Received)
    public List<FriendshipDTO> getPendingReceivedRequests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Friendship> friendships = friendshipRepository.findByAddresseeAndStatus(user, FriendshipStatus.PENDING);

        return convertFriendshipsToDTOs(friendships);
    }

    // Phương thức lấy danh sách yêu cầu kết bạn đã gửi (Pending Sent)
    public List<FriendshipDTO> getPendingSentRequests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Friendship> friendships = friendshipRepository.findByRequesterAndStatus(user, FriendshipStatus.PENDING);

        return convertFriendshipsToDTOs(friendships);
    }
    // Phương thức chuyển đổi Friendship sang FriendshipDTO
    private FriendshipDTO convertFriendshipToDTO(Friendship friendship) {
        FriendshipDTO dto = new FriendshipDTO();
        dto.setId(friendship.getId());
        dto.setStatus(friendship.getStatus());

        UserDTO requesterDTO = convertUserToDTO(friendship.getRequester());
        UserDTO addresseeDTO = convertUserToDTO(friendship.getAddressee());

        dto.setRequester(requesterDTO);
        dto.setAddressee(addresseeDTO);

        return dto;
    }
    // Phương thức chuyển đổi danh sách Friendship sang danh sách FriendshipDTO
    private List<FriendshipDTO> convertFriendshipsToDTOs(List<Friendship> friendships) {
        List<FriendshipDTO> dtoList = new ArrayList<>();
        for (Friendship friendship : friendships) {
            dtoList.add(convertFriendshipToDTO(friendship));
        }
        return dtoList;
    }
}
