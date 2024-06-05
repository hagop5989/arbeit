package com.backend.service.member;

import com.backend.domain.authority.Authority;
import com.backend.domain.member.Member;
import com.backend.domain.member.MemberEditForm;
import com.backend.domain.member.MemberLoginForm;
import com.backend.domain.member.MemberSignupForm;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class MemberService {

    private final MemberMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtEncoder encoder;

    public void signup(MemberSignupForm form) {
        form.setPassword(passwordEncoder.encode(form.getPassword()));
        mapper.insert(form);
    }

    public Map<String, Object> getToken(MemberLoginForm form) {
        Map<String, Object> result = null;

        Member dbMember = mapper.selectByEmail(form.getEmail());
        if (dbMember != null) {
            if (passwordEncoder.matches(form.getPassword(), dbMember.getPassword())) {
                result = new HashMap<>();
                String token = "";
                Instant now = Instant.now();

                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                        .subject(dbMember.getId().toString())
                        .claim("scope", form.getAuthority())
                        .claim("email", dbMember.getEmail())
                        .claim("name", dbMember.getName())
                        .build();

                token = encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                result.put("token", token);
            }
        }

        return result;
    }

    public Member findById(Integer id) {
        Member member = mapper.selectById(id);
        member.setPassword("");
        return member;
    }

    public void edit(MemberEditForm form, Authentication authentication) {

        Member dbMember = mapper.selectById(Integer.valueOf(authentication.getName()));
        String password = dbMember.getPassword();
        String newPassword = form.getPassword();

        if (!newPassword.trim().isBlank()) {
            if (form.getPassword().equals(form.getPasswordCheck())) {
                password = passwordEncoder.encode(form.getPassword());
            }
        }

        Member member = new Member(
                Integer.valueOf(authentication.getName()),
                null,
                password,
                form.getName(),
                form.getAddress(),
                form.getPhone(),
                null,
                null
        );

        mapper.updateById(member);
    }

    public List<Member> findAll() {
        return mapper.selectAll();
    }

    public boolean hasAccess(Integer id, Authentication authentication) {

        Integer loginId = Integer.valueOf(authentication.getName());
        if (!id.equals(loginId)) {
            return false;
        }
        return true;
    }

    public void deleteById(Integer id) {
        mapper.deleteById(id);
    }

    public Map<String, String> passwordMatch(MemberEditForm form) {
        Map<String, String> map = null;
        if (!form.getPassword().equals(form.getPasswordCheck())) {
            map = Map.of("passwordCheck", "패스워드와 확인이 일치하지 않습니다.");
        }

        return map;
    }

    public boolean checkAuthority(MemberLoginForm form) {
        Member dbMember = mapper.selectByEmail(form.getEmail());
        Authority memberAuth = dbMember.getAuthority();
        Authority newAuth = form.getAuthority();
        return memberAuth.equals(newAuth);
    }
}
