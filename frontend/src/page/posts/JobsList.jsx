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

export function JobsList() {
  const [jobsList, setJobsList] = useState([]);
  const account = useContext(LoginContext);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/api/boss/jobs/list?bossId=${account.id}`)
      .then((res) => setJobsList(res.data));
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
              {jobsList.map((jobs) => (
                <Tr
                  key={jobs.id}
                  cursor={"pointer"}
                  _hover={{ bgColor: "gray.200" }}
                  onClick={() => navigate(`/boss/jobs/${jobs.id}`)}
                >
                  <Td>{jobs.id}</Td>
                  <Td>{jobs.title}</Td>
                  <Td>{jobs.storeName}</Td>
                  <Td>{jobs.bossName}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Center>
  );
}
