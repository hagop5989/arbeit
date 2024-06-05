package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.domain.board.BoardWriteForm;
import com.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    final BoardMapper mapper;

    public void write(BoardWriteForm form, Authentication authentication) {
        Board board = new Board(
                null,
                Integer.valueOf(authentication.getName()),
                form.getTitle(),
                form.getContent(),
                null
        );
        mapper.insert(board);
    }

    public boolean validate(Board board) {
        if (board.getTitle() == null ||
                board.getTitle().trim().equals("")) {
            return false;
        }

        if (board.getContent() == null ||
                board.getContent().trim().equals("")) {
            return false;
        }

        return true;
    }

    public List<Board> list() {
        return mapper.selectAll();
    }

    public Board get(Integer id) {
        return mapper.selectById(id);
    }

    public void removing(Integer id) {
        mapper.deleteById(id);
    }

    public void edit(Board board) {
        mapper.update(board);
    }
}
