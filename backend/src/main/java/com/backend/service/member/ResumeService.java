package com.backend.service.member;

import com.backend.domain.member.Resume;
import com.backend.mapper.member.ResumeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ResumeService {
    private final ResumeMapper mapper;

    public void insert(Resume resume, MultipartFile[] files) throws IOException {
        mapper.insert(resume);

        if(files != null) {
            for (MultipartFile file : files) {
                mapper.insertFileName(resume.getId(), file.getOriginalFilename());
                // 실제 파일 저장
                // 부모 디렉토리 만들기
                String dir = STR."C:/Temp/prj3/\{resume.getId()}"; // 폴더 만드는 코드
                File dirFile = new File(dir);
                if(!dirFile.exists()) {
                    dirFile.mkdirs();
                }

                // 파일 경로
                String path = STR."C:/Temp/prj3/\{resume.getId()}/\{file.getOriginalFilename()}";
                File destination = new File(path);
                file.transferTo(destination);
                System.out.println("finished");
            }
        }
    }

    public List<Resume> list(Integer memberId) {
        return mapper.list(memberId);
    }

    public Resume select(Integer id) {
        return mapper.select(id);
    }

}
