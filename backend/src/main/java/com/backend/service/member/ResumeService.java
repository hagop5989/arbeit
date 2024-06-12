package com.backend.service.member;

import com.backend.domain.member.resume.Resume;
import com.backend.domain.member.resume.ResumeForm;
import com.backend.mapper.member.ResumeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class ResumeService {
    private final ResumeMapper mapper;

    public void register(ResumeForm form, Authentication authentication) {
        form.setMemberId(Integer.valueOf(authentication.getName()));
        mapper.insert(form);
    }

    public List<Resume> findAllByMemberId(Integer memberId) {
        return mapper.selectAllByMemberId(memberId);
    }

    public Resume findById(Integer id) {
        return mapper.selectById(id);
    }

    public void delete(List<Integer> ids) {
        for (Integer id : ids) {
            mapper.deleteById(id);
        }
    }

    public void edit(Integer id, ResumeForm form) {
        form.setId(id);
        mapper.update(form);
    }

    public boolean isMaxedInsert(Authentication authentication) {
        Integer count = mapper.selectAllOfCount(authentication.getName());
        return count < 5;
    }

    public boolean hasAccess(Integer id, Authentication authentication) {

        Resume dbResume = mapper.selectById(id);
        String dbMemberId = String.valueOf(dbResume.getMemberId());
        String authId = authentication.getName();

        return dbMemberId.equals(authId);
    }

    public boolean hasAccess(List<Integer> ids, Authentication authentication) {
        Integer id = ids.getFirst();
        String memberId = String.valueOf(mapper.selectById(id).getMemberId());
        String authId = authentication.getName();

        return memberId.equals(authId);
    }
}
