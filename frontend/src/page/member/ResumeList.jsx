import {
  Box,
  Button,
  Center,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function ResumeList() {
  const account = useContext(LoginContext);
  const [resumeList, setResumeList] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // T 문자를 제거하고 날짜만 반환하는 함수
  const formatInsertedDate = (inserted) => {
    if (!inserted) return "";
    return inserted.replace("T", " ");
  };

  useEffect(() => {
    const params = {
      memberId: account.id,
    };

    axios.get("/api/member/resume/list", { params }).then((res) => {
      setResumeList(res.data);
    });
  }, [searchParams]);

  const handleButtonClick = (event, path) => {
    event.stopPropagation();
    navigate(path);
  };

  return (
    <Center>
      <Box>
        <Box>
          <Heading>이력서 목록</Heading>
        </Box>
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>제목</Th>
                <Th>생성일</Th>
                <Th>공개종료일</Th>
              </Tr>
            </Thead>
            <Tbody>
              {resumeList.map((resume) => (
                <Tr
                  key={resume.id}
                  cursor={"pointer"}
                  _hover={{ bgColor: "gray.200" }}
                  onClick={() => navigate(`/member/resume/${resume.id}`)}
                >
                  <Td>{resume.id}</Td>
                  <Td>{resume.title}</Td>
                  <Td>{resume.inserted}</Td>
                  <Td>{resume.deadline}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Button
          onClick={() => navigate("/member/resume/write")}
          colorScheme={"green"}
          w={120}
          my={3}
        >
          이력서 생성
        </Button>
      </Box>
    </Center>
  );
}
