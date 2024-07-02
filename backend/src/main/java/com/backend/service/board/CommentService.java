package com.backend.service.board;

import com.backend.domain.board.Comment;
import com.backend.domain.board.form.CommentEditForm;
import com.backend.domain.board.form.CommentListForm;
import com.backend.domain.board.form.CommentWriterForm;
import com.backend.mapper.board.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class CommentService {

    final CommentMapper mapper;

    public void write(CommentWriterForm form, Authentication authentication
    ) {
        Comment comment = new Comment(
                null,
                form.getBoardId(),
                Integer.valueOf(authentication.getName()),
                form.getComment(),
                null
        );
        mapper.insert(comment);
    }

    public List<CommentListForm> list(Integer boardId) {
        return mapper.selectAll(boardId);
    }

    public void edit(CommentEditForm form, Integer Id) {
        Comment comment = new Comment(
                Id,
                null,
                null,
                form.getComment()
        );
        mapper.update(comment);
    }

    public void delete(Integer id) {
        mapper.deleteById(id);
    }

    public boolean hasAccess(Integer id, Authentication authentication) {
        Comment comment = mapper.selectById(id);
        if (comment == null) {
            return false;
        }
        Integer memberId = comment.getMemberId();
        String loginId = authentication.getName();
        return String.valueOf(memberId).equals(loginId);
    }

    public void deleteByBoardId(Integer boardId) {
        mapper.deleteByBoardId(boardId);
    }
}