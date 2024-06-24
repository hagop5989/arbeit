package com.backend.service.review;

import com.backend.domain.reviw.Review;
import com.backend.mapper.review.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class ReviewService {
    private final ReviewMapper mapper;

    public List<Review> listForBoss(Integer memberId) {
        return mapper.listForBoss(memberId);
    }

    public List<Review> listForAlba(Integer memberId) {
        return mapper.listForAlba(memberId);
    }

    public void insert(Review review) {
        mapper.insert(review);

    }

    public void delete(Integer jobsId, Integer memberId) {
        mapper.delete(jobsId, memberId);

    }

    public void update(Review review) {
        mapper.update(review);

    }
}
