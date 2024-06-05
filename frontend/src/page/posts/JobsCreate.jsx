import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function JobsCreate() {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState({
    title: "",
    content: "",
    storeName: "default",
    memberId: account.id,
    name: account.name,
  });
  const allFieldsFilled = Object.values(jobs).every(
    (value) => value.length > 0,
  );

  function handleCreateInput(field, e) {
    setJobs((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmitCreateJobs() {
    if (allFieldsFilled) {
      axios
        .post("/api/jobs/insert", jobs)
        .then((res) => {
          myToast("공고생성 되었습니다", "success");
          navigate("/jobs/list");
        })
        .catch((e) => {
          myToast("입력 값을 확인해주세요.", "error");
          console.log(e);
        })
        .finally(() => {});
    } else {
      myToast("입력값 중 빈칸이 존재합니다.", "error");
    }
  }

  const toast = useToast();
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
      <Heading>알바공고 생성</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>제목</FormLabel>

            <Input
              value={jobs.title}
              onChange={(e) => handleCreateInput("title", e)}
              type={"text"}
              placeholder={"제목을 입력해주세요"}
            />

            <FormLabel>내용</FormLabel>
            <Textarea
              value={jobs.content}
              onChange={(e) => handleCreateInput("content", e)}
              type={"text"}
              placeholder={"내용을 입력해주세요"}
            />
            <FormLabel>가게명</FormLabel>
            <Input
              value={jobs.storeName}
              onChange={(e) => handleCreateInput("storeName", e)}
              type={"text"}
              readOnly
            />
            <FormLabel>작성자</FormLabel>
            <Input
              value={jobs.name}
              onChange={(e) => handleCreateInput("name", e)}
              type={"text"}
              readOnly
            />

            <Flex justifyContent="center">
              <Button
                isDisabled={!allFieldsFilled}
                onClick={handleSubmitCreateJobs}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                공고생성
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}
