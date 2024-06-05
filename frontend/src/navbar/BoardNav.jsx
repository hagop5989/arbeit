import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export function BoardNav() {
  const navigate = useNavigate();
  return (
    <>
      <Box onClick={() => navigate("board list")}>자유게시판</Box>
      <Box onClick={() => navigate("board write")}>글쓰기</Box>
    </>
  );
}
