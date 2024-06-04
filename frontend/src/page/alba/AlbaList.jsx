import {
  Box,
  Center,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function AlbaList() {
  const [albaList, setAlbaList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("/api/alba/list").then((res) => setAlbaList(res.data));
  }, []);

  return (
    <Center>
      <Box>
        <Box>
          <Heading>회원 목록</Heading>
        </Box>
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>이메일</Th>
                <Th>이름</Th>
              </Tr>
            </Thead>
            <Tbody>
              {albaList.map((alba) => (
                <Tr
                  key={alba.id}
                  cursor={"pointer"}
                  _hover={{ bgColor: "gray.200" }}
                  onClick={() => navigate(`/alba/${alba.id}`)}
                >
                  <Td>{alba.id}</Td>
                  <Td>{alba.email}</Td>
                  <Td>{alba.name}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Center>
  );
}
