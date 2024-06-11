import {
  Box,
  Button,
  Center,
  Checkbox,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function ResumeList() {
  const account = useContext(LoginContext);
  const [resumeList, setResumeList] = useState([]);
  const [check, setCheck] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (account.id !== "") {
      axios.get(`/api/${account.id}/resume/list`).then((res) => {
        setResumeList(res.data);
      });
    }
  }, [account]);

  function handleCheckChange(resumeId) {
    setCheck({ ...check, resumeId });
    console.log(check);
  }

  return (
    <Center>
      <Box>
        <Box>
          <Heading>이력서 목록</Heading>
        </Box>
        <Button
          onClick={() => navigate("/resume/write")}
          colorScheme={"green"}
          w={120}
          my={3}
        >
          이력서 생성
        </Button>
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>선택</Th>
                <Th>제목</Th>
                <Th>작성일</Th>
                <Th>관리</Th>
              </Tr>
            </Thead>
            <Tbody>
              {resumeList.map((resume) => (
                <Tr key={resume.id}>
                  <Td>
                    <Checkbox onChange={() => handleCheckChange(resume.id)} />
                  </Td>
                  <Td
                    cursor={"pointer"}
                    onClick={() => navigate(`/resume/${resume.id}`)}
                  >
                    {resume.title}
                  </Td>
                  <Td>{resume.inserted}</Td>
                  <Td>
                    <Button
                      onClick={() => navigate(`/resume/${resume.id}/edit`)}
                    >
                      수정
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button colorScheme={"red"}>삭제</Button>
        </Box>
      </Box>
    </Center>
  );
}
