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
      <Heading p={1} fontFamily={"SBAggroB"}>
        스크랩한 공고
      </Heading>
      <Flex>
        <Box my={"20px"} h={"50px"} lineHeight={"50px"}>
          * 공고를 스크랩해서 편리하게 찾아보세요.
        </Box>
      </Flex>
      {scrapList.length === 0 && <Box>스크랩한 공고가 없습니다.</Box>}
      {scrapList.length === 0 || (
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
                <Th w={"500px"} fontSize={"sm"}>
                  제목
                </Th>
                <Th minW={"130px"} fontSize={"sm"}>
                  마감일
                </Th>
                <Th w={"50px"} fontSize={"sm"}>
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
                  <Td>{index + 1}</Td>
                  <Td
                    onClick={() => {
                      navigate(`/jobs/${item.jobsId}`);
                    }}
                    whiteSpace="nowrap" // 줄 바꿈을 막음
                    overflow="hidden" // 넘친 내용을 숨김
                    textOverflow="ellipsis" // 넘친 내용을 "..."으로 표시
                  >
                    {item.jobsTitle}
                  </Td>
                  <Td fontSize={"sm"}>2024-06-25</Td>
                  <Td>
                    <Flex gap={"5px"} h={"15px"} alignItems={"center"}>
                      {account.isAlba() && (
                        <Button
                          {...btnStyles("royalblue")}
                          w={"50px"}
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
                        h={"30px"}
                        w={"50px"}
                        fontSize={"sm"}
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
