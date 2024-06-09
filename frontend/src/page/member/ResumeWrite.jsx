import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
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

export function ResumeWrite() {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [resume, setResume] = useState({
    memberId: account.id,
    title: "",
    content: "",
  });

  const allFieldsFilled = resume.title.length > 0 && resume.content.length > 0;

  function handleCreateInput(field, e) {
    setResume((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmitCreateResume() {
    if (allFieldsFilled) {
      const formData = new FormData();
      formData.append("memberId", account.id);
      formData.append("title", resume.title);
      formData.append("content", resume.content);

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      axios
        .postForm("/api/member/resume/insert", formData)
        .then((res) => {
          myToast("이력서 생성 되었습니다", "success");
          navigate("/member/resume/list");
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
      <Heading>이력서 생성</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>제목</FormLabel>

            <Input
              value={resume.title}
              onChange={(e) => handleCreateInput("title", e)}
              type={"text"}
              placeholder={"제목을 입력해주세요"}
            />

            <FormLabel>내용</FormLabel>
            <Textarea
              value={resume.content}
              onChange={(e) => handleCreateInput("content", e)}
              type={"text"}
              placeholder={"내용을 입력해주세요"}
            />
            <FormControl>
              <FormLabel>파일</FormLabel>
              <Input
                multiple
                type="file"
                accept="image/*"
                onChange={(e) => setFiles(e.target.files)}
              />
              <FormHelperText>
                총 용량은 10MB, 한 파일은 1MB를 초과할 수 없습니다.
              </FormHelperText>
            </FormControl>

            <Flex justifyContent="center">
              <Button
                isDisabled={!allFieldsFilled}
                onClick={handleSubmitCreateResume}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                이력서 생성
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}
