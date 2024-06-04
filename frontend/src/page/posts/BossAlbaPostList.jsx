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
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BossAlbaPostList() {
  const [albaPostList, setAlbaPostList] = useState([]);
  const account = useContext(LoginContext);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/api/boss/post/list?bossId=${account.id}`)
      .then((res) => setAlbaPostList(res.data));
  }, []);
  return (
    <Center>
      <Box>
        <Box>
          <Heading>알바 공고 목록</Heading>
        </Box>
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>타이틀</Th>
                <Th>가게명</Th>
                <Th>작성자</Th>
              </Tr>
            </Thead>
            <Tbody>
              {albaPostList.map((albaPost) => (
                <Tr
                  key={albaPost.id}
                  cursor={"pointer"}
                  _hover={{ bgColor: "gray.200" }}
                  onClick={() => navigate(`/boss/albaPost/${albaPost.id}`)}
                >
                  <Td>{albaPost.id}</Td>
                  <Td>{albaPost.title}</Td>
                  <Td>{albaPost.storeName}</Td>
                  <Td>{albaPost.bossName}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Center>
  );
}
