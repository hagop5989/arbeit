package com.backend.service.faq;

import com.backend.domain.faq.FAQ;
import com.backend.mapper.faq.FAQMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class FAQService {

    private final FAQMapper mapper;

    public List<FAQ> Wfaq() {
        return mapper.WQNA();
    }

    public List<FAQ> Bfaq() {
        return mapper.BQNA();
    }

    public void addW(FAQ faq) {
        mapper.addQnAw(faq);
    }

    public void addB(FAQ faq) {
        mapper.addQnAb(faq);
    }

    public void updateW(FAQ faq) {
        mapper.updateQnAW(faq);
    }

    public void updateB(FAQ faq) {
        mapper.updateQnAB(faq);
    }

    public void deleteW(Integer id) {
        mapper.deleteW(id);
    }

    public void deleteB(Integer id) {
        mapper.deleteB(id);
    }
}
