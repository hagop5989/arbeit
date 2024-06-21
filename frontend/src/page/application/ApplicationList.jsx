import {
  Box,
  Button,
  Divider,
  Heading,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function ApplicationList() {
  const account = useContext(LoginContext);
  const [applicationList, setApplicationList] = useState([]);
  const [isCancel, setIsCancel] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Read (jobs 리스트 받기)
  useEffect(() => {
    if (account.id) {
      axios
        .get(`/api/apply/list`)
        .then((res) => {
          setApplicationList(res.data);
        })
        .catch((err) => {
          if (err.responsse.status === 403) {
            toast({
              status: "warning",
              description: "접근 권한이 없습니다.",
              position: "top",
            });
          }
        });
    }
  }, [account.id, isCancel]);

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

  function handleCancelBtn(jobsId) {
    const confirm = window.confirm("정말 취소하시겠습니까?");
    if (confirm) {
      console.log(jobsId);
      axios
        .delete(`/api/apply/${jobsId}`)
        .then(() => {
          alert("취소되었습니다.");
          setIsCancel(!isCancel);
        })
        .catch(() => alert("내부 오류 발생"));
    }
  }

  return (
    <Box w={"100%"} h={"55vh"}>
      <Box>
        <Heading mb={"10px"} p={1}>
          지원 내역
        </Heading>
        <Divider mb={"40px"} borderWidth={"2px"} />
        <Box>
          <Table>
            <Thead>
              <Tr borderTop={"1px solid gray"}>
                <Th borderBottom={"1px solid gray"} fontSize={"medium"}>
                  작성일
                </Th>
                <Th borderBottom={"1px solid gray"} fontSize={"medium"}>
                  지원 공고
                </Th>
                <Th borderBottom={"1px solid gray"} fontSize={"medium"}>
                  지원서 제목
                </Th>
                <Th borderBottom={"1px solid gray"} fontSize={"medium"}>
                  처리 상태
                </Th>
                <Th borderBottom={"1px solid gray"} fontSize={"medium"}>
                  지원 취소
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {applicationList.map((application, index) => (
                <Tr key={index}>
                  <Td>{application.inserted}</Td>
                  <Td fontWeight={"700"}>
                    <Link href={`jobs/${application.jobsId}`}>
                      {application.jobsTitle}
                    </Link>
                  </Td>
                  <Td fontWeight={"700"}>
                    <Link href={`/jobs/${application.jobsId}/apply/select`}>
                      {application.title}
                    </Link>
                  </Td>
                  <Td>{isPassedToString(application.isPassed)}</Td>
                  <Td>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      _hover={{ bg: "#E74133", color: "white" }}
                      size={"sm"}
                      onClick={() => handleCancelBtn(application.jobsId)}
                    >
                      취소
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Button
          onClick={() => navigate("/resume/register")}
          colorScheme={"green"}
          w={120}
          mt={3}
          mb={7}
        >
          이력서 등록
        </Button>
      </Box>
    </Box>
  );
}
