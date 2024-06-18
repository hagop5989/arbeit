package com.backend.service.store;

import com.backend.domain.store.*;
import com.backend.mapper.member.MemberMapper;
import com.backend.mapper.store.StoreMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class StoreService {

    private final StoreMapper mapper;
    private final MemberMapper memberMapper;
    final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void register(StoreRegisterForm form, MultipartFile[] files, Authentication authentication) throws IOException {

        Store store = new Store(
                null,
                form.getName(),
                form.getContent(),
                form.getAddress(),
                form.getDetailAddress(),
                form.getPhone(),
                null,
                Integer.valueOf(authentication.getName()),
                form.getCategoryId(),
                null
        );

        mapper.insert(store);

        int storeId = store.getId();

        if (files != null) {
            for (MultipartFile image : files) {
                String filename = image.getOriginalFilename();
                mapper.insertImage(storeId, filename);

                saveStoreImageToS3(image, storeId, filename);
            }
        }
    }

    public List<Category> findAllCategory() {
        return mapper.selectAllCategory();
    }

    public List<Store> findAllByMemberId(Authentication authentication) {
        return mapper.selectAllByMemberId(authentication.getName());
    }

    public Map<String, Object> findStoreById(Integer id) {

        Map<String, Object> result = new HashMap<>();

        Store store = mapper.selectById(id);
        if (store == null) {
            return null;
        }

        List<String> imageNames = mapper.selectImagesById(id);

        List<StoreImage> images = imageNames.stream()
                .map(imageName -> new StoreImage(imageName, STR."\{srcPrefix}/store/\{id}/\{imageName}"))
                .toList();

        result.put("store", store);
        result.put("images", images);

        return result;
    }

    public void edit(StoreEditForm form, List<String> removeImages, MultipartFile[] addImages) throws IOException {

        Integer storeId = form.getId();

        if (removeImages != null && !removeImages.isEmpty()) {
            for (String imageName : removeImages) {
                // s3의 파일 삭제
                removeStoreImageToS3(storeId, imageName);
                mapper.deleteImageByIdAndName(storeId, imageName);
            }
        }

        if (addImages != null && addImages.length > 0) {
            List<String> imageNames = mapper.selectImagesById(storeId);

            for (MultipartFile image : addImages) {
                String imageName = image.getOriginalFilename();

                if (!imageNames.contains(imageName)) {
                    mapper.insertImage(storeId, imageName);
                }
                saveStoreImageToS3(image, storeId, imageName);
            }
        }

        mapper.update(form);
    }

    public void removeById(Integer id) {
        // file 명 조회
        List<String> imageNames = mapper.selectImagesById(id);

        // aws s3의 file 삭제
        for (String imageName : imageNames) {
            removeStoreImageToS3(id, imageName);
        }
        // db의 storeFile 삭제
        mapper.deleteImagesById(id);
        mapper.deleteById(id);
    }

    public boolean hasAccess(Integer id, Authentication authentication) {
        Store store = mapper.selectById(id);
        return store.getMemberId().equals(Integer.valueOf(authentication.getName()));
    }

    private void saveStoreImageToS3(MultipartFile image, int storeId, String filename) throws IOException {
        String key = STR."arbeit/store/\{storeId}/\{filename}";
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        s3Client.putObject(objectRequest,
                RequestBody.fromInputStream(image.getInputStream(), image.getSize()));
    }

    private void removeStoreImageToS3(Integer storeId, String imageName) {
        String key = STR."arbeit/store/\{storeId}/\{imageName}";
        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.deleteObject(objectRequest);
    }

}
