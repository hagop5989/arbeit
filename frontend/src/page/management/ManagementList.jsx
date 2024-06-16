import {
  Box,
  Button,
  Center,
  Checkbox,
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
import { LoginContext } from "../../component/LoginProvider.jsx";

export function ManagementList() {
  const account = useContext(LoginContext);
  const [managementList, setManagementList] = useState([]);
  const [management, setManagement] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  // Read (jobs 리스트 받기)
  useEffect(() => {
    if (account.id) {
      axios.get("/api/jobs/management/list").then((res) => {
        setManagementList(res.data);
      });
    }
  }, [account.id]);

  // 합격 로직
  function handlePassOrNot(e, management) {
    setManagement(management);
    const decision = e.target.innerText;
    let isPassed;

    if (decision === "합격") {
      isPassed = 1;
    } else if (decision === "불합격") {
      isPassed = 0;
    } else {
      isPassed = null;
    }

    const updatedManagement = {
      ...management,
      jobsId: management.jobsId,
      appliedMemberId: management.memberId,
      resumeId: management.resumeId,
      isPassed: isPassed,
    };

    setManagement(updatedManagement);
    handleSubmit(updatedManagement);
  }

  // 합격 데이터 제출
  function handleSubmit(updatedManagement) {
    console.log(updatedManagement);
    axios
      .put(`/api/jobs/0/management/passOrNot`, { ...updatedManagement })
      .then(myToast("처리 되었습니다.", "success"))
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
    <Center>
      <Box>
        <Box>
          <Heading>지원내역(사장)</Heading>
        </Box>

        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>선택</Th>
                <Th>작성일</Th>
                <Th>진행공고명</Th>
                <Th>지원서 제목</Th>
                <Th>진행상황</Th>
                <Th>관리</Th>
              </Tr>
            </Thead>
            <Tbody>
              {managementList.map((management) => (
                <Tr key={management.id}>
                  <Td>
                    <Checkbox
                      value={management.id}
                      // onChange={handleCheckBoxChange}
                    />
                  </Td>
                  <Td>{management.applicationInserted}</Td>
                  <Td onClick={() => navigate(`/jobs/${management.jobsId}`)}>
                    {management.jobsTitle}
                  </Td>
                  <Td
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
                  <Td>진행중</Td>
                  <Td>
                    <Flex>
                      <Button onClick={(e) => handlePassOrNot(e, management)}>
                        합격
                      </Button>
                      <Button onClick={(e) => handlePassOrNot(e, management)}>
                        불합격
                      </Button>
                    </Flex>
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
