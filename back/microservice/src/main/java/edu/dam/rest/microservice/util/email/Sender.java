package edu.dam.rest.microservice.util.email;

import edu.dam.rest.microservice.constants.Constants;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.Getter;
import lombok.Setter;

import java.io.IOException;
import java.util.Properties;

@Getter
@Setter
public class Sender {

    Properties mailProp = new Properties();
    Properties credentialProp = new Properties();

    /**
     * Build the sender class loading the properties from mail and credentials files.
     */
    public Sender() {
        try {
            // Loads all the properties of file "mail.properties".
            mailProp.load(getClass().getClassLoader().getResourceAsStream(Constants.MAIL_PROPERTIES));
            credentialProp.load(getClass().getClassLoader().getResourceAsStream(Constants.CREDENTIAL_PROPERTIES));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Send a simple email with from and recipient address, subject and a simple HTML format content.
     *
     * @param to      recipient email address
     * @param subject email subject
     * @param content email content in html format
     * @return a boolean indicating if the email was sent or not.
     */
    public boolean send(String from, String to, String subject, String content) {
        // Get the Session object.// and pass username and password
        Session session = this.createSession();

        try {
            // Create a default MimeMessage object.
            MimeMessage message = new MimeMessage(session);

            // Set From: header field of the header.
            message.setFrom(new InternetAddress(from));

            // Set To: header field of the header.
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

            // Set Subject: header field
            message.setSubject("Message sent by " + from + ":\n" + subject);

            // Now set the actual message
            message.setContent(content, "text/html");

            System.out.println("Sending...");
            // Send message
            Transport.send(message);
            System.out.println("Sent message successfully...");
            return true;
        } catch (MessagingException mex) {
            mex.printStackTrace();
            return false;
        }
    }

    private Session createSession() {
        Session session = Session.getInstance(mailProp, new jakarta.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(credentialProp.getProperty(Constants.MAIL_USER),
                        credentialProp.getProperty(Constants.MAIL_PASSWORD));
            }
        });
        session.setDebug(false);
        return session;
    }

}
