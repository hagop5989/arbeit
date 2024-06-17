import {
  Box,
  Button,
  Center,
  Divider,
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
import { LoginContext } from "../../component/LoginProvider.jsx";

export function ManagementView() {
  const { id } = useParams();
  const location = useLocation();
  const { jobsId } = location.state;
  const account = useContext(LoginContext);
  const [management, setManagement] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  // Read (리스트 받기)
  useEffect(() => {
    if (account.id) {
      axios
        .get(`/api/jobs/${id}/management/select`, {
          params: { jobsId: jobsId },
        })
        .then((res) => {
          setManagement(res.data);
        });
    }
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
    console.log(updatedManagement);
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
    <Box>
      <Heading>지원서 보기(사장)</Heading>
      <Center w={"50%"} ml={"25%"}>
        <FormControl>
          <FormLabel>공고글 제목</FormLabel>
          <Input
            defaultValue={management.jobsTitle}
            value={management.jobsTitle}
            readOnly
          />
          <FormLabel>합격여부</FormLabel>
          <Box bgColor={"gray.100"}>
            {isPassedToString(management.isPassed)}
          </Box>
          <Divider my={2} />
          <FormLabel>이력서 첨부</FormLabel>
          <Input value={management.title || ""} readOnly />
          <Divider my={2} />
          <FormLabel>지원메세지</FormLabel>
          <Textarea h={"300px"} value={management.comment || ""} readOnly />
          <Button
            onClick={() => {
              navigate("/jobs/management/list");
            }}
          >
            목록
          </Button>
          <Button onClick={(e) => handleDecision(e)}>합격</Button>
          <Button onClick={(e) => handleDecision(e)}>불합격</Button>
        </FormControl>
      </Center>
    </Box>
  );
}
