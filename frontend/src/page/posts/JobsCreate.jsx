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
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import KakaoMap2 from "./KakaoMap2.jsx";

export function JobsCreate() {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [jobs, setJobs] = useState({
    title: "",
    content: "",
    salary: "",
    deadline: "",
    recruitmentNumber: "",
    storeName: "default",
    storeNames: [],
    categoryNames: [],
    categoryName: "",
    storeId: "8",

    memberId: account.id,
    name: account.name,

    startTime: "",
    endTime: "",
    x: "",
    y: "",
    markerName: "",
    // fileList: [],
  });

  // file 목록 작성
  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(<li>{files[i].name}</li>);
  }

  const handleMapSubmit = (x, y, markerName) => {
    setJobs((prev) => ({
      ...prev,
      x: x,
      y: y,
      markerName: markerName,
    }));
  };

  // useEffect(() => {}, [jobs]);
  useEffect(() => {
    axios
      .get("/api/jobs/insert", { params: { memberId: account.id } })
      .then((res) => {
        setJobs((prev) => ({
          ...prev,
          storeNames: res.data.storeNames,
          categoryNames: res.data.categoryNames,
          name: account.name,
          memberId: account.id,
        }));
      })
      .catch()
      .finally(console.log(jobs));
  }, [account]);

  function handleCreateInput(field, e) {
    setJobs((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmitCreateJobs() {
    axios
      .postForm("/api/jobs/insert", { ...jobs, files })
      .then((res) => {
        myToast("공고생성 되었습니다", "success");
        navigate("/jobs/list");
      })
      .catch((e) => {
        myToast("입력 값을 확인해주세요.", "error");
        console.log(e);
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
            <FormLabel>시급</FormLabel>
            <InputGroup>
              <InputRightElement w={"15%"}>(원)</InputRightElement>
              <Input
                value={jobs.salary}
                onChange={(e) => handleCreateInput("salary", e)}
                type={"number"}
                placeholder={"시급을 입력해주세요"}
              />
            </InputGroup>

            <Flex justifyContent={"space-between"} my={3}>
              <Box w={"50%"} borderRadius={"5px"}>
                <FormLabel>근무시작</FormLabel>
                <Input
                  type="time"
                  value={jobs.startTime}
                  onChange={(e) => handleCreateInput("startTime", e)}
                />
              </Box>
              <Box w={"50%"} borderRadius={"5px"} ml={1}>
                <FormLabel>근무종료</FormLabel>
                <Input
                  type="time"
                  value={jobs.endTime}
                  onChange={(e) => handleCreateInput("endTime", e)}
                />
              </Box>
            </Flex>
            <FormHelperText my={2}>
              시계 모양을 클릭하여 선택해주세요
            </FormHelperText>

            <FormLabel>마감일</FormLabel>
            <Input
              value={jobs.deadline}
              onChange={(e) => handleCreateInput("deadline", e)}
              type={"datetime-local"}
              placeholder={"마감일을 입력해주세요"}
            />

            <Flex gap={3}>
              <Box w={"50%"}>
                <FormLabel>모집인원</FormLabel>
                <InputGroup>
                  <InputRightElement w={"15%"}>(명)</InputRightElement>
                  <Input
                    value={jobs.recruitmentNumber}
                    onChange={(e) => handleCreateInput("recruitmentNumber", e)}
                    type={"number"}
                    placeholder={"모집인원"}
                  />
                </InputGroup>
              </Box>
              <Box w={"50%"}>
                <FormLabel>카테고리 선택</FormLabel>
                <Select
                  value={jobs.categoryName}
                  onChange={(e) => handleCreateInput("categoryName", e)}
                >
                  {jobs.categoryNames.map((name) => (
                    <option key={name.index}>{name}</option>
                  ))}
                </Select>
              </Box>
            </Flex>

            <FormLabel>가게명</FormLabel>
            <Select
              value={jobs.storeName}
              onChange={(e) => handleCreateInput("storeName", e)}
            >
              {jobs.storeNames.map((name) => (
                <option key={name.index}>{name}</option>
              ))}
            </Select>

            <FormLabel>작성자</FormLabel>
            <Input
              value={jobs.name}
              onChange={(e) => handleCreateInput("name", e)}
              type={"text"}
              readOnly
            />
            <FormLabel>가게위치</FormLabel>

            <KakaoMap2 onSubmit={handleMapSubmit} />

            <Box>
              <Text>사진첨부</Text>
              <Input
                multiple
                type={"file"}
                onChange={(e) => {
                  setFiles(e.target.files);
                }}
              ></Input>
              첨부파일 리스트:
              {fileNameList}
            </Box>
          </FormControl>
        </Center>
      </Flex>
      <Center ml={"10px"}>
        <Button
          // isDisabled={!allFieldsFilled}
          onClick={handleSubmitCreateJobs}
          colorScheme={"purple"}
          w={"200px"}
          my={"70px"}
        >
          공고생성
        </Button>
      </Center>
    </Box>
  );
}
