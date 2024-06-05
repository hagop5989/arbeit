import { Box, Flex, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex gap={3}>
      <Box onClick={() => navigate("/")}>홈</Box>
      <Box onClick={() => navigate("/signup")}>회원가입</Box>
      <Spacer />
      <Box onClick={() => navigate(`/member/list`)}>회원목록</Box>
      <Box onClick={() => navigate("/login")}>로그인</Box>
      <Box
        onClick={() => {
          account.logout();
          navigate("/");
        }}
      >
        로그아웃
      </Box>
    </Flex>
  );
}
