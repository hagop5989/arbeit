package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.domain.board.BoardEditForm;
import com.backend.domain.board.BoardWriteForm;
import com.backend.mapper.board.BoardFileMapper;
import com.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
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
import java.util.Objects;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    //@Value("${aws.s3.bucket.name}")
    //String bucketName;

    /*@Value("${image.src.prefix}")
    String srcPrefix;*/

    private final BoardFileMapper boardFileMapper;
    private final BoardMapper mapper;
    private S3Client s3Client;

    public void write(BoardWriteForm form, MultipartFile[] files, Authentication authentication
    ) {
        Board board = new Board(
                null,
                Integer.valueOf(authentication.getName()),
                null,
                form.getTitle(),
                form.getContent(),
                null

        );
        mapper.insert(board);

        Integer boardId = board.getId();

        if (Objects.nonNull(boardId)) {
            for (MultipartFile file : files) {
                String fileName = file.getOriginalFilename();

                try {
                    // 파일 관련 테이블에 이미지 삽입
                    boardFileMapper.insertImage(boardId, fileName);

                    // S3에 이미지 저장
                    saveBoardImageToS3(file, boardId, fileName);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public List<Board> list() {
        return mapper.selectAll();
    }

    public Board findById(Integer id) {
        return mapper.selectById(id);
    }

    public void delete(Integer id) {

        List<String> imageNames = boardFileMapper.selectImagesById(id);

        for (String imageName : imageNames) {
            removeBoardImageToS3(id, imageName);
        }

        boardFileMapper.deleteByImagesId(id);
        mapper.deleteById(id);
    }

    public void edit(BoardEditForm form, Integer id, List<String> removeImages, MultipartFile[] addImages) throws IOException {
        Board board = new Board(
                id,
                form.getTitle(),
                form.getContent()
        );
        mapper.update(board);

        if (Objects.nonNull(removeImages) && !removeImages.isEmpty()) {
            for (String imageName : removeImages) {

                removeBoardImageToS3(id, imageName);
                boardFileMapper.deleteImageByIdAndName(id, imageName);
            }
        }
        if (Objects.nonNull(addImages) && addImages.length > 0) {
            for (MultipartFile file : addImages) {
                String fileName = file.getOriginalFilename();
                boardFileMapper.insertImage(id, fileName);
                saveBoardImageToS3(file, id, fileName);
            }
        }
    }

    public boolean hasAccess(Integer id, Authentication authentication) {
        Integer memberId = mapper.selectById(id).getMemberId();
        Integer loginId = Integer.valueOf(authentication.getName());
        return Objects.equals(memberId, loginId);
    }

    private void saveBoardImageToS3(MultipartFile image, int boardId, String filename) throws IOException {
        //String key = STR."arbeit/board/\{boardId}/\{filename}";
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                //.bucket(bucketName)
                //.key(key)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        s3Client.putObject(objectRequest,
                RequestBody.fromInputStream(image.getInputStream(), image.getSize()));
    }

    private void removeBoardImageToS3(Integer boardId, String imageName) {
        //String key = STR."arbeit/board/\{boardId}/\{imageName}";
        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                //.bucket(bucketName)
                //.key(key)
                .build();
        s3Client.deleteObject(objectRequest);
    }
}
