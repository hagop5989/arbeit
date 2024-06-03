package com.backend.service.alba;

import com.backend.domain.alba.AlbaSignupForm;
import com.backend.mapper.alba.AlbaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class AlbaService {

    private final AlbaMapper mapper;

    public void signup(AlbaSignupForm form) {

        mapper.insert(form);
    }
}
