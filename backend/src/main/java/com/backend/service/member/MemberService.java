package com.backend.service.member;

import com.backend.domain.authority.MemberAuth;
import com.backend.domain.member.Member;
import com.backend.domain.member.form.MemberEditForm;
import com.backend.domain.member.form.MemberLoginForm;
import com.backend.domain.member.form.MemberSignupForm;
import com.backend.mapper.member.MemberMapper;
import com.backend.mapper.review.ReviewToAlbaMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class MemberService {

    private final MemberMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtEncoder encoder;
    private final ReviewToAlbaMapper reviewToAlbaMapper;

    public void signup(MemberSignupForm form) {
        Member member = new Member(
                null,
                form.getEmail(),
                passwordEncoder.encode(form.getPassword()),
                form.getName(),
                form.getGender(),
                parseBirthDate(form.getBirthDate()),
                form.getAddress(),
                form.getPhone(),
                null
        );
        mapper.insert(member);

        MemberAuth auth = new MemberAuth(member.getId(), form.getAuthority());
        mapper.insertAuth(auth);
    }

    public Map<String, Object> getToken(MemberLoginForm form) {
        Map<String, Object> result = null;

        Member dbMember = mapper.selectByEmail(form.getEmail());

        if (dbMember == null) {
            log.info("dbMember = null");
            return null;
        }

        Integer dbMemberId = dbMember.getId();
        String authority = mapper.selectAuthById(dbMemberId);

        if (String.valueOf(form.getAuthority()).equals(authority)
                && passwordEncoder.matches(form.getPassword(), dbMember.getPassword())) {

            result = new HashMap<>();
            String token = "";
            Instant now = Instant.now();

            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .issuer("self")
                    .issuedAt(now)
                    .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                    .subject(dbMember.getId().toString())
                    .claim("scope", authority)
                    .claim("email", dbMember.getEmail())
                    .claim("name", dbMember.getName())
                    .build();

            token = encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

            result.put("token", token);
        }

        return result;
    }

    public Member findById(Integer id) {
        Member member = mapper.selectById(id);
        member.setPassword("");
        return member;
    }

    public void edit(MemberEditForm form) {

        Member dbMember = mapper.selectById(form.getId());
        String password = dbMember.getPassword();
        String newPassword = form.getPassword();

        if (!newPassword.trim().isBlank()) {
            if (form.getPassword().equals(form.getPasswordCheck())) {
                password = passwordEncoder.encode(form.getPassword());
            }
        }

        Member member = new Member(
                form.getId(),
                null,
                password,
                form.getName(),
                null, null,
                form.getAddress(),
                form.getPhone(),
                null
        );

        mapper.updateById(member);
    }

    public Member findByEmail(String email) {
        return mapper.selectByEmail(email);
    }

    public List<Member> findAll() {
        return mapper.selectAll();
    }

    public boolean hasAccess(Integer id, Authentication authentication) {
        String auth = mapper.selectAuthById(Integer.valueOf(authentication.getName()));
        if (auth.equals("ADMIN")) {
            return true;
        }
        Integer loginId = Integer.valueOf(authentication.getName());
        if (!id.equals(loginId)) {
            return false;
        }
        return true;
    }

    public void deleteById(Integer id) {
        String deleted = STR."delete.\{UUID.randomUUID().toString()}";
        mapper.deleteById(id, deleted);
    }

    public Map<String, String> passwordMatch(MemberEditForm form) {
        Map<String, String> map = null;
        if (!form.getPassword().equals(form.getPasswordCheck())) {
            map = Map.of("passwordCheck", "패스워드와 패스워드 확인이 일치하지 않습니다.");
        }
        return map;
    }

    private Date parseBirthDate(String birthDate) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyMMdd");

        try {
            return dateFormat.parse(birthDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String findByNameAndPhone(String name, String phone) {
        if (name.trim().isEmpty() || phone.trim().isEmpty()) {
            return null;
        }
        return mapper.selectByNameAndPhone(name, phone);
    }

    public boolean checkRegexPwd(String password) {
        String regex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\\d~!@#$%^&*()+|=]{8,16}$";
        return Pattern.matches(regex, password);
    }

    public void updatePwdByEmail(String email, String password) {
        String encoded = passwordEncoder.encode(password);
        mapper.updatePwdByEmail(email, encoded);
    }

    public boolean canDelete(String password, Integer id) {
        Member dbMember = mapper.selectById(id);
        return passwordEncoder.matches(password, dbMember.getPassword());
    }

    public Integer getAlbaScore(Integer albaId) {
        List<Integer> scores = reviewToAlbaMapper.selectScoreByAlbaId(albaId);
        Integer result = 100;
        if (scores != null) {
            Integer sum = scores.stream()
                    .mapToInt(Integer::intValue)
                    .sum();

            result += sum * 10;
            return result;
        }

        return result;
    }

    /* 테스트용 코드 */
    public void encode(String email, String password) {
        Member member = mapper.selectByEmail(email);
        if (member != null) {
            String encoded = passwordEncoder.encode(password);
            mapper.updatePwdByEmail(email, encoded);
            System.out.println("pw 인코딩 완료.");
        }
    }
}
