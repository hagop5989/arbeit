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

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/api/member/list")
      .then((res) => setMemberList(res.data))
      .catch(() => navigate("/"));
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
              {memberList.map((member) => (
                <Tr
                  key={member.id}
                  cursor={"pointer"}
                  _hover={{ bgColor: "gray.200" }}
                  onClick={() => navigate(`/member/${member.id}`)}
                >
                  <Td>{member.id}</Td>
                  <Td>{member.email}</Td>
                  <Td>{member.name}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Center>
  );
}
