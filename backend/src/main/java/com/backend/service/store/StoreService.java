package com.backend.service.store;

import com.backend.domain.store.Store;
import com.backend.mapper.member.MemberMapper;
import com.backend.mapper.store.StoreMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class StoreService {

    private final StoreMapper mapper;
    private final MemberMapper memberMapper;

    public void add(Store store, MultipartFile[] files, Authentication authentication) {
        store.setMemberId(Integer.valueOf(authentication.getName()));
        mapper.insert(store);

        if (files != null) {
            for (MultipartFile file : files) {
                mapper.insertFileName(store.getId(), file.getOriginalFilename());
            }
        }
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
        mapper.update(store);
    }

    public Store get(Integer id) {
        return mapper.selectByStoreId(id);
    }

    public boolean hasAccess(Integer id, Authentication authentication) {
        Store store = mapper.selectByStoreId(id);

        return store.getMemberId().equals(Integer.valueOf(authentication.getName()));
    }
}
