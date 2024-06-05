import { Box, Flex, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";

const CustomBox = (props) => {
  return (
    <Box
      width={"100px"}
      height={"50px"}
      my={"10px"}
      mx={"15px"}
      backgroundColor="gray.100"
      borderRadius="md"
      cursor={"pointer"}
      _hover={{ bg: "gray.300" }}
      {...props}
    />
  );
};

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex
      gap={3}
      height={"70px"}
      bg={"blue.100"}
      textAlign={"center"}
      fontWeight={"700"}
      lineHeight={"50px"}
      mb={"50px"}
    >
      <CustomBox onClick={() => navigate("/")}>홈</CustomBox>
      <CustomBox onClick={() => navigate("/signup")}>회원가입</CustomBox>
      <Spacer />
      <CustomBox
        onClick={() => navigate(`/member/${account.id}`)}
        bg={"yellow.200"}
      >
        {account.name} 님
      </CustomBox>
      <CustomBox onClick={() => navigate(`/member/list`)}>회원목록</CustomBox>
      <CustomBox onClick={() => navigate("/login")}>로그인</CustomBox>
      <CustomBox
        onClick={() => {
          account.logout();
          navigate("/");
        }}
      >
        로그아웃
      </CustomBox>
    </Flex>
  );
}
