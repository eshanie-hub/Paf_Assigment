package com.paf_assigment.paf.event_management.service;

import com.paf_assigment.paf.event_management.model.Event;
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

    public void sendRegistrationEmail(String toEmail, Event event) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("🎉 Event Registration Confirmation - " + event.getTitle());

            String locationOrLink = event.getType().equalsIgnoreCase("Online")
                    ? "<a href='" + event.getLink() + "' target='_blank'>" + event.getLink() + "</a>"
                    : event.getLocation();

            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;'>"
                    + "<h2 style='color: #2e86de;'>You're Registered!</h2>"
                    + "<p>Hi there,</p>"
                    + "<p>Thank you for registering for the event. Here are the details:</p>"
                    + "<ul>"
                    + "<li><strong>Event:</strong> " + event.getTitle() + "</li>"
                    + "<li><strong>Date:</strong> " + event.getEventDate() + "</li>"
                    + "<li><strong>Time:</strong> " + event.getEventTime() + "</li>"
                    + "<li><strong>Type:</strong> " + event.getType() + "</li>"
                    + "<li><strong>Location / Link:</strong> " + locationOrLink + "</li>"
                    + "<li><strong>Instructor:</strong> " + event.getInstructorName() + "</li>"
                    + "</ul>"
                    + "<p><strong>Description:</strong></p>"
                    + "<p>" + event.getDescription() + "</p>"
                    + "<hr style='margin-top:20px; margin-bottom:20px;'>"
                    + "<p style='font-size: 12px; color: #888;'>This is an automated message from ArtApp. Please do not reply.</p>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
}
