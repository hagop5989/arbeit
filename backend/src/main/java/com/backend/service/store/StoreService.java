package com.backend.service.store;

import com.backend.domain.store.Store;
import com.backend.domain.store.StoreFile;
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
import java.util.List;

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

    public void add(Store store, MultipartFile[] files, Authentication authentication) throws IOException {
        store.setMemberId(Integer.valueOf(authentication.getName()));
        mapper.insert(store);
        if (files != null) {
            for (MultipartFile file : files) {
                mapper.insertFileName(store.getId(), file.getOriginalFilename());
                // 실제 파일 저장 (s3)
                String key = STR."arbeit/store/\{store.getId()}/\{file.getOriginalFilename()}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest,
                        RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
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
        // file 명 조회
        List<String> fileNames = mapper.selectFileNameByStoreId(id);

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
            List<String> fileNameList = mapper.selectFileNameByStoreId(store.getId());
            for (MultipartFile file : addFileList) {
                String fileName = file.getOriginalFilename();
                if (!fileNameList.contains(fileName)) {
                    // 새 파일이 기존에 없을 때만 db에 추가
                    mapper.insertFileName(store.getId(), fileName);
                }
                // s3 에 쓰기
                String key = STR."arbeit/store/\{store.getId()}/\{fileName}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }

        mapper.update(store);
    }

    public Store get(Integer id) {
        Store store = mapper.selectByStoreId(id);

        List<String> fileNames = mapper.selectFileNameByStoreId(id);
        List<StoreFile> files = fileNames.stream()
                .map(fileName -> new StoreFile(fileName, STR."\{srcPrefix}/store/\{id}/\{fileName}"))
                .toList();
        store.setFileList(files);


        return store;
    }

    public boolean hasAccess(Integer id, Authentication authentication) {
        Store store = mapper.selectByStoreId(id);
        log.info("store={}", store);
        return store.getMemberId().equals(Integer.valueOf(authentication.getName()));
    }

    public List<Store> cate() {
        return mapper.setcate();
    }
}
