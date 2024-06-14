package com.backend.service.board;

import com.backend.domain.board.Comment;
import com.backend.domain.board.CommentEditForm;
import com.backend.domain.board.CommentWriterForm;
import com.backend.mapper.board.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class CommentService {

    final CommentMapper mapper;

    public void add(CommentWriterForm form, Authentication authentication
    ) {
        Comment comment = new Comment(
                null,
                form.getBoardId(),
                Integer.valueOf(authentication.getName()),
                form.getComment(),
                LocalDateTime.now()
        );
        mapper.insert(comment);

    }

    public List<Comment> list(Integer boardId) {
        return mapper.selectAll(boardId);

    }

    public void delete(Integer id) {
        mapper.deleteById(id);

    }

    public void edit(CommentEditForm form, Integer id) {
        Comment comment = new Comment(
                id,
                null,
                null,
                form.getComment()
        );
        mapper.update(comment);
    }


    public boolean hasAccess(Integer id, Authentication authentication) {
        Integer memberId = mapper.selectById(id).getMemberId();
        Integer loginId = Integer.valueOf(authentication.getName());
        return memberId.equals(loginId);
    }

}