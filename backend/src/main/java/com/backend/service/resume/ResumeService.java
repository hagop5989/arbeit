package com.backend.service.resume;

import com.backend.domain.resume.Resume;
import com.backend.domain.resume.ResumeForm;
import com.backend.mapper.jobs.JobsMapper;
import com.backend.mapper.resume.ResumeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class ResumeService {
    private final ResumeMapper mapper;
    private final JobsMapper jobsMapper;

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

    public boolean accessValidate(Integer resumeId, Integer authId) {

        Integer memberId = mapper.selectMemberIdById(resumeId);
        if (memberId != null) {
            if (memberId.equals(authId)) {
                return true;
            }
        }

        List<Integer> bossIds = mapper.selectBossIdsById(resumeId);
        if (bossIds != null) {
            for (Integer bossId : bossIds) {
                if (bossId.equals(authId)) {
                    return true;
                }
            }
        }

        return false;
    }

    public Map<String, String> findMemberNameAndTitleById(Integer resumeId) {

        return mapper.selectMemberIdAndTitleById(resumeId);
    }
}
