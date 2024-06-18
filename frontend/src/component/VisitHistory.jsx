import React, { useContext, useEffect, useState } from "react";
import { Box, Heading, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { LoginContext } from "./LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

function VisitHistory(props) {
  const account = useContext(LoginContext);
  const [visitList, setVisitList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setVisitList(account.recentJobPages);
  }, [account.recentJobPages]);

  return (
    <Box>
      <Heading>최근 방문한 공고</Heading>
      <Table>
        <Tbody>
          {visitList.map((page, index) => (
            <Tr key={index}>
              <Td
                cursor={"pointer"}
                _hover={{ bgColor: "gray.100" }}
                onClick={() => {
                  navigate(page);
                }}
              >
                {page}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default VisitHistory;
