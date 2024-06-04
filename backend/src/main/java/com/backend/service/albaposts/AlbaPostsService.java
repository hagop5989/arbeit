package com.backend.service.albaposts;

import com.backend.domain.albaposts.AlbaPosts;
import com.backend.mapper.albaposts.AlbaPostsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class AlbaPostsService {
    private final AlbaPostsMapper mapper;

    public void insert(AlbaPosts albaPosts) {
        mapper.insert(albaPosts);
    }

    public void update(AlbaPosts albaPosts) {
        mapper.update(albaPosts);

    }

    public AlbaPosts selectByPostId(Integer postId) {
        AlbaPosts selectpost = mapper.selectByPostId(postId);
        System.out.println("selectpost = " + selectpost);
        return selectpost;
    }

    public List<AlbaPosts> findAllByBossId(Integer bossId) {
        return mapper.findAllByBossId(bossId);
    }

    public void deleteByPostId(Integer postId) {
        mapper.deleteByPostId(postId);
    }
}
