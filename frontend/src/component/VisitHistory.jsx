import React, { useContext, useEffect, useState } from "react";
import {
  Box,
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

function VisitHistory(props) {
  const account = useContext(LoginContext);
  const [visitList, setVisitList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setVisitList(account.recentJobPages);
    console.log(account.recentJobPages);
  }, [account.recentJobPages]);

  return (
    <Box w="full" maxW="70%" mx="auto" p={5} h={"600px"}>
      <Heading borderBottom={"2px solid gray"} mb={"10px"}>
        최근 방문한 공고
      </Heading>
      {visitList.length === 0 || <Box>최대 10개까지 등록됩니다.</Box>}
      {visitList.length === 0 && <Box>최근 방문한 공고가 없습니다.</Box>}
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>제목</Th>
            </Tr>
          </Thead>
          <Tbody>
            {visitList.map((item, index) => (
              <Tr
                key={index}
                cursor={"pointer"}
                _hover={{ bgColor: "gray.300" }}
              >
                <Td>{index + 1}</Td>
                <Td
                  onClick={() => {
                    navigate(item.url);
                  }}
                >
                  {item.title}
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
