package com.backend.service.boss;

import com.backend.domain.boss.Boss;
import com.backend.mapper.boss.BossMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BossService {
    private final BossMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    public void insert(Boss boss) {
        boss.setPassword(passwordEncoder.encode(boss.getPassword()));
        boss.setEmail(boss.getEmail().trim());
        boss.setName(boss.getName().trim());

         mapper.insert(boss);
    }

    public ResponseEntity signupEmailCheck(String email) {
        Boss dbBoss = mapper.selectByBossEmail(email);
        if (dbBoss == null) {
            // 이메일 중복 아님
            return ResponseEntity.ok(email);
        }
        if (email != null && dbBoss != null) {
            // 이메일 중복 시
            return ResponseEntity.badRequest().build();
        }
        // 위 케이스가 아닌데 오류 시 500 에러
        return ResponseEntity.internalServerError().build();
    }

    public boolean validate(Boss boss) {
        // password
        if (boss.getPassword() == null || boss.getPassword().isBlank()) {
            return false;
        }
        // email
        if (boss.getEmail() == null || boss.getEmail().isBlank()) {
            return false;
        }
        String emailPattern = "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*";

        if (!boss.getEmail().trim().matches(emailPattern)) {
            return false;
        }
        return true;
    }


    public Map<String, Object> getToken(Boss boss) {
        Map<String, Object> result = null;

        Boss dbBoss = mapper.selectByBossDetails(boss);

        if(dbBoss != null) {
            if(passwordEncoder.matches(boss.getPassword(), dbBoss.getPassword())) {
                result = new HashMap<>();
                String token = "";
                Instant now = Instant.now();

//                List<String> authority = mapper.selectAuthorityByBossId(boss.getId());

//                String authorityString = authority.stream()
//                        .collect(Collectors.joining(" "));

                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                        .subject(dbBoss.getId().toString())
//                        .claim("scope",authorityString)
                        .build();

                token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                result.put("token", token);
            }
        }
        return result;
    }

    public void update(Boss boss) {
        boss.setPassword(passwordEncoder.encode(boss.getPassword()));
        mapper.update(boss);
    }

    public void delete(Boss boss) {
        mapper.delete(boss);
    }
}
