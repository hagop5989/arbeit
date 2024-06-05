import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function MemberNav() {
  const navigate = useNavigate();

  return (
    <>
      <Box onClick={() => navigate("/signup")}>회원가입</Box>
      <Box onClick={() => navigate("/login")}>로그인</Box>
      <Box onClick={() => navigate(`/member/list`)}>회원목록</Box>
    </>
  );
}
