package com.backend.service.jobs;

import com.backend.domain.jobs.Jobs;
import com.backend.domain.jobs.JobsCondition;
import com.backend.domain.jobs.JobsFile;
import com.backend.domain.store.Store;
import com.backend.mapper.jobs.JobsConditionMapper;
import com.backend.mapper.jobs.JobsFileMapper;
import com.backend.mapper.jobs.JobsMapper;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class JobsService {
    private final JobsMapper jobsMapper;
    private final JobsConditionMapper conditionMapper;
    private final JobsFileMapper fileMapper;
    final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void insert(Jobs jobs, JobsCondition condition, MultipartFile[] fileList) throws IOException {
        // db에 jobs 입력
        jobsMapper.insert(jobs);

        // mapper로 인해 생성된 jobs의 id를 condition에 부여 (현재 null)
        Jobs dbJobs = jobsMapper.selectByJobsId(jobs.getId());
        condition.setAlbaPostsId(dbJobs.getId());

        // db에 condition 입력
        conditionMapper.insert(condition);
        // db, s3에 파일 입력
        addFileList(jobs, fileList);
    }

    public List<Store> getInsertData(Integer memberId) {
        // storeList 반환(카테고리 포함).
        return jobsMapper.selectStoreByJobsMemberId(memberId);
    }

    public void update(Jobs jobs, JobsCondition condition, List<String> removeFileList, MultipartFile[] addFileList) throws IOException {
        // db에 condition 입력
        conditionMapper.update(condition);
        // s3,db jobsFile 삭제
        deleteFileList(jobs, removeFileList);
        // db, s3 에 입력
        addFileList(jobs, addFileList);
        // db에 jobs 입력
        jobsMapper.update(jobs);
    }


    public Map<String, Object> selectByJobsId(Integer jobsId) {
        // jobs, storeList 넣을 map 생성
        Map<String, Object> result = new HashMap<>();

        // jobsId로 jobs 찾기
        Jobs jobs = jobsMapper.selectByJobsId(jobsId);
        JobsCondition condition = conditionMapper.selectByJobsId(jobsId);


        // jobs의 memberId로 storeList 찾기
        List<Store> storeList = jobsMapper.selectStoreByJobsMemberId(jobs.getMemberId());
        // jobsId로 파일리스트 찾기
        List<String> fileNames = fileMapper.selectFileNameByJobsId(jobsId);
        List<JobsFile> files = fileNames.stream()
                .map(fileName -> new JobsFile(fileName, STR."\{srcPrefix}/jobs/\{jobsId}/\{fileName}"))
                .toList();
        jobs.setFileList(files);

        // map 에 넣고 반환

        result.put("jobs", jobs);
        result.put("jobsCondition", condition);
        result.put("storeList", storeList);
        return result;
    }

    public void deleteByJobsId(Integer jobsId) {
        // file 명 조회
        List<String> fileNames = fileMapper.selectFileNameByJobsId(jobsId);
        Jobs jobs = jobsMapper.selectByJobsId(jobsId);

        // s3,db jobsFile 삭제
        deleteFileList(jobs, fileNames);
        // db의 condition 삭제
        conditionMapper.deleteByJobsId(jobsId);
        // db의 jobs 삭제
        jobsMapper.deleteByJobsId(jobsId);
    }

    public Map<String, Object> list(Integer memberId, Integer page,
                                    String searchType, String keyword) {
        Map pageInfo = new HashMap();
        Integer offset = paging(page, searchType, keyword, pageInfo);
        List<Jobs> jobsList = jobsMapper.selectAllPaging(offset, searchType, keyword);

        return Map.of("pageInfo", pageInfo,
                "jobsList", jobsList);
    }


    // 추출한 메소드 들

    // db, s3 에 입력
    private void addFileList(Jobs jobs, MultipartFile[] addFileList) throws IOException {
        if (addFileList != null && addFileList.length > 0) {
            List<String> fileNameList = fileMapper.selectFileNameByJobsId(jobs.getId());
            for (MultipartFile file : addFileList) {
                String fileName = file.getOriginalFilename();
                if (!fileNameList.contains(fileName)) {
                    // 새 파일이 기존에 없을 때만 db에 추가
                    fileMapper.insertFileName(jobs.getId(), fileName);
                }
                // s3 에 쓰기
                String key = STR."arbeit/jobs/\{jobs.getId()}/\{fileName}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
    }

    // s3,db jobsFile 삭제
    private void deleteFileList(Jobs jobs, List<String> removeFileList) {
        if (removeFileList != null && removeFileList.size() > 0) {
            for (String fileName : removeFileList) {
                // s3의 파일 삭제
                String key = STR."arbeit/jobs/\{jobs.getId()}/\{fileName}";
                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3Client.deleteObject(objectRequest);

                // db jobsFile 삭제
                fileMapper.deleteFileByJobsIdAndName(jobs.getId(), fileName);
            }
        }
    }

    // 페이징
    private Integer paging(Integer page, String searchType, String keyword, Map pageInfo) {
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
        return offset;
    }


}

