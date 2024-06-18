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
    <Box w={"1050px"}>
      <Heading>최근 방문한 공고</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>제목</Th>
          </Tr>
        </Thead>
        <Tbody>
          {visitList.map((item, index) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td
                cursor={"pointer"}
                _hover={{ bgColor: "gray.100" }}
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
  );
}

export default VisitHistory;
