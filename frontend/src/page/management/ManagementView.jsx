import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";

const styles = {
  text: {
    fontSize: "16px",
    fontWeight: "600",
    mr: "20px",
  },
};

export function ManagementView() {
  const { id } = useParams();
  const location = useLocation();
  const { resumeId } = location.state || {};
  const account = useContext(LoginContext);
  const [management, setManagement] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  // toast 커스텀
  function myToast(text, status) {
    toast({
      description: <Box whiteSpace="pre-line">{text}</Box>,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  // Read (리스트 받기)
  useEffect(() => {
    axios
      .get("/api/only-boss") // TODO : 공고를 등록한 사장만 들어갈 수 있게 만들어야함.
      .then(() => {
        if (account.id) {
          axios
            .get(`/api/jobs/${id}/management/application-view`, {
              params: { resumeId },
            })
            .then((res) => {
              setManagement(res.data);
            });
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
  }, [account.id]);

  // 합격 로직
  function handleDecision(e) {
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
    axios
      .put(`/api/jobs/${id}/management/decision`, { ...updatedManagement })
      .then(() => myToast("처리 되었습니다.", "success"))
      .catch()
      .finally();
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

  return (
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Box>지원한 공고 : {management.title}</Box>
      <Box
        h={"70px"}
        mb={"30px"}
        bg={"#FF7F3E"}
        color={"white"}
        borderRadius={"10px"}
      >
        <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
          하정현ㅇ님 지원서
          {/*  TODO : 이름 필요 */}
        </Heading>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>합격여부</FormLabel>
          <Box
            fontSize={"xl"}
            fontWeight={"bold"}
            textIndent={"10px"}
            color={
              management.isPassed != null && management.isPassed
                ? "teal"
                : "red"
            }
          >
            {isPassedToString(management.isPassed)}
          </Box>
          <Center
            border={"2px solid #E0E0E0"}
            h={"100px"}
            borderRadius={"10px"}
            mb={"20px"}
          >
            <Box>
              {/*  TODO : 알바생의 정보 필요 */}
              <Box {...styles.text} mb={"5px"}>
                이름: 하정현ㅇ
              </Box>
              <Flex>
                <Box {...styles.text}>연락처: 010-7178-2025ㅇ</Box>
                <Box {...styles.text}>이메일: aszx2024@naver.comㅇ</Box>
              </Flex>
            </Box>
            <Button
              colorScheme={"yellow"}
              ml={"20px"}
              onClick={() => navigate(`/resume/${application.resumeId}`)}
            >
              이력서 확인하기
            </Button>
          </Center>
          <Box
            h={"300px"}
            border={"2px solid #E0E0E0"}
            borderRadius={"10px"}
            p={"20px"}
            fontSize={"17px"}
          >
            <Box
              {...styles.text}
              mb={"10px"}
              borderBottom={"1px solid #E0E0E0"}
            >
              지원메세지
            </Box>
            {management.comment}
          </Box>
          <Flex gap={"10px"} my={8}>
            <Button
              w={"33%"}
              bgColor={"gray.500"}
              color={"white"}
              onClick={() => {
                navigate("/jobs/management/list");
              }}
            >
              목록
            </Button>
            <Button
              w={"33%"}
              bgColor={"blue.500"}
              color={"white"}
              onClick={(e) => handleDecision(e)}
            >
              합격
            </Button>
            <Button
              w={"33%"}
              bgColor={"red.500"}
              color={"white"}
              onClick={(e) => handleDecision(e)}
            >
              불합격
            </Button>
          </Flex>
        </FormControl>
      </Box>
    </Box>
  );
}
