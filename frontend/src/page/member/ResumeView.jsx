import React, { useContext, useEffect, useState } from "react";
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
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ResumeView(props) {
  const { id } = useParams();
  const account = useContext(LoginContext);
  // const [resumeList, setResumeList] = useState([]);
  const navigate = useNavigate();
  const [editResume, setEditResume] = useState({
    title: "default",
    content: "default",
    memberId: account.id,
  });
  const allFieldsFilled =
    editResume.title.length > 0 &&
    editResume.content.length > 0 &&
    useEffect(() => {
      axios
        .get(`/api/member/resume/${id}`)
        .then((res) => {
          setEditResume(res.data);
        })
        .catch((err) => {
          if (err.response.status === 404) {
            toast({
              status: "info",
              description: "해당 게시물이 존재하지 않습니다.",
              position: "top",
            });
            navigate("/api/member/resume/list");
          }
        });
    }, []);

  function handleEditInput(field, e) {
    setEditResume((prevJobs) => ({ ...prevJobs, [field]: e.target.value }));
  }

  function handleSubmitEditJobs() {
    if (allFieldsFilled) {
      axios
        .put("/api/member/resume/update", editResume)
        .then((res) => {
          myToast("수정 완료 되었습니다", "success");
        })
        .catch(() => {
          myToast("수정실패", "error");
        })
        .finally(() => {});
    } else {
      console.log(allFieldsFilled);
      console.log(editResume);
      myToast("입력값 중 빈칸이 존재합니다.", "error");
    }
  }

  function handleSubmitDeleteJobs() {
    axios
      .delete(`/api/member/resume/delete?id=${id}`)
      .then((res) => {
        myToast("삭제 완료 되었습니다", "success");
        navigate("/member/resume/list");
      })
      .catch(() => {
        myToast("삭제실패", "error");
      })
      .finally(() => {});
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
      <Heading>이력서 상세페이지 </Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>제목</FormLabel>

            <Input
              value={editResume.title}
              onChange={(e) => handleEditInput("title", e)}
              type={"text"}
              placeholder={"제목을 입력해주세요"}
            />

            <FormLabel>내용</FormLabel>
            <Textarea
              value={editResume.content}
              onChange={(e) => handleEditInput("content", e)}
              type={"text"}
              placeholder={"내용을 입력해주세요"}
            />

            <Flex justifyContent="center">
              <Button
                // isDisabled={!allFieldsFilled}
                // onClick={handleSubmitEditJobs}
                colorScheme={"teal"}
                w={120}
                my={3}
              >
                지원
              </Button>
              <Button
                isDisabled={!allFieldsFilled}
                onClick={handleSubmitEditJobs}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                수정
              </Button>
              <Button
                onClick={handleSubmitDeleteJobs}
                colorScheme={"red"}
                w={120}
                my={3}
              >
                삭제
              </Button>
              <Button
                onClick={() => navigate("/member/resume/list")}
                colorScheme={"green"}
                w={120}
                my={3}
              >
                이전
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}

export default ResumeView;
