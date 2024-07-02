package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.domain.board.form.BoardEditForm;
import com.backend.domain.board.form.BoardWriteForm;
import com.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

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
    }

    public Map<String, Object> findById(Integer boardId, Authentication authentication) {

        Map<String, Object> result = new HashMap<>();

        Board board = mapper.selectById(boardId);

        if (board == null) {
            return null;
        }

        Map<String, Object> like = new HashMap<>();
        int c = mapper.selectLikeByBoardIdAndMemberId(boardId);
        like.put("like", c == 1);
        like.put("count", mapper.selectCountLike(boardId));

        Map<String, Object> view = new HashMap<>();

        int v = mapper.selectViewByBoardIdAndMemberId(boardId, board.getMemberId());
        view.put("view", v == 1);
        view.put("count", mapper.selectCountView(boardId));

        result.put("board", board);
        result.put("like", like);
        result.put("view", view);

        return result;

    }

    public Map<String, Object> findAll(
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
        Board board = new Board(
                form.getId(),
                form.getTitle(),
                form.getContent()
        );
        mapper.update(board);
    }


    public void delete(Integer boardId) {
        // 보드 게시물 관련 like 삭제
        mapper.deleteLikeByBoardId(boardId);

        // 보드 게시물 관련 댓글 삭제
        commentService.deleteByBoardId(boardId);

        // 이미지 파일명 조회
        List<String> fileNames = mapper.selectImageNameById(boardId);

        // 보드에 연결된 이미지 데이터 삭제
        mapper.deleteByboardId(boardId);

        // 보드 뷰 삭제
        mapper.deleteBoardView(boardId);

        // 보드 데이터 삭제
        mapper.deleteById(boardId);
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

    public Map<String, Object> view(Map<String, Object> req, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();
        result.put("view", false); // 기본적으로 "조회" 상태를 false로 설정

        Integer boardId = (Integer) req.get("boardId"); // 요청에서 게시글 ID를 추출
        Integer memberId = Integer.valueOf(authentication.getName()); // 현재 인증된 사용자의 ID를 추출

        // 사용자가 이미 해당 게시글을 조회했는지 확인
        int viewCount = mapper.deleteViewByBoardIdAndMemberId(boardId, memberId);

        if (viewCount == 0) {
            mapper.insertViewByBoardIdAndMemberId(boardId); // "조회" 추가
        }
        result.put("view", true); // "조회" 상태를 true로 설정

        // 현재 게시글의 총 "조회" 수를 조회하여 결과에 추가
        result.put("count", mapper.selectCountView(boardId));

        System.out.println(result);
        return result;
    }
}

