import { Box, Heading } from "@chakra-ui/react";
import { CommentWrite } from "./CommentWrite.jsx";
import { CommentList } from "./CommentList.jsx";
import { useState } from "react";

export function CommentComponent({ boardId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Box>
      <Box>
        <Heading fontSize={15} m={3}></Heading>
      </Box>
      <CommentWrite
        boardId={boardId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
      <CommentList
        boardId={boardId}
        setIsProcessing={setIsProcessing}
        isProcessing={isProcessing}
      />
    </Box>
  );
}
