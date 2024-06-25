import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function ManagementView() {
  const { id } = useParams();
  const location = useLocation();
  const { jobsId } = location.state || {};
  const account = useContext(LoginContext);
  const [management, setManagement] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  // Read (리스트 받기)
  useEffect(() => {
    axios
      .get("/api/only-login")
      .then(() => {
        if (account.id) {
          axios
            .get(`/api/jobs/${id}/management/select`, {
              params: { jobsId: jobsId },
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
      });
  }, [account.id, id, management.resumeId]);

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
      .then(myToast("처리 되었습니다.", "success"))
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
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Heading mb={"10px"} p={1}>
        지원서 보기(사장)
      </Heading>
      <Divider mb={"40px"} borderWidth={"2px"} />
      <Box>
        <FormControl>
          <FormLabel>공고글 제목</FormLabel>
          <Input value={management.jobsTitle || ""} readOnly />
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
          <Divider my={2} />
          <FormLabel>이력서 첨부</FormLabel>
          <Input value={management.title || ""} readOnly />
          <Divider my={2} />
          <FormLabel>지원메세지</FormLabel>
          <Textarea h={"300px"} value={management.comment || ""} readOnly />
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
