import {
  Box,
  Button,
  Center,
  Divider,
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
  Tab,
  TabList,
  Tabs,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons/faCamera";

export function ResumeView() {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  // const [files, setFiles] = useState([]);
  const [resumeEdit, setResumeEdit] = useState({
    memberId: account.id,
    title: "",
    content: "",
    gender: "",
    birthDate: "",
    // files: [],
    rookie: 0,
    address1: "",
    address2: "",
    email: "",
    phone: "",
    preferredPay: "",
    workDayType: "",
    workShiftType: "",
    deadline: "",
    preferredJob: "",
  });
  const workDays = ["월~일", "월~토", "월~금", "주말(토,일)"];
  const workShifts = [
    "오전 파트타임 (06:00 ~ 12:00)",
    "오후 파트타임 (12:00 ~ 18:00)",
    "저녁 파트타임 (18:00 ~ 24:00)",
    "새벽 파트타임 (00:00 ~ 06:00)",
  ];

  const allFieldsFilled =
    resumeEdit.title.length > 0 && resumeEdit.content.length > 0;

  function handleEditInput(field, e) {
    setResumeEdit((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleTabChange(index) {
    setResumeEdit((prev) => ({
      ...prev,
      rookie: index === 0 ? 1 : 0,
    }));
    console.log(resumeEdit.rookie);
  }

  function handleSubmitCreateResume() {
    if (allFieldsFilled) {
      // const formData = new FormData();
      // formData.append("memberId", account.id);
      // formData.append("title", resumeEdit.title);
      // formData.append("content", resumeEdit.content);
      //
      // for (let i = 0; i < files.length; i++) {
      //   formData.append("files", files[i]);
    }
    axios
      .put("/api/member/resume/update", resumeEdit)
      .then((res) => {
        myToast("이력서 생성 되었습니다", "success");
        navigate("/member/resume/list");
      })
      .catch((e) => {
        myToast("입력 값을 확인해주세요.", "error");
        console.log(e);
      })
      .finally(() => {});
    // } else {
    //   myToast("입력값 중 빈칸이 존재합니다.", "error");
    // }
  }

  function handleSubmitDeleteResume() {
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

  useEffect(() => {
    axios
      .get(`/api/member/resume/${id}`)
      .then((res) => {
        setResumeEdit(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "해당 게시물이 존재하지 않습니다.",
            position: "top",
          });
          navigate("/member/resume/list");
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
      <Heading>이력서 세부항목</Heading>
      <Divider my={6} />

      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>이력서 제목</FormLabel>
            <Input
              value={resumeEdit.title}
              onChange={(e) => handleEditInput("title", e)}
              type={"text"}
              placeholder={"제목을 입력해주세요"}
            />
            <Divider my={6} />
            <Box>
              <FormLabel>사진</FormLabel>
              <Image
                w={"240px"}
                h={"240px"}
                src={
                  "https://contents.albamon.kr/monimg/msa/assets/images/icon_profile_male80.svg"
                }
              />
              <Center
                boxSize={"50px"}
                bgColor="gray.100"
                borderRadius={100}
                mt={"-30px"}
              >
                <FontAwesomeIcon
                  icon={faCamera}
                  fontSize={"25px"}
                  cursor="pointer"
                />
              </Center>
            </Box>
            <Divider my={6} />
            <FormLabel w={"100px"}>성별</FormLabel>
            <Select
              w={"100px"}
              value={resumeEdit.gender}
              onChange={(e) => handleEditInput("gender", e)}
            >
              <option value={"M"}>남</option>
              <option value={"F"}>여</option>
            </Select>
            <FormLabel w={"100px"}>핸드폰</FormLabel>
            <Input
              w={"200px"}
              value={resumeEdit.phone}
              onChange={(e) => handleEditInput("phone", e)}
              placeholder={"010-1234-5678"}
            />
            <FormLabel w={"100px"}>이메일</FormLabel>
            <Input
              w={"200px"}
              value={resumeEdit.email}
              onChange={(e) => handleEditInput("email", e)}
              placeholder={"abc@abc.com"}
            />
            <FormLabel w={"100px"}>
              생년월일
              <Input
                type={"date"}
                w={"200px"}
                value={resumeEdit.birthDate}
                onChange={(e) => handleEditInput("birthDate", e)}
              />
            </FormLabel>

            <Divider my={6} />
            <Box>
              <FormLabel>신입,경력 여부</FormLabel>
              <Tabs
                index={resumeEdit.rookie ? 0 : 1}
                onChange={handleTabChange}
                variant="solid-rounded"
                mt={2}
              >
                <TabList>
                  <Tab w={"160px"} h={"50px"}>
                    신입
                  </Tab>
                  <Tab w={"160px"} h={"50px"}>
                    경력
                  </Tab>
                </TabList>
              </Tabs>
            </Box>
            <Divider my={6} />
            <FormLabel>희망근무지</FormLabel>
            <Flex>
              <Select
                w={"340px"}
                value={resumeEdit.address1}
                onChange={(e) => handleEditInput("address1", e)}
              >
                <option>전국</option>
                <option>서울특별시</option>
                <option>경기도</option>
              </Select>
              <Select
                w={"340px"}
                value={resumeEdit.address2}
                onChange={(e) => handleEditInput("address2", e)}
              >
                <option disabled>시/군/구</option>
                <option>전체</option>
                <option>강남구</option>
              </Select>
            </Flex>

            <Divider my={6} />
            <FormLabel>내용</FormLabel>
            <Textarea
              value={resumeEdit.content}
              onChange={(e) => handleEditInput("content", e)}
              type={"text"}
              placeholder={"내용을 입력해주세요"}
            />
            <FormLabel>희망급여</FormLabel>
            <InputGroup>
              <InputRightElement w={"15%"}>(원)</InputRightElement>
              <Input
                value={resumeEdit.preferredPay}
                onChange={(e) => handleEditInput("preferredPay", e)}
                type={"number"}
                placeholder={"시급을 입력해주세요"}
              />
            </InputGroup>
            <Flex justifyContent={"space-between"} my={3}>
              <Box w={"50%"} borderRadius={"5px"}>
                <FormLabel>근무시작</FormLabel>
                <Select
                  value={resumeEdit.workDayType}
                  onChange={(e) => handleEditInput("workDayType", e)}
                >
                  {workDays.map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box w={"50%"} borderRadius={"5px"} ml={1}>
                <FormLabel>근무종료</FormLabel>
                <Select
                  value={resumeEdit.workShiftType}
                  onChange={(e) => handleEditInput("workShiftType", e)}
                >
                  {workShifts.map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </Box>
            </Flex>
            <FormHelperText my={2}>
              시계 모양을 클릭하여 선택해주세요
            </FormHelperText>
            <FormLabel>게시종료일</FormLabel>
            <Input
              value={resumeEdit.deadline}
              onChange={(e) => handleEditInput("deadline", e)}
              type={"date"}
              placeholder={"마감일을 입력해주세요"}
            />
            <Flex gap={3}>
              <Box w={"50%"}>
                <FormLabel>(희망분야)카테고리 선택</FormLabel>
                <Select
                  value={resumeEdit.preferredJob}
                  onChange={(e) => handleEditInput("preferredJob", e)}
                >
                  <option>1</option>
                  <option>2</option>
                </Select>
              </Box>
            </Flex>
            <Flex justifyContent="center">
              <Button
                onClick={() => navigate("/member/resume/list")}
                colorScheme={"green"}
                w={120}
                my={3}
              >
                이전
              </Button>
              <Button
                // isDisabled={!allFieldsFilled}
                onClick={handleSubmitCreateResume}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                수정
              </Button>
              <Button
                onClick={handleSubmitDeleteResume}
                colorScheme={"red"}
                w={120}
                my={3}
              >
                삭제
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}
