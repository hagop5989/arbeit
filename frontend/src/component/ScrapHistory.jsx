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
    <Box w={"100%"} h={"65vh"}>
      <Heading mb={"10px"} p={1}>
        스크랩한 공고
      </Heading>
      <Divider mb={"40px"} borderWidth={"2px"} />
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>제목</Th>
            </Tr>
          </Thead>
          <Tbody lineHeight={"54px"}>
            {scrapList.map((item, index) => (
              <Tr
                key={index}
                cursor={"pointer"}
                _hover={{ bgColor: "orange.50" }}
              >
                <Td>{index + 1}</Td>
                <Td
                  onClick={() => {
                    navigate(`/jobs/${item.jobsId}`);
                  }}
                >
                  {item.jobsTitle}
                </Td>
                <Button
                  w={"70px"}
                  mr={"20px"}
                  colorScheme={"red"}
                  onClick={() => handleDelete(item.id)}
                >
                  삭제
                </Button>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default ScrapHistory;
