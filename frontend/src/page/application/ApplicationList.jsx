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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function ApplicationList() {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const [applicationList, setApplicationList] = useState([]);
  const navigate = useNavigate();

  // Read (jobs 리스트 받기)
  useEffect(() => {
    if (account.id) {
      axios.get(`/api/jobs/apply/list`).then((res) => {
        setApplicationList(res.data);
      });
    }
  }, [account.id, id]);

  // 합격 여부 문자열 변환 함수
  const isPassedToString = (decision) => {
    switch (decision) {
      case 1:
        return "합격";
      case 0:
        return "불합격";
      default:
        return "미정";
    }
  };

  return (
    <Center>
      <Box>
        <Box>
          <Heading>지원내역(알바)</Heading>
        </Box>
        <Button
          onClick={() => navigate("/resume/register")}
          colorScheme={"green"}
          w={120}
          my={3}
        >
          이력서 등록
        </Button>
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>선택</Th>
                <Th>작성일</Th>
                <Th>지원공고명</Th>
                <Th>제목</Th>
                <Th>진행상황</Th>
                <Th>관리</Th>
              </Tr>
            </Thead>
            <Tbody>
              {applicationList.map((application) => (
                <Tr key={application.id}>
                  <Td>
                    <Checkbox
                      value={application.id}
                      // onChange={handleCheckBoxChange}
                    />
                  </Td>
                  <Td>{application.inserted}</Td>
                  <Td onClick={() => navigate(`/jobs/${application.jobsId}`)}>
                    {application.jobsTitle}
                  </Td>
                  <Td
                    cursor={"pointer"}
                    onClick={() =>
                      navigate(`/jobs/${application.jobsId}/apply/select`)
                    }
                  >
                    {application.title}
                  </Td>
                  <Td>{isPassedToString(application.isPassed)}</Td>
                  <Td>
                    <Button
                      onClick={() =>
                        navigate(`/jobs/${application.jobsId}/apply/edit`)
                      }
                    >
                      수정
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button
            colorScheme={"red"}
            // onClick={handleRemoveBtn}
          >
            삭제
          </Button>
        </Box>
      </Box>
    </Center>
  );
}
