import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
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
      <Heading mb={"10px"} p={1}>
        최근 본 알바 공고
      </Heading>
      <Divider mb={"40px"} borderWidth={"2px"} />
      {visitList.length === 0 || <Box>최대 10개까지 등록됩니다.</Box>}
      {visitList.length === 0 && <Box>최근 방문한 공고가 없습니다.</Box>}
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th w={"50px"} fontSize={"md"}>
                #
              </Th>
              <Th w={"600px"} fontSize={"md"}>
                제목
              </Th>
              {account.isAlba() && (
                <Th minW={"100px"} fontSize={"md"}>
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
                <Td h={"10px"}>{index + 1}</Td>
                <Td
                  h={"10px"}
                  onClick={() => {
                    navigate(item.url);
                  }}
                  whiteSpace="nowrap" // 줄 바꿈을 막음
                  overflow="hidden" // 넘친 내용을 숨김
                  textOverflow="ellipsis" // 넘친 내용을 "..."으로 표시
                >
                  {item.title}
                </Td>
                <Td h={"10px"}>
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
