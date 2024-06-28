import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
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

function ScrapHistory(props) {
  const [scrapList, setScrapList] = useState([]);
  const [post, setPost] = useState(false);
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  useEffect(() => {
    fetchScrapList();
  }, [account, post]);

  const fetchScrapList = () => {
    axios
      .get("/api/only-login")
      .then(() => {
        axios.get("/api/scrap/list").then((res) => {
          // favorite 상태가 true인 항목만 필터링
          const filteredScrapList = res.data.filter(
            (item) => item.favorite === true,
          );
          setScrapList(filteredScrapList);
          account.updateScrapNum(filteredScrapList.length);
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  };

  function handleDelete(id) {
    axios.delete(`/api/scrap/delete/${id}`).then(() => {
      setPost(!post);
    });
  }

  const btnStyles = (color) => ({
    bgColor: "white",
    color: color,
    border: `2px solid ${color}`,
    _hover: { bgColor: color, color: "white" },
  });

  return (
    <Box w="full" maxW="70%" mx="auto" p={5} minHeight={"600px"} h={"100%"}>
      <Heading mb={"10px"} p={1}>
        스크랩한 공고
      </Heading>
      <Divider mb={"40px"} borderWidth={"2px"} />
      {scrapList.length === 0 && <Box>스크랩한 공고가 없습니다.</Box>}
      {scrapList.length === 0 || (
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th w={"50px"} fontSize={"md"}>
                  #
                </Th>
                <Th w={"500px"} fontSize={"md"}>
                  제목
                </Th>
                <Th minW={"130px"} fontSize={"md"}>
                  마감일
                </Th>
                <Th w={"50px"} fontSize={"md"}>
                  관리
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {scrapList.map((item, index) => (
                <Tr
                  h={"10px"}
                  key={index}
                  cursor={"pointer"}
                  _hover={{ bgColor: "gray.200" }}
                >
                  <Td h={"10px"}>{index + 1}</Td>
                  <Td
                    h={"10px"}
                    onClick={() => {
                      navigate(`/jobs/${item.jobsId}`);
                    }}
                    whiteSpace="nowrap" // 줄 바꿈을 막음
                    overflow="hidden" // 넘친 내용을 숨김
                    textOverflow="ellipsis" // 넘친 내용을 "..."으로 표시
                  >
                    {item.jobsTitle}
                  </Td>
                  <Td h={"10px"} fontSize={"sm"}>
                    2024-06-25
                  </Td>
                  <Td h={"10px"}>
                    <Flex gap={"10px"} h={"15px"} alignItems={"center"}>
                      {account.isAlba() && (
                        <Button
                          {...btnStyles("royalblue")}
                          size={"sm"}
                          onClick={() =>
                            navigate(`/jobs/${item.jobsId}?modal=open`)
                          }
                        >
                          지원
                        </Button>
                      )}
                      <Button
                        {...btnStyles("orangered")}
                        size={"sm"}
                        onClick={() => handleDelete(item.id)}
                      >
                        삭제
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}

export default ScrapHistory;
