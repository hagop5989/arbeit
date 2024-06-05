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

function JobsDetail(props) {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [editJobs, setEditJobs] = useState({
    title: "default",
    content: "default",
    storeName: "default",
    memberId: account.id,
    memberName: "",
  });
  const allFieldsFilled =
    editJobs.title.length > 0 &&
    editJobs.content.length > 0 &&
    editJobs.storeName.length;

  function handleEditInput(field, e) {
    setEditJobs((prevJobs) => ({ ...prevJobs, [field]: e.target.value }));
  }

  function handleSubmitEditJobs() {
    if (allFieldsFilled) {
      axios
        .put("/api/jobs/update", editJobs)
        .then((res) => {
          myToast("수정 완료 되었습니다", "success");
        })
        .catch(() => {
          myToast("수정실패", "error");
        })
        .finally(() => {});
    } else {
      console.log(allFieldsFilled);
      console.log(editJobs);
      myToast("입력값 중 빈칸이 존재합니다.", "error");
    }
  }

  function handleSubmitDeleteJobs() {
    axios
      .delete(`/api/jobs/delete?id=${id}`)
      .then((res) => {
        myToast("삭제 완료 되었습니다", "success");
        navigate("/jobs/list");
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

  useEffect(() => {
    axios
      .get(`/api/jobs/${id}`)
      .then((res) => {
        setEditJobs(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "해당 게시물이 존재하지 않습니다.",
            position: "top",
          });
          navigate("/api/jobs/list");
        }
      });
  }, []);

  return (
    <Box>
      <Heading>알바공고 상세페이지 </Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>제목</FormLabel>

            <Input
              value={editJobs.title}
              onChange={(e) => handleEditInput("title", e)}
              type={"text"}
              placeholder={"제목을 입력해주세요"}
            />

            <FormLabel>내용</FormLabel>
            <Textarea
              value={editJobs.content}
              onChange={(e) => handleEditInput("content", e)}
              type={"text"}
              placeholder={"내용을 입력해주세요"}
            />
            <FormLabel>가게명</FormLabel>
            <Input
              value={editJobs.storeName}
              onChange={(e) => handleEditInput("storeName", e)}
              type={"text"}
              readOnly
            />
            <FormLabel>작성자</FormLabel>
            <Input value={account.name} type={"text"} readOnly />

            <Flex justifyContent="center">
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
                onClick={() => navigate("/jobs/list")}
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

export default JobsDetail;
