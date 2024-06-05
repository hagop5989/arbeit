package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.domain.board.BoardEditForm;
import com.backend.domain.board.BoardWriteForm;
import com.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    final BoardMapper mapper;

    public void write(BoardWriteForm form, Authentication authentication) {
        Board board = new Board(
                null,
                Integer.valueOf(authentication.getName()),
                null,
                form.getTitle(),
                form.getContent(),
                null
        );
        mapper.insert(board);
    }

    public List<Board> list() {
        return mapper.selectAll();
    }

    public Board findById(Integer id) {
        return mapper.selectById(id);
    }

    public void delete(Integer id) {
        mapper.deleteById(id);
    }

    public void edit(BoardEditForm form, Integer id) {
        Board board = new Board(
                id,
                form.getTitle(),
                form.getContent()
        );
        mapper.update(board);
    }

    public boolean hasAccess(Integer id, Authentication authentication) {
        Integer memberId = mapper.selectById(id).getMemberId();
        Integer loginId = Integer.valueOf(authentication.getName());
        return Objects.equals(memberId, loginId);
    }
}
