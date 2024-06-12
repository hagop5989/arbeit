package com.backend.service.member;

import com.backend.domain.member.ProfilePicture;
import com.backend.mapper.member.ProfilePictureMapper;
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

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(rollbackFor = Exception.class)
public class ProfilePictureService {

    private final ProfilePictureMapper mapper;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void register(MultipartFile file, Integer memberId) throws IOException {

        if (file == null) {
            return;
        }

        String fileName = file.getOriginalFilename();
        ProfilePicture picture = new ProfilePicture(
                memberId,
                fileName
        );

        ProfilePicture dbPicture = mapper.selectByMemberId(memberId);
        if (dbPicture != null) {
            String oldKey = STR."arbeit/profile/\{memberId}/\{dbPicture.getSrc()}";
            removeProfilePicture(oldKey);
        }

        String newKey = STR."arbeit/profile/\{memberId}/\{fileName}";
        mapper.insertORUpdate(picture); // 등록 또는 업데이트
        saveProfilePicture(file, newKey);
    }

    public String getProfileSrc(Integer memberId) {
        ProfilePicture dbPicture = mapper.selectByMemberId(memberId);
        if (dbPicture == null) {
            return null;
        }
        String src = dbPicture.getSrc();
        return STR."\{srcPrefix}/profile/\{memberId}/\{src}";
    }

    private void removeProfilePicture(String oldKey) {
        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(oldKey)
                .build();
        s3Client.deleteObject(objectRequest);
    }

    private void saveProfilePicture(MultipartFile file, String newKey) throws IOException {
        log.info("s3 등록");
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(newKey)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        s3Client.putObject(objectRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
    }

    public boolean hasAccess(Integer memberId, Authentication authentication) {
        return String.valueOf(memberId).equals(authentication.getName());
    }
}
