import React, { useContext } from "react";
import { Box, Button, Flex, HStack, Image, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";

// 개별 메뉴 링크 컴포넌트
const NavLink = ({ href, children }) => (
  <Link href={href} fontSize="lg" color="black">
    {children}
  </Link>
);

// 공통 버튼 컴포넌트
const NavbarButton = ({ children, onClick }) => (
  <Button
    variant="outline"
    ml={2}
    padding="10px 15px"
    fontSize="13px"
    border="1px solid #CCD4E0"
    onClick={onClick}
  >
    {children}
  </Button>
);

// 작은 링크 컴포넌트
const SmallLink = ({ href, children }) => (
  <Link href={href} fontSize="md" color="black" ml={4}>
    {children}
  </Link>
);

// Navbar 컴포넌트
const Navbar = () => {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  return (
    <Box
      bg="white"
      borderBottom="3px solid #eaeaea"
      height="110px"
      pt={"30px"}
      mb={"70px"}
      border={"1px solid black"}
    >
      <Flex
        h="80%"
        alignItems="center"
        justifyContent="space-between"
        mx={{ base: "50px", xl: "200px" }}
        pt={"30px"}
        border={"1px solid red"}
      >
        <HStack spacing={8} alignItems="center" mb="30px" ml={"100px"}>
          <Box
            display="flex"
            alignItems="center"
            width="130px"
            height="107px"
            pb={"37px"}
          >
            <Image
              src="/public/alba_connector_logo.png"
              height={"100%"}
              cursor={"pointer"}
              borderRadius={"10px"}
              transition="transform 0.3s ease-in-out"
              _hover={{
                transform: "scale(0.95)",
              }}
              onClick={() => navigate("/")}
            />
          </Box>
          <HStack
            as="nav"
            spacing={10}
            alignItems="center"
            fontWeight={"600"}
            position={"absolute"}
            left={{ base: "350px", xl: "500px" }}
            display={{ base: "none", md: "flex" }}
          >
            <NavLink href="/jobs/list">알바 공고</NavLink>
            <NavLink href="/board/list">질문 게시판</NavLink>
            <NavLink href="/">고객 센터(구현 X)</NavLink>
          </HStack>
        </HStack>
        <Flex
          alignItems="center"
          mb="30px"
          mr={{ base: "-130px", "2xl": "100px" }}
          display={{ base: "none", lg: "flex" }}
        >
          {account.isLoggedIn() || <SmallLink href="/login">로그인</SmallLink>}
          {account.isLoggedIn() || (
            <SmallLink href="/signup">회원가입</SmallLink>
          )}
          {account.isLoggedIn() && (
            <Box fontSize="15px" color="black" mr={"20px"} fontWeight={"600"}>
              {account.name} 님
            </Box>
          )}
          {account.isLoggedIn() && (
            <Box
              fontSize="sm"
              color="black"
              mr={"40px"}
              cursor={"pointer"}
              _hover={{
                textDecoration: "underline",
              }}
              onClick={() => {
                account.logout();
                navigate("/");
              }}
            >
              로그아웃
            </Box>
          )}
          {account.isAlba() && (
            <NavbarButton
              onClick={() => {
                navigate("/resume/list");
              }}
            >
              이력서 관리
            </NavbarButton>
          )}

          {account.isBoss() && (
            <NavbarButton onClick={() => navigate("/jobs/register")}>
              공고 등록
            </NavbarButton>
          )}
          {account.isBoss() && (
            <NavbarButton onClick={() => navigate("/store/register")}>
              가게 등록
            </NavbarButton>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
