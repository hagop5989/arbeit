package com.backend.service.member;

import com.backend.domain.member.Resume;
import com.backend.mapper.member.ResumeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ResumeService {
    private final ResumeMapper mapper;

    public void insert(Resume resume) {
        mapper.insert(resume);
    }

    public List<Resume> list(Integer memberId) {
        return mapper.list(memberId);
    }

    public Resume select(Integer id) {
        return mapper.select(id);
    }

}
