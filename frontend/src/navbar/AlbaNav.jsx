import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function AlbaNav() {
  const navigate = useNavigate();

  return (
    <>
      <Box onClick={() => navigate("/")}>홈</Box>
      <Box onClick={() => navigate("/alba/signup")}>회원가입</Box>
      <Box onClick={() => navigate("/login")}>로그인</Box>
      <Box onClick={() => navigate(`/alba/list`)}>회원목록</Box>
    </>
  );
}
