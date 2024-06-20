import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function LeftNavbar(props) {
  const account = useContext(LoginContext);
  const [isVisible, setIsVisible] = useState(true);
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

  // 특정 크기 이하 이면 사라지게
  const [isLargerThanX] = useMediaQuery("(min-width: 1800px)");
  // 자연스럽게 메뉴 보이기
  useEffect(() => {
    if (isLargerThanX) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isLargerThanX]);

  // 여기서 조건에 따라 albaMenu 또는 bossMenu를 선택하세요.
  const menuItems = account.isBoss() ? bossMenu : albaMenu;

  return (
    <Flex
      display={isLargerThanX ? "block" : "none"}
      zIndex={"3"}
      position={"fixed"}
      left={"50px"}
      top={"230px"}
      h={"300px"}
    >
      <Box
        transition="transform 0.3s ease, opacity 0.3s ease"
        transform={isVisible ? "translateX(0)" : "translateX(-100%)"}
        opacity={isVisible ? 1 : 0}
        border={"1px solid lightgray"}
        borderRadius={"10px"}
        w={"300px"}
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
