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
    <Box w={"100%"} h={"55vh"}>
      {account.isBoss() && (
        <Heading m={"auto"} color={"white"} bgColor={"orange"} p={5}>
          알바만 접근 가능한 페이지 입니다.
        </Heading>
      )}
      {account.isAlba() && (
        <Box>
          <Box>
            <Heading mb={"10px"} p={1}>
              지원내역(알바)
            </Heading>
            <Divider mb={"40px"} borderWidth={"2px"} />
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
                  <Th fontSize={"medium"}>선택</Th>
                  <Th fontSize={"medium"}>지원일</Th>
                  <Th fontSize={"medium"}>지원공고명</Th>
                  <Th fontSize={"medium"}>지원서 제목</Th>
                  <Th fontSize={"medium"}>상태</Th>
                  <Th fontSize={"medium"}>관리</Th>
                </Tr>
              </Thead>
              <Tbody>
                {applicationList.map((application) => (
                  <Tr
                    key={application.id}
                    cursor={"pointer"}
                    _hover={{ bgColor: "orange.50" }}
                  >
                    <Td minW={"80px"}>
                      <Checkbox
                        value={application.id}
                        // onChange={handleCheckBoxChange}
                      />
                    </Td>
                    <Td fontSize={"sm"} minW={"130px"}>
                      {application.inserted}
                    </Td>
                    <Td
                      onClick={() => navigate(`/jobs/${application.jobsId}`)}
                      whiteSpace="nowrap" // 줄 바꿈을 막음
                      overflow="hidden" // 넘친 내용을 숨김
                      textOverflow="ellipsis" // 넘친 내용을 "..."으로 표시
                    >
                      {application.jobsTitle}
                    </Td>
                    <Td
                      cursor={"pointer"}
                      onClick={() =>
                        navigate(`/jobs/${application.jobsId}/apply/select`)
                      }
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {application.title}
                    </Td>
                    {/* 합격 여부 */}
                    <Td
                      minW={"90px"}
                      fontWeight={"bold"}
                      color={
                        application.isPassed != null && application.isPassed
                          ? "teal"
                          : "red"
                      }
                    >
                      {isPassedToString(application.isPassed)}
                    </Td>
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
      )}
    </Box>
  );
}
