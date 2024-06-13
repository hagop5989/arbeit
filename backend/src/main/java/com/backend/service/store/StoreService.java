package com.backend.service.store;

import com.backend.domain.store.Category;
import com.backend.domain.store.Store;
import com.backend.domain.store.StoreImage;
import com.backend.domain.store.StoreRegisterForm;
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
                form.getName(),
                form.getContent(),
                form.getAddress(),
                form.getDetailAddress(),
                form.getPhone(),
                Integer.valueOf(authentication.getName()),
                form.getCategoryId()
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

    public List<Store> findAllByMemberId(Authentication authentication) {
        return mapper.selectAllByMemberId(authentication.getName());
    }

    public Map<String, Object> findStoreInfoById(Integer id) {

        Map<String, Object> result = new HashMap<>();

        Store store = mapper.selectById(id);
        List<String> imageNames = mapper.selectImagesByStoreId(id);

        List<StoreImage> images = imageNames.stream()
                .map(imageName -> new StoreImage(imageName, STR."\{srcPrefix}/store/\{id}/\{imageName}"))
                .toList();

        result.put("store", store);
        result.put("images", images);

        return result;
    }

    public void remove(Integer id) {
        // file 명 조회
        List<String> fileNames = mapper.selectImagesByStoreId(id);

        // aws s3의 file 삭제
        for (String fileName : fileNames) {
            String key = STR."\{srcPrefix}/store/\{id}/\{fileName}";
            DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(objectRequest);
        }
        // db의 storeFile 삭제
        mapper.deleteFileByStoreId(id);

        mapper.deleteById(id);
    }

    public void edit(Store store, List<String> removeFileList, MultipartFile[] addFileList) throws IOException {
        if (removeFileList != null && removeFileList.size() > 0) {
            for (String fileName : removeFileList) {
                // s3의 파일 삭제
                String key = STR."arbeit/store/\{store.getId()}/\{fileName}";
                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3Client.deleteObject(objectRequest);

                // db records 삭제
                mapper.deleteFileByStoreIdAndName(store.getId(), fileName);
            }
        }

        if (addFileList != null && addFileList.length > 0) {
            List<String> fileNameList = mapper.selectImagesByStoreId(store.getId());
            for (MultipartFile file : addFileList) {
                String fileName = file.getOriginalFilename();
                if (!fileNameList.contains(fileName)) {
                    // 새 파일이 기존에 없을 때만 db에 추가
                    mapper.insertImage(store.getId(), fileName);
                }
                // s3 에 쓰기
                saveStoreImageToS3(file, store.getId(), fileName);
            }
        }

        mapper.update(store);
    }

    public boolean hasAccess(Integer id, Authentication authentication) {
        Store store = mapper.selectById(id);
        log.info("store={}", store);
        return store.getMemberId().equals(Integer.valueOf(authentication.getName()));
    }

    public List<Category> findAllCategory() {
        return mapper.selectAllCategory();
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
}
