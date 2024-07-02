import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { LoginContext } from "../provider/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function VisitHistory(props) {
  const account = useContext(LoginContext);
  const [visitList, setVisitList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/api/only-login")
      .then(() => {
        setVisitList(account.recentJobPages);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [account.recentJobPages]);

  const btnStyles = (color) => ({
    bgColor: "white",
    color: color,
    border: `2px solid ${color}`,
    _hover: { bgColor: color, color: "white" },
  });

  return (
    <Box w="full" maxW="70%" mx="auto" p={5} minHeight={"600px"} h={"100%"}>
      <Heading p={1} fontFamily={"SBAggroB"}>
        최근 본 공고
      </Heading>
      <Flex>
        <Box my={"20px"} h={"50px"} lineHeight={"50px"}>
          * 최대 10개까지 저장됩니다.
        </Box>
      </Flex>
      {visitList.length === 0 && <Box>최근 방문한 공고가 없습니다.</Box>}
      <Box>
        <Table>
          <Thead
            bg="gray.100"
            borderTop={"1px solid gray"}
            borderBottom={"2px solid #E9E9E9"}
          >
            <Tr>
              <Th w={"50px"} fontSize={"sm"}>
                #
              </Th>
              <Th w={"600px"} fontSize={"sm"}>
                제목
              </Th>
              {account.isAlba() && (
                <Th minW={"100px"} fontSize={"sm"}>
                  관리
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {visitList.map((item, index) => (
              <Tr
                h={"10px"}
                key={index}
                cursor={"pointer"}
                _hover={{ bgColor: "gray.300" }}
              >
                <Td borderBottom={"1px solid #E0E0E0"}>{index + 1}</Td>
                <Td
                  borderBottom={"1px solid #E0E0E0"}
                  onClick={() => {
                    navigate(item.url);
                  }}
                  whiteSpace="nowrap" // 줄 바꿈을 막음
                  overflow="hidden" // 넘친 내용을 숨김
                  textOverflow="ellipsis" // 넘친 내용을 "..."으로 표시
                >
                  {item.title}
                </Td>
                <Td borderBottom={"1px solid #E0E0E0"}>
                  {account.isAlba() && (
                    <Button
                      {...btnStyles("royalblue")}
                      size={"sm"}
                      onClick={() => navigate(`${item.url}?modal=open`)}
                    >
                      지원
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default VisitHistory;
