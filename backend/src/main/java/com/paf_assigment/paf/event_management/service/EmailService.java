package com.paf_assigment.paf.event_management.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendRegistrationEmail(String toEmail, String eventTitle, String eventDate) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("🎉 Event Registration Confirmation - " + eventTitle);

            String htmlContent = "<div style=\"font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;\">" +
                    "<h2 style=\"color: #2e86de;\">You're Registered!</h2>" +
                    "<p>Hi there,</p>" +
                    "<p>Thank you for registering for the event. Here are the details:</p>" +
                    "<ul>" +
                    "<li><strong>Event:</strong> " + eventTitle + "</li>" +
                    "<li><strong>Date:</strong> " + eventDate + "</li>" +
                    "</ul>" +
                    "<p>We’re excited to have you with us! 🎉</p>" +
                    "<hr style=\"margin-top:20px; margin-bottom:20px;\">" +
                    "<p style=\"font-size: 12px; color: #888;\">This is an automated message from FoodApp. Please do not reply.</p>" +
                    "</div>";

            helper.setText(htmlContent, true); // true = is HTML
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
}
