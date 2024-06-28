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
import { LoginContext } from "../provider/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function LeftNavbar() {
  const account = useContext(LoginContext);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const albaMenu = [
    { name: "이력서 등록", url: "/resume/register" },
    { name: "이력서 관리", url: "/resume/list" },
    { name: "나의 지원내역", url: "/application/list" },
  ];

  const bossMenu = [
    { name: "공고 등록", url: "/jobs/register" },
    { name: "지원내역", url: "/application-manage/list" },
    { name: "사업장 리스트", url: "/store/register" },
    { name: "나의 사업장 리스트", url: "/store/list" },
    { name: "직원 리스트", url: "/alba-list" },
  ];

  const menuItems = account.isBoss() ? bossMenu : albaMenu;

  // 특정 크기 이하 이면 사라지게
  const [isLargerThanX] = useMediaQuery("(min-width: 1800px)");
  // 자연스럽게 메뉴 보이기
  useEffect(() => {
    if (account.isLoggedIn()) {
      if (isLargerThanX) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
    if (!account.isLoggedIn()) {
      setIsVisible(false);
    }
  }, [isLargerThanX, account]);

  return (
    <Flex
      display={isLargerThanX ? "block" : "none"}
      zIndex={"3"}
      position={"fixed"}
      left={"150px"}
      top={"230px"}
      h={"300px"}
    >
      <Box
        transition="transform 0.3s ease, opacity 0.3s ease"
        transform={isVisible ? "translateX(0)" : "translateX(-100%)"}
        opacity={isVisible ? 1 : 0}
        border={"1px solid lightgray"}
        borderRadius={"10px"}
        w={"200px"}
        bgColor={"white"}
        boxShadow={"lg"}
      >
        <Table>
          <Thead>
            <Tr>
              <Th bgColor={"gray.100"}>메뉴</Th>
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
