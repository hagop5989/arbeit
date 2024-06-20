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
import { useContext, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function LeftNavbar(props) {
  const account = useContext(LoginContext);
  const [isHovered, setIsHovered] = useState(false); // 호버 상태를 관리하는 상태 추가
  const navigate = useNavigate();
  const albaMenu = [
    { name: "공고리스트", url: "/jobs/list" },
    { name: "이력서등록", url: "/resume/register" },
    { name: "이력서관리", url: "/resume/list" },
    { name: "지원내역(알바)", url: "/apply/list" },
    { name: "캘린더테스트", url: "/test" },
  ];

  const bossMenu = [
    { name: "공고생성", url: "/jobs/register" },
    { name: "공고리스트", url: "/jobs/list" },
    { name: "지원내역(사장)", url: "/jobs/management/list" },
    { name: "가게등록", url: "/store/register" },
    { name: "가게목록", url: "/store/list" },
    { name: "캘린더테스트", url: "/test" },
  ];

  // 여기서 조건에 따라 albaMenu 또는 bossMenu를 선택하세요.
  const menuItems = account.isBoss() ? bossMenu : albaMenu;

  return (
    <Flex zIndex={"3"}>
      <Box
        position={"fixed"}
        w={"60px"}
        h={"160px"}
        borderRadius={"10px"}
        bgColor={"#2D3748"}
        color={"white"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
        left={isHovered ? "90px" : "-300px"}
        transition="left 0.3s ease"
        border={"1px solid lightgray"}
        borderRadius={"10px"}
        w={"300px"}
        zIndex={isHovered ? "4" : "2"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
