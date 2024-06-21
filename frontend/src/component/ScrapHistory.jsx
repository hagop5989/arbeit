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
import { LoginContext } from "./LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ScrapHistory(props) {
  const account = useContext(LoginContext);
  const [scrapList, setScrapList] = useState([]);
  const navigate = useNavigate();
  const [post, setPost] = useState(false);
  useEffect(() => {
    axios
      .get("/api/scrap/list")
      .then((res) => {
        // favorite 상태가 true인 항목만 필터링
        const filteredScrapList = res.data.filter(
          (item) => item.favorite === true,
        );
        setScrapList(filteredScrapList);
      })
      .catch()
      .finally();
  }, [account.recentJobPages, post]);

  function handleDelete(id) {
    axios.delete(`/api/scrap/delete/${id}`).then(() => {
      setPost(!post);
    });
  }

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
                <Th w={"600px"} fontSize={"md"}>
                  제목
                </Th>
                <Th w={"50px"} fontSize={"md"}>
                  관리
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {scrapList.map((item, index) => (
                <Tr
                  key={index}
                  cursor={"pointer"}
                  _hover={{ bgColor: "gray.200" }}
                >
                  <Td>{index + 1}</Td>
                  <Td
                    onClick={() => {
                      navigate(`/jobs/${item.jobsId}`);
                    }}
                    fontWeight={"700"}
                  >
                    {item.jobsTitle}
                  </Td>
                  <Td>
                    <Button
                      colorScheme={"red"}
                      variant={"outline"}
                      size={"sm"}
                      mt={"10px"}
                      onClick={() => handleDelete(item.id)}
                    >
                      삭제
                    </Button>
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
