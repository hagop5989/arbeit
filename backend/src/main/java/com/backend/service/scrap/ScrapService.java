package com.backend.service.scrap;

import com.backend.domain.scrap.Scrap;
import com.backend.mapper.scrap.ScrapMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ScrapService {
    private final ScrapMapper mapper;

    public void insert(Scrap scarp) {
        mapper.insert(scarp);
    }

    public List<Scrap> list(Integer memberId) {
        List<Scrap> scraps = mapper.selectByMemberId(memberId);
        return scraps;
    }

    public void delete(Integer id) {
        mapper.delete(id);
    }

    public void update(Scrap scarp) {
        mapper.update(scarp);
    }
}
