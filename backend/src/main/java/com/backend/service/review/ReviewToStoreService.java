package com.backend.service.review;

import com.backend.domain.review.ReviewToAlba;
import com.backend.domain.review.ReviewToStore;
import com.backend.mapper.review.ReviewToStoreMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class ReviewToStoreService {
    private final ReviewToStoreMapper mapper;


    public List<ReviewToStore> listForAlba(Integer memberId) {
        return mapper.listForAlba(memberId);
    }

    public void insert(ReviewToStore reviewToStore) {
        mapper.insert(reviewToStore);

    }

    public void delete(Integer storeId, Integer memberId) {
        mapper.delete(storeId, memberId);

    }

    public void update(ReviewToStore reviewToStore) {
        mapper.update(reviewToStore);

    }

    public List<ReviewToAlba> listToAlba(Integer albaId) {
        return mapper.listToAlba(albaId);
    }

}
