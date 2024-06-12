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
  const [storeList, setStoreList] = useState([]);
  const [jobs, setJobs] = useState({
    title: "",
    content: "",
    salary: "",
    deadline: "",
    recruitmentNumber: "",
    storeName: "",
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
    fileNameList.push(<li key={i}>{files[i].name}</li>);
  }

  const handleMapSubmit = (x, y, markerName) => {
    setJobs((prev) => ({
      ...prev,
      x: x,
      y: y,
      markerName: markerName,
    }));
  };

  useEffect(() => {
    axios
      .get("/api/jobs/insert", { params: { memberId: account.id } })
      .then((res) => {
        setStoreList(res.data);
        setJobs((prev) => ({
          ...prev,
          name: account.name,
          memberId: account.id,
        }));
      })
      .catch((error) => console.error(error));
  }, [account]);

  const handleCreateInput = (field, event) => {
    const value = event.target.value;
    if (field === "storeName") {
      const [storeName, categoryId] = value.split("-cateNo:");
      const store = storeList.find(
        (store) =>
          store.name === storeName && store.categoryId === parseInt(categoryId),
      );
      setJobs((prev) => ({
        ...prev,
        storeName: storeName,
        categoryName: store ? store.cateName : "",
        categoryId: store ? store.categoryId : "",
      }));
    } else {
      setJobs((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

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

  const allFieldsFilled = Object.values(jobs).every(
    (value) => value.length > 0,
  );

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
                type={"text"}
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
            </Flex>

            <FormLabel>가게명</FormLabel>
            <Select
              value={`${jobs.storeName}-cateNo:${jobs.categoryId}`}
              onChange={(e) => handleCreateInput("storeName", e)}
            >
              {storeList.map((store) => (
                <option
                  key={store.id}
                  value={`${store.name}-cateNo:${store.categoryId}`}
                >
                  {store.name}-cateNo:{store.categoryId}
                </option>
              ))}
            </Select>
            <Box w={"50%"}>
              <FormLabel>카테고리 선택</FormLabel>
              <Input
                value={jobs.categoryName}
                readOnly
                placeholder={"가게명 선택 시 자동선택"}
              />
            </Box>

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
              <ul>{fileNameList}</ul>
            </Box>
          </FormControl>
        </Center>
      </Flex>
      <Center ml={"10px"}>
        <Button
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
