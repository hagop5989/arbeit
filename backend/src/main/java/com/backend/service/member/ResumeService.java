package com.backend.service.member;

import com.backend.domain.member.resume.Resume;
import com.backend.mapper.member.ResumeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ResumeService {
    private final ResumeMapper mapper;

    public void register(Resume resume, Authentication authentication) {
        resume.setMemberId(Integer.valueOf(authentication.getName()));
        mapper.insert(resume);
    }

    public List<Resume> findAllByMemberId(Integer memberId) {
        return mapper.selectAllByMemberId(memberId);
    }

    public Resume findById(Integer id) {
        return mapper.selectById(id);
    }

    public void delete(Integer id) {
        mapper.deleteById(id);

    }

    public void update(Resume resume) {
        mapper.update(resume);

    }

    public boolean isMaxedInsert(Authentication authentication) {
        Integer count = mapper.selectAllOfCount(authentication.getName());
        return count < 5;
    }
}
