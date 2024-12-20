package com.example.WebSocialMedia_Server.Repository;

import com.example.WebSocialMedia_Server.Entity.Friendship;
import com.example.WebSocialMedia_Server.Entity.FriendshipStatus;
import com.example.WebSocialMedia_Server.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    // Tìm kiếm mối quan hệ kết bạn giữa hai người dùng
    Optional<Friendship> findByRequesterAndAddressee(User requester, User addressee);

    // Lấy danh sách yêu cầu kết bạn mà người dùng đã gửi
    List<Friendship> findByRequesterAndStatus(User requester, FriendshipStatus status);

    // Lấy danh sách yêu cầu kết bạn mà người dùng đã nhận
    List<Friendship> findByAddresseeAndStatus(User addressee, FriendshipStatus status);


    // Lấy danh sách bạn bè đã chấp nhận của người dùng
    @Query("SELECT f FROM Friendship f WHERE (f.requester = :user OR f.addressee = :user) AND f.status = 'ACCEPTED'")
    List<Friendship> findAcceptedFriendships(@Param("user") User user);

    Optional<Friendship> findByAddresseeAndRequester(User addressee, User requester);

    // Lấy danh sách bạn bè của người dùng (những yêu cầu đã được chấp nhận)
    List<Friendship> findByRequesterAndStatusOrAddresseeAndStatus(User requester, FriendshipStatus status1, User addressee, FriendshipStatus status2);
    //lay danh sach ban be theo id nguoi dung
    @Query("SELECT u FROM User u WHERE u.id IN " +
            "(SELECT CASE WHEN f.requester.id = :userId THEN f.addressee.id ELSE f.requester.id END " +
            "FROM Friendship f WHERE (f.requester.id = :userId OR f.addressee.id = :userId) AND f.status = 'ACCEPTED')")
    List<User> findAcceptedFriendsByUserId(@Param("userId") Long userId);

}
