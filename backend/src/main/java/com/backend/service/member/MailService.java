package com.backend.service.member;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class MailService {

    private final JavaMailSender javaMailSender;
    private static final String senderEmail = "albaconnector@gmail.com";
    private static ThreadLocal<Integer> numbers = new ThreadLocal<>();

    public MimeMessage createMail(String mail) {
        int number = (int) (Math.random() * (90000)) + 100000;
        numbers.set(number);
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, mail);
            message.setSubject("[알바커넥터] 인증번호 수신 메일입니다.");
            String body = STR."""
                    <h1>[알바커넥터]</h1>
                    <br>
                    <h3> 인증번호는 \{numbers.get()} 입니다.</h3>
                    """;
            message.setText(body, "UTF-8", "html");
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        return message;
    }

    public int sendMail(String mail) {
        MimeMessage message = createMail(mail);
        javaMailSender.send(message);
        return numbers.get();
    }

    public boolean checkRegex(String email) {
        String regex = "^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$";
        return Pattern.matches(regex, email);
    }

}
