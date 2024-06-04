package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    final BoardMapper mapper;

    public void writer(Board board) {
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
        if ((board.getWriter() == null ||
                board.getWriter().trim().equals(""))) {
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
}
