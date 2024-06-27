package com.backend.service.review;

import com.backend.domain.review.ReviewToAlba;
import com.backend.domain.review.ReviewToStore;
import com.backend.mapper.review.ReviewToAlbaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class ReviewToAlbaService {
    private final ReviewToAlbaMapper mapper;


    public void insert(ReviewToAlba review) {
        mapper.insert(review);

    }

    public List<ReviewToAlba> list(Integer memberId) {
        return mapper.list(memberId);
    }

    public void delete(Integer albaId, Integer bossId) {
        mapper.delete(albaId, bossId);

    }

    public void update(ReviewToAlba review) {
        mapper.update(review);

    }

    public List<ReviewToStore> listToStore(Integer bossId) {

        return mapper.listToStore(bossId);
    }
}
