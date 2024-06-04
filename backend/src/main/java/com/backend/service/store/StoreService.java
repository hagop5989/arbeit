package com.backend.service.store;

import com.backend.domain.store.Store;
import com.backend.mapper.store.StoreMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class StoreService {

    private final StoreMapper mapper;

    public void add(Store store) {
        mapper.insert(store);
    }

    public List<Store> list() {
        return mapper.selectAll();
    }

    public boolean validate(Store store) {
        if (store.getName() == null || store.getName().isBlank()) {
            return false;
        }

        if (store.getContent() == null || store.getContent().isBlank()) {
            return false;
        }
        return true;
    }

    public void remove(Integer id) {
        mapper.deleteById(id);
    }

    public void edit(Store store) {
    }
}
