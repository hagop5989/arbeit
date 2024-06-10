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
  InputGroup,
  InputRightElement,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { KakaoMap1 } from "./KakaoMap1.jsx";

export function JobsView2() {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [editJobs, setEditJobs] = useState({
    title: "",
    content: "",
    salary: "",
    deadline: "",
    recruitmentNumber: "",
    storeName: "default",
    categoryId: "1",
    storeId: "8",

    memberId: account.id,
    name: account.name,

    startTime: "",
    endTime: "",
    x: "",
    y: "",
    resultName: "",
  });

  /* log 찍는 용도 */
  // useEffect(() => {
  //   // console.log("Jobs state updated:", editJobs);
  // }, [editJobs]);

  function handleEditInput(field, e) {
    setEditJobs((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmitEditJobs() {
    axios
      .put("/api/jobs/update", editJobs)
      .then((res) => {
        myToast("수정 완료 되었습니다", "success");
      })
      .catch(() => {
        myToast("수정실패", "error");
      })
      .finally(() => {});
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
  }, [id, navigate]); // 여기에 의존성 배열을 추가합니다

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
      <Heading>알바공고 상세페이지</Heading>
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
            <FormLabel>시급</FormLabel>
            <InputGroup>
              <InputRightElement w={"15%"}>(원)</InputRightElement>
              <Input
                value={editJobs.salary}
                onChange={(e) => handleEditInput("salary", e)}
                type={"number"}
                placeholder={"시급을 입력해주세요"}
              />
            </InputGroup>

            <Flex justifyContent={"space-between"} my={3}>
              <Box w={"50%"} borderRadius={"5px"}>
                <FormLabel>근무시작</FormLabel>
                <Input
                  type="time"
                  value={editJobs.startTime}
                  onChange={(e) => handleEditInput("startTime", e)}
                />
              </Box>
              <Box w={"50%"} borderRadius={"5px"} ml={1}>
                <FormLabel>근무종료</FormLabel>
                <Input
                  type="time"
                  value={editJobs.endTime}
                  onChange={(e) => handleEditInput("endTime", e)}
                />
              </Box>
            </Flex>
            <FormHelperText my={2}>
              시계 모양을 클릭하여 선택해주세요
            </FormHelperText>

            <FormLabel>마감일</FormLabel>
            <Input
              value={editJobs.deadline}
              onChange={(e) => handleEditInput("deadline", e)}
              type={"datetime-local"}
              placeholder={"마감일을 입력해주세요"}
            />

            <Flex gap={3}>
              <Box w={"50%"}>
                <FormLabel>모집인원</FormLabel>
                <InputGroup>
                  <InputRightElement w={"15%"}>(명)</InputRightElement>
                  <Input
                    value={editJobs.recruitmentNumber}
                    onChange={(e) => handleEditInput("recruitmentNumber", e)}
                    type={"number"}
                    placeholder={"모집인원"}
                  />
                </InputGroup>
              </Box>
              <Box w={"50%"}>
                <FormLabel>카테고리 선택</FormLabel>
                <Select onChange={(e) => handleEditInput("categoryId", e)}>
                  <option>1</option>
                  <option>2</option>
                </Select>
              </Box>
            </Flex>

            <FormLabel>가게명</FormLabel>
            <Input
              value={editJobs.storeName}
              onChange={(e) => handleEditInput("storeName", e)}
              type={"text"}
              readOnly
            />
            <FormLabel>작성자</FormLabel>
            <Input
              value={editJobs.name}
              onChange={(e) => handleEditInput("name", e)}
              type={"text"}
              readOnly
            />
            <FormLabel>가게위치</FormLabel>

            <KakaoMap1
              x={editJobs.y}
              y={editJobs.x}
              markerName={editJobs.markerName}
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
