import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import { LoginContext } from "../provider/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function LeftNavbar(props) {
  const account = useContext(LoginContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const navigate = useNavigate();
  const albaMenu = [
    { name: "공고리스트", url: "/jobs/list" },
    { name: "이력서등록", url: "/resume/register" },
    { name: "이력서관리", url: "/resume/list" },
    { name: "지원내역", url: "/apply/list" },
    { name: "캘린더테스트", url: "/test" },
  ];

  const bossMenu = [
    { name: "공고생성", url: "/jobs/register" },
    { name: "공고리스트", url: "/jobs/list" },
    { name: "지원내역", url: "/jobs/management/list" },
    { name: "가게등록", url: "/store/register" },
    { name: "가게목록", url: "/store/list" },
    { name: "캘린더테스트", url: "/test" },
  ];

  const menuItems = account.isBoss() ? bossMenu : albaMenu;

  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      if (!isMenuHovered) {
        setIsHovered(false);
      }
    }, 200);
  };

  const handleMenuMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsMenuHovered(true);
    setIsHovered(true);
  };

  const handleMenuMouseLeave = () => {
    setIsMenuHovered(false);
    timerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  return (
    <Flex zIndex={"3"}>
      <Box
        position={"fixed"}
        w={"60px"}
        h={"150px"}
        borderRadius={"10px"}
        bgColor={"#2D3748"}
        color={"white"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        cursor={"pointer"}
      >
        <Text writingMode={"vertical-rl"} transform={"rotate(270deg)"}>
          메뉴 호버
        </Text>
      </Box>
      <Box
        position={"fixed"}
        top={"230px"}
        left={isHovered ? "100px" : "-300px"}
        transition="left 0.3s ease"
        border={"1px solid lightgray"}
        borderRadius={"10px"}
        w={"300px"}
        zIndex={isHovered ? "4" : "2"}
        onMouseEnter={handleMenuMouseEnter}
        onMouseLeave={handleMenuMouseLeave}
        bgColor={"white"}
        boxShadow={"lg"}
      >
        <Table>
          <Thead>
            <Tr>
              <Th bgColor={"gray.100"}>submenu</Th>
            </Tr>
          </Thead>
          <Tbody>
            {menuItems.map((item, index) => (
              <Tr
                h={"50px"}
                key={index}
                _hover={{ bgColor: "orange.50" }}
                cursor={"pointer"}
                onClick={() => navigate(item.url)}
              >
                <Td>{item.name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}
