import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
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

export function ManagementList() {
  const account = useContext(LoginContext);
  const [managementList, setManagementList] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const [checkChange, setCheckChange] = useState(false);

  // Read (jobs 리스트 받기)

  useEffect(() => {
    if (account.id) {
      axios.get("/api/jobs/management/list").then((res) => {
        setManagementList(res.data);
      });
    }
  }, [account.id, checkChange]);

  // 합격 로직

  function handleDecision(e, management) {
    let isPassed;
    const decision = e.target.innerText;

    if (decision === "합격") {
      isPassed = 1;
    } else if (decision === "불합격") {
      isPassed = 0;
    } else {
      isPassed = null;
    }

    const updatedManagement = {
      ...management,
      isPassed: isPassed,
    };
    handleSubmit(updatedManagement);
  }

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

  function handleSubmit(updatedManagement) {
    axios
      .put(`/api/jobs/0/management/decision`, { ...updatedManagement })
      .then(() => {
        myToast("처리 되었습니다.", "success");
        setManagementList((prevList) =>
          prevList.map((item) =>
            item.id === updatedManagement.id ? updatedManagement : item,
          ),
        );
        setCheckChange(!checkChange);
      })
      .catch()
      .finally();
  }

  // toast 커스텀
  function myToast(text, status) {
    toast({
      description: <Box whiteSpace="pre-line">{text}</Box>,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  return (
    <Box w={"100%"} h={"55vh"}>
      {account.isAlba() && (
        <Heading m={"auto"} color={"white"} bgColor={"orange"} p={5}>
          사장만 접근 가능한 페이지 입니다.
        </Heading>
      )}
      {account.isBoss() && (
        <Box>
          <Box>
            <Heading mb={"10px"} p={1}>
              지원내역(사장)
            </Heading>
            <Divider mb={"40px"} borderWidth={"2px"} />
          </Box>
          <Box>
            <Table>
              <Thead>
                <Tr>
                  <Th fontSize={"medium"}>선택</Th>
                  <Th fontSize={"medium"}>지원일</Th>
                  <Th fontSize={"medium"}>진행공고명</Th>
                  <Th fontSize={"medium"}>지원서 제목</Th>
                  <Th fontSize={"medium"}>상태</Th>
                  <Th fontSize={"medium"}>관리</Th>
                </Tr>
              </Thead>
              <Tbody>
                {managementList.map((management) => (
                  <Tr
                    key={management.id}
                    fontSize={"15px"}
                    _hover={{ bgColor: "orange.50" }}
                  >
                    <Td minW={"80px"}>
                      {/* 체크박스 */}
                      <Checkbox
                        value={management.id}
                        // onChange={handleCheckBoxChange}
                      />
                    </Td>
                    {/* 지원일 */}
                    <Td fontSize={"sm"} minW={"130px"}>
                      {management.applicationInserted}
                    </Td>
                    {/* 공고 제목 */}
                    <Td
                      whiteSpace="nowrap" // 줄 바꿈을 막음
                      overflow="hidden" // 넘친 내용을 숨김
                      textOverflow="ellipsis" // 넘친 내용을 "..."으로 표시
                      cursor={"pointer"}
                      onClick={() => navigate(`/jobs/${management.jobsId}`)}
                    >
                      {management.jobsTitle}
                    </Td>
                    {/* 지원 제목 */}
                    <Td
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      cursor={"pointer"}
                      onClick={() =>
                        navigate(
                          `/jobs/${management.resumeId}/management/select`,
                          { state: { jobsId: management.jobsId } },
                        )
                      }
                    >
                      {management.applicationTitle}
                    </Td>
                    {/* 합격 여부 */}
                    <Td
                      minW={"90px"}
                      fontWeight={"bold"}
                      color={
                        management.isPassed != null && management.isPassed
                          ? "teal"
                          : "red"
                      }
                    >
                      {isPassedToString(management.isPassed)}
                    </Td>

                    {/* 합격 결정 버튼 */}
                    <Td>
                      <Flex gap={"5px"}>
                        <Button
                          onClick={(e) => handleDecision(e, management)}
                          fontWeight={"500"}
                          bgColor={"#FF7F3E"}
                          color={"white"}
                        >
                          합격
                        </Button>
                        <Button
                          onClick={(e) => handleDecision(e, management)}
                          fontWeight={"500"}
                          bgColor={"red.500"}
                          color={"white"}
                        >
                          불합격
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}
    </Box>
  );
}
