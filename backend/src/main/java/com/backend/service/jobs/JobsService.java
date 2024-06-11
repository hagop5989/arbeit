package com.backend.service.jobs;

import com.backend.domain.jobs.Jobs;
import com.backend.domain.jobs.JobsFile;
import com.backend.domain.store.Category;
import com.backend.domain.store.Store;
import com.backend.mapper.jobs.JobsMapper;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class JobsService {
    private final JobsMapper jobsMapper;
    private final MemberMapper memberMapper;
    final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void insert(Jobs jobs, MultipartFile[] files) throws IOException {
        // 카테고리 id 찾고 jobs에 설정
        Integer categoryId = jobsMapper.selectCategoryByCategoryName(jobs.getCategoryName());
        jobs.setCategoryId(categoryId);

        // storeName 기반으로 store id 할당
        Store dbStore = jobsMapper.selectStoreByStoreName(jobs.getStoreName());
        jobs.setStoreId(dbStore.getId());

        // db에 jobs 입력
        jobsMapper.insert(jobs);
        if (files != null) {
            for (MultipartFile file : files) {
                jobsMapper.insertFileName(jobs.getId(), file.getOriginalFilename());
                // 실제 파일 저장 (s3)
                String key = STR."arbeit/\{jobs.getId()}/\{file.getOriginalFilename()}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest,
                        RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
        System.out.println("JobsService.insert.end");
    }

    public void update(Jobs jobs, List<String> removeFileList, MultipartFile[] addFileList) throws IOException {
        if (removeFileList != null && removeFileList.size() > 0) {
            for (String fileName : removeFileList) {
                // s3의 파일 삭제
                String key = STR."arbeit/\{jobs.getId()}/\{fileName}";
                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3Client.deleteObject(objectRequest);

                // db records 삭제
                jobsMapper.deleteFileByJobsIdAndName(jobs.getId(), fileName);
            }
        }

        if (addFileList != null && addFileList.length > 0) {
            List<String> fileNameList = jobsMapper.selectFileNameByJobsId(jobs.getId());
            for (MultipartFile file : addFileList) {
                String fileName = file.getOriginalFilename();
                if (!fileNameList.contains(fileName)) {
                    // 새 파일이 기존에 없을 때만 db에 추가
                    jobsMapper.insertFileName(jobs.getId(), fileName);
                }
                // s3 에 쓰기
                String key = STR."arbeit/\{jobs.getId()}/\{fileName}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
        jobsMapper.update(jobs);
    }

    public Map<String, Object> selectByJobsId(Integer jobsId) {
        Map<String, Object> result = new HashMap<>();
        Jobs jobs = jobsMapper.selectByJobsId(jobsId);

        // store 에서 jobs의 storeId 기준으로 선택한 storeName 조회하여 Jobs 할당.
        System.out.println("storeId: " + jobs.getStoreId());
        Store dbStore = jobsMapper.selectStoreByJobStoreId(jobs.getStoreId());
        jobs.setStoreName(dbStore.getName());

        // store 에서 memberId 기준으로 storeName 조회
        List<Store> stores = jobsMapper.selectStoreByJobsMemberId(jobs.getMemberId());
        // jobs의 categoryId 기준으로 categoryName 설정.
        Category category = jobsMapper.selectCategoryByCategoryId(jobs.getCategoryId());
        jobs.setCategoryName(category.getName());

        // store 의 이름들 관련 배열.
        List<String> storeNames = new ArrayList<>();

        Map<String, String> categoryMap = new HashMap<>();
        for (Store store : stores) {
            storeNames.add(store.getName());
            Category dbCategory = jobsMapper.selectCategoryByCategoryId(store.getCategoryId());
            categoryMap.put(store.getName(), dbCategory.getName());
        }

        List<String> fileNames = jobsMapper.selectFileNameByJobsId(jobsId);
        // 버킷객체URL/{id}/{name}
        List<JobsFile> files = fileNames.stream()
                .map(fileName -> new JobsFile(fileName, STR."\{srcPrefix}/\{jobsId}/\{fileName}"))
                .toList();
        jobs.setFileList(files);


        result.put("jobs", jobs);
        result.put("storeNames", storeNames);
        result.put("categoryMap", categoryMap);
        return result;

    }

    public void deleteByJobsId(Integer jobsId) {
        // file 명 조회
        List<String> fileNames = jobsMapper.selectFileNameByJobsId(jobsId);

        // aws s3의 file 삭제
        for (String fileName : fileNames) {
            String key = STR."\{srcPrefix}/\{jobsId}/\{fileName}";
            DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(objectRequest);
        }
        // db의 jobsFile 삭제
        jobsMapper.deleteFileByJobsId(jobsId);
        // db의 jobs 삭제
        jobsMapper.deleteByJobsId(jobsId);
    }

    public Map<String, Object> list(Integer memberId, Integer page,
                                    String searchType, String keyword) {
        Map pageInfo = new HashMap();
        Integer countAll = jobsMapper.countAllWithSearch(searchType, keyword);

        Integer offset = (page - 1) * 10;

        Integer lastPageNum = (countAll - 1) / 10 + 1;
        Integer leftPageNum = (page - 1) / 10 * 10 + 1;
        Integer rightPageNum = leftPageNum + 9;
        rightPageNum = Math.min(rightPageNum, lastPageNum);
        leftPageNum = rightPageNum - 9;
        leftPageNum = Math.max(leftPageNum, 1);
        Integer prevPageNum = leftPageNum - 1;
        Integer nextPageNum = rightPageNum + 1;

        //  이전,처음,다음,맨끝 버튼 만들기
        if (prevPageNum > 0) {
            pageInfo.put("prevPageNum", prevPageNum);
        }
        if (nextPageNum <= lastPageNum) {
            pageInfo.put("nextPageNum", nextPageNum);
        }
        pageInfo.put("currentPageNum", page);
        pageInfo.put("lastPageNum", lastPageNum);
        pageInfo.put("leftPageNum", leftPageNum);
        pageInfo.put("rightPageNum", rightPageNum);
        List<Jobs> JobsList = jobsMapper.selectAllPaging(offset, searchType, keyword);

        return Map.of("pageInfo", pageInfo,
                "jobsList", JobsList);
    }

    public Map<String, Object> findInsertData(Integer memberId) {
        List<Store> stores = jobsMapper.selectStoreByJobsMemberId(memberId);

        List<String> storeNames = new ArrayList<>();
        List<String> categoryNames = new ArrayList<>();

        for (Store store : stores) {
            Integer categoryId = store.getCategoryId();
            Category category = jobsMapper.selectCategoryByCategoryId(categoryId);

            categoryNames.add(category.getName());
            storeNames.add(store.getName());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("storeNames", storeNames);
        result.put("categoryNames", categoryNames);
        System.out.println("result = " + result);
        return result;
    }
}

