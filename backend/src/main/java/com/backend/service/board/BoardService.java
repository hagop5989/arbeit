package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.domain.board.BoardImage;
import com.backend.domain.board.form.BoardEditForm;
import com.backend.domain.board.form.BoardWriteForm;
import com.backend.mapper.board.BoardMapper;
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
import java.util.Objects;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    private final S3Client s3Client;

    private final BoardMapper mapper;

    private final CommentService commentService;

    public void write(BoardWriteForm form, Authentication authentication
    ) throws IOException {
        Board board = new Board(
                null,
                Integer.valueOf(authentication.getName()),
                null,
                form.getTitle(),
                form.getContent(),
                null,
                null,
                null, null, null
        );
        mapper.insert(board);

        Integer boardId = board.getId();

        //사진
        List<MultipartFile> images = form.getImages();
        if (images != null) {
            for (MultipartFile image : images) {
                String imageName = image.getOriginalFilename();
                mapper.insertImage(boardId, imageName);
                saveBoardImageToS3(image, boardId, imageName);
            }
        }
    }

    public Map<String, Object> findById(Integer boardId, Authentication authentication) {

        Map<String, Object> result = new HashMap<>();

        Board board = mapper.selectById(boardId);

        if (board == null) {
            return null;
        }

        Map<String, Object> like = new HashMap<>();
        if (authentication == null) {
            like.put("like", false);
        } else {
            int c = mapper.selectLikeByBoardIdAndMemberId(boardId, authentication.getName());
            like.put("like", c == 1);
        }
        like.put("count", mapper.selectCountLike(boardId));


        Map<String, Object> view = new HashMap<>();

        view.put("count", mapper.selectCountView(boardId));


        List<String> imagesNames = mapper.selectImageNameById(boardId);
        List<BoardImage> images = imagesNames.stream()
                .map(imageName -> new BoardImage(imageName, STR."arbeit/board/\{boardId}/\{imageName}"))
                .toList();

        result.put("board", board);
        result.put("images", images);
        result.put("like", like);
        result.put("view", view);


        return result;


    }


    public Map<String, Object> list(
            Integer page,
            String searchType,
            String keyword,
            String filterType, String filterDetail) {
        Map<String, Object> pageInfo = new HashMap<>();
        Integer countAll = mapper.countAllWithSearch(searchType, keyword, filterType, filterDetail);

        Integer offset = (page - 1) * 10;
        Integer lastPageNumber = (countAll - 1) / 10 + 1;

        Integer leftPageNumber = ((page - 1) / 10) * 10 + 1;
        Integer rightPageNumber = leftPageNumber + 9;

        rightPageNumber = Math.min(rightPageNumber, lastPageNumber);

        Integer prevPageNumber = (leftPageNumber > 1) ? leftPageNumber - 1 : null;
        Integer nextPageNumber = (rightPageNumber < lastPageNumber) ? rightPageNumber + 1 : null;

        if (prevPageNumber != null) {
            pageInfo.put("prevPageNumber", prevPageNumber);
        }
        if (nextPageNumber != null) {
            pageInfo.put("nextPageNumber", nextPageNumber);
        }
        pageInfo.put("currentPageNumber", page);
        pageInfo.put("lastPageNumber", lastPageNumber);
        pageInfo.put("leftPageNumber", leftPageNumber);
        pageInfo.put("rightPageNumber", rightPageNumber);

        return Map.of(
                "pageInfo", pageInfo,
                "boardList", mapper.selectAllPaging(offset, searchType, keyword, filterType, filterDetail)
        );

    }

    //update
    public void edit(BoardEditForm form, Authentication authentication) throws IOException {


        Integer boardId = form.getId();
        Board board = new Board(
                form.getId(),
                form.getTitle(),
                form.getContent()
        );
        mapper.update(board);


        //사진삭제
        removeBoardImageToS3(boardId, form.getRemoveImages());
        List<String> removeImages = form.getRemoveImages();
        if (removeImages != null) {
            for (String removeImage : removeImages) {
                mapper.deleteByboardIdAndImageName(boardId, removeImage);
            }
        }
        //사진 추가
        List<MultipartFile> addImages = form.getAddImages();

        if (addImages != null) {
            for (MultipartFile addImage : addImages) {
                String imageName = addImage.getOriginalFilename();
                mapper.insertImage(boardId, imageName);
                saveBoardImageToS3(addImage, boardId, addImage.getOriginalFilename());
            }
        }


    }


    public void delete(Integer boardId) {
        // 보드 게시물 관련 like 삭제
        mapper.deleteLikeByBoardId(boardId);

        // 보드 게시물 관련 댓글 삭제
        commentService.deleteByBoardId(boardId);

        // 이미지 파일명 조회
        List<String> fileNames = mapper.selectImageNameById(boardId);

        // 이미지 파일 S3에서 삭제
        removeBoardImageToS3(boardId, fileNames);

        // 보드에 연결된 이미지 데이터 삭제
        mapper.deleteByboardId(boardId);

        // 보드 뷰 삭제
        mapper.deleteBoardView(boardId);

        // 보드 데이터 삭제
        mapper.deleteById(boardId);
    }


    private void saveBoardImageToS3(MultipartFile image, int boardId, String imageName) throws IOException {

        String key = STR."arbeit/board/\{boardId}/\{imageName}";
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        s3Client.putObject(objectRequest,
                RequestBody.fromInputStream(image.getInputStream(), image.getSize()));
    }

    private void removeBoardImageToS3(Integer boardId, List<String> removeImages) {
        if (removeImages != null && !removeImages.isEmpty()) {
            for (String imageName : removeImages) {

                String key = STR."arbeit/board/\{boardId}/\{imageName}";
                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3Client.deleteObject(objectRequest);

                //db.삭제
                mapper.deleteByboardIdAndImageName(boardId, imageName);
            }
        }
    }


    public boolean hasAccess(BoardEditForm form, Authentication authentication) {

        try {
            Board board = mapper.selectById(form.getId());
            if (board == null) {
                return false; // 혹은 예외 처리
            }

            Integer memberId = board.getMemberId();
            Integer loginId = Integer.valueOf(authentication.getName());
            return Objects.equals(memberId, loginId);
        } catch (NumberFormatException | NullPointerException e) {
            // 예외 처리
            e.printStackTrace();
            return false; // 예외 발생 시 기본 동작
        }
    }


    public Map<String, Object> like(Map<String, Object> req, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();
        result.put("like", false);
        Integer boardId = (Integer) req.get("boardId");
        Integer memberId = Integer.valueOf(authentication.getName());


        int count = mapper.deleteLikeByBoardIdAndMemberId(boardId, memberId);


        if (count == 0) {
            mapper.insertLikeByBoardIdAndMemberId(boardId, memberId);
            result.put("like", true);
        }

        result.put("count", mapper.selectCountLike(boardId));

        return result;
    }

//    public Map<String, Object> view(Map<String, Object> req, Authentication authentication) {
//        Map<String, Object> result = new HashMap<>();
//        result.put("view", false); // 기본적으로 "조회" 상태를 false로 설정
//
//        Integer boardId = (Integer) req.get("boardId"); // 요청에서 게시글 ID를 추출
//        Integer memberId = Integer.valueOf(authentication.getName()); // 현재 인증된 사용자의 ID를 추출
//
//        // 사용자가 이미 해당 게시글을 조회했는지 확인
//        int viewCount = mapper.deleteViewByBoardIdAndMemberId(boardId, memberId);
//
//        if (viewCount == 0) {
//            mapper.insertViewByBoardIdAndMemberId(boardId); // "조회" 추가
//            result.put("view", true); // "조회" 상태를 true로 설정
//        }
//
//        // 현재 게시글의 총 "조회" 수를 조회하여 결과에 추가
//        result.put("count", mapper.selectCountView(boardId));
//
//        return result;
//    }
}

