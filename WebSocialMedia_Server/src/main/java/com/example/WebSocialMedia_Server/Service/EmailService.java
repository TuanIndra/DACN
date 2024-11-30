package com.example.WebSocialMedia_Server.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String recipientEmail, String token) {
        String subject = "Email Verification";
        String confirmationUrl = "http://localhost:8082/api/auth/verify?token=" + token;
        String message = "Please click the link below to verify your email:\n" + confirmationUrl;

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientEmail);
        email.setSubject(subject);
        email.setText(message);

        try {
            mailSender.send(email);
        } catch (Exception e) {
            // Log lỗi chi tiết
            System.err.println("Error sending email: " + e.getMessage());
            e.printStackTrace();
            // Có thể ném ngoại lệ tùy chỉnh hoặc xử lý theo cách phù hợp
            throw new RuntimeException("Failed to send verification email");
        }
    }

    /**
     * Phương thức gửi email đơn giản.
     *
     * @param to      Email người nhận
     * @param subject Chủ đề email
     * @param text    Nội dung email
     */
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(to);
        email.setSubject(subject);
        email.setText(text);

        try {
            mailSender.send(email);
        } catch (Exception e) {
            // Log lỗi chi tiết
            System.err.println("Error sending email: " + e.getMessage());
            e.printStackTrace();
            // Có thể ném ngoại lệ tùy chỉnh hoặc xử lý theo cách phù hợp
            throw new RuntimeException("Failed to send email");
        }
    }
}
