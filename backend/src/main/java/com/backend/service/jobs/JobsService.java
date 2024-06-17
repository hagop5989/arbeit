package com.backend.service.jobs;

import com.backend.domain.jobs.*;
import com.backend.mapper.jobs.JobsConditionMapper;
import com.backend.mapper.jobs.JobsImageMapper;
import com.backend.mapper.jobs.JobsMapper;
import lombok.RequiredArgsConstructor;
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

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class JobsService {
    private final JobsMapper jobsMapper;
    private final JobsConditionMapper conditionMapper;
    private final JobsImageMapper imageMapper;
    final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public List<Map<String, Object>> findStoreNamesByMemberId(Authentication authentication) {
        return jobsMapper.selectStoreNamesByMemberId(Integer.valueOf(authentication.getName()));
    }

    public void register(JobsRegisterForm form, Authentication authentication) throws IOException {
        // Jobs 저장
        Jobs jobs = new Jobs(
                null,
                Integer.valueOf(authentication.getName()),
                form.getStoreId(),
                form.getCategoryId(),
                form.getTitle(),
                form.getContent(),
                form.getSalary(),
                form.getDeadline(),
                form.getRecruitmentNumber(),
                null, null, null, null

        );
        jobsMapper.insert(jobs);

        // JobsCondition 저장
        Integer jobsId = jobs.getId();
        JobsCond jobsCond = new JobsCond(
                jobsId,
                form.getEducation(),
                form.getEducationDetail(),
                form.getAge(),
                form.getPreferred(),
                form.getWorkPeriod(),
                form.getWorkWeek(),
                form.getWorkTime()
        );
        conditionMapper.insert(jobsCond);

        // 사진 저장
        List<MultipartFile> images = form.getImages();
        if (images != null) {
            for (MultipartFile image : images) {
                String imageName = image.getOriginalFilename();
                imageMapper.insertImage(jobsId, imageName);
                saveJobsImageToS3(image, jobsId, imageName);
            }
        }
    }

    public Map<String, Object> findById(Integer jobsId) {

        Map<String, Object> result = new HashMap<>();

        Jobs jobs = jobsMapper.selectById(jobsId);

        if (jobs == null) {
            return null;
        }

        JobsCond condition = conditionMapper.selectByJobsId(jobsId);

        List<String> imageNames = imageMapper.selectImageNameByJobsId(jobsId);
        List<JobsImage> images = imageNames.stream()
                .map(imageName -> new JobsImage(imageName, STR."\{srcPrefix}/jobs/\{jobsId}/\{imageName}"))
                .toList();

        result.put("jobs", jobs);
        result.put("jobsCondition", condition);
        result.put("images", images);
        return result;
    }

    public void update(JobsEditForm form, Authentication authentication) throws IOException {

        // update
        Integer jobsId = form.getId();
        Jobs jobs = new Jobs(
                null,
                jobsId,
                null, null,
                form.getTitle(),
                form.getContent(),
                form.getSalary(),
                form.getDeadline(),
                form.getRecruitmentNumber(),
                null, null, null, null
        );
        JobsCond jobsCond = new JobsCond(
                jobsId,
                form.getEducation(),
                form.getEducationDetail(),
                form.getAge(),
                form.getPreferred(),
                form.getWorkPeriod(),
                form.getWorkWeek(),
                form.getWorkTime()
        );
        jobsMapper.updateById(jobs);
        conditionMapper.updateByJobsId(jobsCond);

        // 이미지 삭제
        removeJobsImageToS3(jobsId, form.getRemoveImages());
        List<String> removeImages = form.getRemoveImages();
        if (removeImages != null) {
            for (String removeImageName : removeImages) {
                imageMapper.deleteByJobsIdAndImageName(jobsId, removeImageName);
            }
        }

        // 이미지 추가
        List<MultipartFile> addImages = form.getAddImages();
        if (addImages != null) {
            for (MultipartFile image : addImages) {
                String imageName = image.getOriginalFilename();
                imageMapper.insertImage(jobsId, imageName);
                saveJobsImageToS3(image, jobsId, image.getOriginalFilename());
            }
        }
    }


    public void deleteByJobsId(Integer jobsId) {
        // file 명 조회
        List<String> fileNames = imageMapper.selectImageNameByJobsId(jobsId);

        // s3,db jobsFile 삭제
        removeJobsImageToS3(jobsId, fileNames);
        imageMapper.deleteByJobsId(jobsId);
        conditionMapper.deleteByJobsId(jobsId);
        jobsMapper.deleteById(jobsId);
    }

    public Map<String, Object> findAll(Integer currentPage, String searchType, String keyword) {

        Map<String, Integer> pageInfo = new HashMap<>();
        Integer offset = paging(currentPage, searchType, keyword, pageInfo);
        List<Jobs> jobsList = jobsMapper.selectAllPaging(offset, searchType, keyword);

        return Map.of("pageInfo", pageInfo,
                "jobsList", jobsList);
    }


    // 추출한 메소드 들

    private void saveJobsImageToS3(MultipartFile image, int jobsId, String imageName) throws IOException {
        String key = STR."arbeit/jobs/\{jobsId}/\{imageName}";
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        s3Client.putObject(objectRequest,
                RequestBody.fromInputStream(image.getInputStream(), image.getSize()));
    }

    private void removeJobsImageToS3(Integer jobsId, List<String> removeImages) {
        if (removeImages != null && !removeImages.isEmpty()) {
            for (String imageName : removeImages) {
                // s3의 파일 삭제
                String key = STR."arbeit/jobs/\{jobsId}/\{imageName}";
                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3Client.deleteObject(objectRequest);

                // db jobsFile 삭제
                imageMapper.deleteByJobsIdAndImageName(jobsId, imageName);
            }
        }
    }

    // 페이징
    private Integer paging(Integer currentPage, String searchType, String keyword, Map<String, Integer> pageInfo) {

        Integer countAll = jobsMapper.countAllWithSearch(searchType, keyword);
        Integer offset = (currentPage - 1) * 10;

        Integer lastPageNum = (countAll - 1) / 10 + 1;
        Integer leftPageNum = (currentPage - 1) / 10 * 10 + 1;
        Integer rightPageNum = leftPageNum + 9;
        rightPageNum = Math.min(rightPageNum, lastPageNum);
        leftPageNum = rightPageNum - 9;
        leftPageNum = Math.max(leftPageNum, 1);
        Integer prevPageNum = leftPageNum - 1;
        Integer nextPageNum = rightPageNum + 1;

        //  이전,처음,다음,맨끝 버튼 만들기
        if (prevPageNum > 0) {
            pageInfo.put("prevPage", prevPageNum);
        }
        if (nextPageNum <= lastPageNum) {
            pageInfo.put("nextPage", nextPageNum);
        }

        pageInfo.put("currentPage", currentPage);
        pageInfo.put("lastPage", lastPageNum);
        pageInfo.put("leftPage", leftPageNum);
        pageInfo.put("rightPage", rightPageNum);
        return offset;
    }


    public boolean hasAccess(JobsEditForm form, Authentication authentication) {
        return String.valueOf(form.getMemberId()).equals(authentication.getName());
    }
}

