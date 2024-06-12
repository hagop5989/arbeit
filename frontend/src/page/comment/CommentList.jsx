import React, { useEffect, useState } from "react";
import { Box, Card, CardBody } from "@chakra-ui/react";
import axios from "axios";
import { CommentItem } from "./CommentItem.jsx";

export function CommentList(boardId) {
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/comment/list${boardId}`)
      .then((res) => {
        setCommentList(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  }, []);

  if (commentList.length === 0) {
    return <Box>댓글이 없습니다. 첫 댓글을 작성해보세요.</Box>;
  }

  return (
    <Card>
      <CardBody>
        {commentList.map((comment) => (
          <CommentItem comment={{ comment }} key={comment.id} />
        ))}
      </CardBody>
    </Card>
  );
}
