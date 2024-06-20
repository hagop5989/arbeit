import {
  Box,
  Button,
  Checkbox,
  Divider,
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
  const [refresh, setRefresh] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (account.id !== "") {
      axios.get(`/api/${account.id}/resume/list`).then((res) => {
        setResumeList(res.data);
      });
    }
  }, [account.id, refresh]);

  const handleCheckBoxChange = (e) => {
    const value = e.target.value;

    if (e.target.checked) {
      setCheck([...check, value]);
    } else {
      setCheck(check.filter((item) => item !== value));
    }
  };

  function handleRemoveBtn() {
    axios.post("/api/resume/delete", check).then(() => {
      setRefresh(check);
      setCheck([]);
    });
  }

  return (
    <Box w={"100%"} h={"55vh"}>
      <Box>
        <Heading mb={"10px"} p={1}>
          이력서 목록
        </Heading>
        <Divider mb={"40px"} borderWidth={"2px"} />
        <Button
          onClick={() => navigate("/resume/register")}
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
                <Th fontSize={"medium"}>선택</Th>
                <Th fontSize={"medium"}>제목</Th>
                <Th fontSize={"medium"}>작성일</Th>
                <Th fontSize={"medium"}>관리</Th>
              </Tr>
            </Thead>
            <Tbody>
              {resumeList.map((resume) => (
                <Tr key={resume.id}>
                  <Td>
                    <Checkbox
                      value={resume.id}
                      onChange={handleCheckBoxChange}
                    />
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
          <Button colorScheme={"red"} onClick={handleRemoveBtn}>
            삭제
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
