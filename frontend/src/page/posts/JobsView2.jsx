import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  Stack,
  StackDivider,
  Switch,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { KakaoMap1 } from "./KakaoMap1.jsx";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function JobsView2() {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [removeFileList, setRemoveFileList] = useState([]);
  const [addFileList, setAddFileList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [editJobs, setEditJobs] = useState({
    title: "",
    content: "",
    salary: "",
    deadline: "",
    recruitmentNumber: "",
    storeName: "default",
    storeNames: [],
    categoryId: "1",
    categoryName: "",
    categoryNames: [],
    categoryMap: {},
    storeId: "8",

    memberId: account.id,
    name: account.name,

    startTime: "",
    endTime: "",
    x: "",
    y: "",
    resultName: "",
  });

  function removeFileListProperties(obj) {
    const newObj = { ...obj }; // 원본 객체를 복사합니다.
    Object.keys(newObj).forEach((key) => {
      if (key.startsWith("fileList")) {
        delete newObj[key]; // fileList로 시작하는 모든 프로퍼티를 삭제합니다.
      }
    });
    return newObj;
  }

  function handleEditInput(field, e) {
    setEditJobs((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmitEditJobs() {
    axios
      .putForm("/api/jobs/update", { ...editJobs, removeFileList, addFileList })
      .then((res) => {
        myToast("수정 완료 되었습니다", "success");
        navigate("/jobs/list");
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
        setEditJobs(res.data.jobs);
        setEditJobs((prev) => ({
          ...prev,
          storeNames: res.data.storeNames,
          categoryMap: res.data.categoryMap,
        }));
        setFileList(res.data.jobs.fileList);
        delete res.data.jobs.fileList;
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

  const handleImageClick = (src) => {
    window.open(src, "_blank");
  };

  if (editJobs === null) {
    return <Spinner />;
  }

  const fileNameList = [];
  for (let addFile of addFileList) {
    // 이미 있는 파일과 중복된 파일명인지?
    let duplicate = false;
    for (let file of fileList) {
      if (file.name === addFile.name) {
        duplicate = true;
        break;
      }
    }
    fileNameList.push(
      <Flex>
        <Text fontSize={"md"} mr={3}>
          {addFile.name}
        </Text>
        <Box>{duplicate && <Badge colorScheme="red">override</Badge>}</Box>
      </Flex>,
    );
  }

  function handleRemoveSwitchChange(name, checked) {
    if (checked) {
      setRemoveFileList([...removeFileList, name]);
    } else {
      setRemoveFileList(removeFileList.filter((item) => item !== name));
    }
  }

  function handleCategory() {
    /*todo: storeName*/
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
                <Input
                  value={editJobs.categoryName}
                  onChange={handleCategory}
                  readOnly
                />
              </Box>
            </Flex>

            <FormLabel>가게명</FormLabel>
            <Select
              value={editJobs.storeName}
              onChange={(e) => handleEditInput("storeName", e)}
            >
              {editJobs.storeNames.map((name) => (
                <option key={name.index}>{name}</option>
              ))}
            </Select>
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
            <FormLabel>첨부사진</FormLabel>
            <Input
              multiple
              type="file"
              accept="image/*"
              onChange={(e) => setAddFileList(e.target.files)}
            />
            {fileNameList.length > 0 && (
              <Box mb={7}>
                <Card>
                  <CardHeader>
                    <Heading size="md">추가 선택된 파일 목록</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing={4}>
                      {fileNameList}
                    </Stack>
                  </CardBody>
                </Card>
              </Box>
            )}

            <Box>
              {fileList &&
                fileList.map((file) => (
                  <Card m={3} key={file.name}>
                    <CardBody w={"100%"} h={"100%"} alignItems="center">
                      <Box>
                        <Flex>
                          <FontAwesomeIcon color="red" icon={faTrashCan} />
                          <Switch
                            colorScheme={"red"}
                            onChange={(e) =>
                              handleRemoveSwitchChange(
                                file.name,
                                e.target.checked,
                              )
                            }
                          />
                        </Flex>
                      </Box>
                      <Image
                        cursor="pointer"
                        onClick={() => handleImageClick(file.src)}
                        w={"100%"}
                        h={"100%"}
                        src={file.src}
                        sx={
                          removeFileList.includes(file.name)
                            ? { filter: "blur(8px)" }
                            : {}
                        }
                      />
                    </CardBody>
                  </Card>
                ))}
            </Box>
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
