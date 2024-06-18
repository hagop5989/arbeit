import { Box, Heading } from "@chakra-ui/react";
import { CommentWrite } from "./CommentWrite.jsx";
import { CommentList } from "./CommentList.jsx";

export function CommentComponent({ boardId }) {
  return (
    <Box>
      <Box>
        <Heading fontSize={15} m={3}></Heading>
      </Box>
      <CommentWrite boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}
