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
import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons/faCamera";

export function ResumeWrite() {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [resume, setResume] = useState({
    memberId: account.id,
    title: "",
    content: "",
    gender: "",
    birthDate: "",
    // files: [],
    isRookie: true,
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

  const allFieldsFilled = resume.title.length > 0 && resume.content.length > 0;

  function handleCreateInput(field, e) {
    setResume((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleTabChange(index) {
    setResume((prev) => ({
      ...prev,
      rookie: index === 1, // 경력이면 true 반환
    }));
    console.log(index);
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
        .post("/api/member/resume/insert", resume)
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
      <Divider my={6} />

      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>이력서 제목</FormLabel>
            <Input
              value={resume.title}
              onChange={(e) => handleCreateInput("title", e)}
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
              value={resume.gender}
              onChange={(e) => handleCreateInput("gender", e)}
            >
              <option value={"M"}>남</option>
              <option value={"F"}>여</option>
            </Select>
            <FormLabel w={"100px"}>핸드폰</FormLabel>
            <Input
              w={"200px"}
              value={resume.phone}
              onChange={(e) => handleCreateInput("phone", e)}
              placeholder={"010-1234-5678"}
            />
            <FormLabel w={"100px"}>이메일</FormLabel>
            <Input
              w={"200px"}
              value={resume.email}
              onChange={(e) => handleCreateInput("email", e)}
              placeholder={"abc@abc.com"}
            />
            <FormLabel w={"100px"}>
              생년월일
              <Input
                type={"date"}
                w={"200px"}
                value={resume.birthDate}
                onChange={(e) => handleCreateInput("birthDate", e)}
              />
            </FormLabel>

            <Divider my={6} />
            <Box>
              <FormLabel>신입,경력 여부</FormLabel>
              <Tabs onChange={handleTabChange} variant="solid-rounded" mt={2}>
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
                value={resume.address1}
                onChange={(e) => handleCreateInput("address1", e)}
              >
                <option>전국</option>
                <option>서울특별시</option>
                <option>경기도</option>
              </Select>
              <Select
                w={"340px"}
                value={resume.address2}
                onChange={(e) => handleCreateInput("address2", e)}
              >
                <option disabled>시/군/구</option>
                <option>전체</option>
                <option>강남구</option>
              </Select>
            </Flex>

            <Divider my={6} />
            <FormLabel>내용</FormLabel>
            <Textarea
              value={resume.content}
              onChange={(e) => handleCreateInput("content", e)}
              type={"text"}
              placeholder={"내용을 입력해주세요"}
            />
            <FormLabel>희망급여</FormLabel>
            <InputGroup>
              <InputRightElement w={"15%"}>(원)</InputRightElement>
              <Input
                value={resume.preferredPay}
                onChange={(e) => handleCreateInput("preferredPay", e)}
                type={"number"}
                placeholder={"시급을 입력해주세요"}
              />
            </InputGroup>
            <Flex justifyContent={"space-between"} my={3}>
              <Box w={"50%"} borderRadius={"5px"}>
                <FormLabel>근무시작</FormLabel>
                <Select
                  value={resume.workDayType}
                  onChange={(e) => handleCreateInput("workDayType", e)}
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
                  value={resume.workShiftType}
                  onChange={(e) => handleCreateInput("workShiftType", e)}
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
              value={resume.deadline}
              onChange={(e) => handleCreateInput("deadline", e)}
              type={"datetime-local"}
              placeholder={"마감일을 입력해주세요"}
            />
            <Flex gap={3}>
              <Box w={"50%"}>
                <FormLabel>(희망분야)카테고리 선택</FormLabel>
                <Select onChange={(e) => handleCreateInput("preferredJob", e)}>
                  <option>1</option>
                  <option>2</option>
                </Select>
              </Box>
            </Flex>
            <Flex justifyContent="center">
              <Button
                // isDisabled={!allFieldsFilled}
                onClick={handleSubmitCreateResume}
                colorScheme={"purple"}
                w={120}
                my={"100px"}
              >
                이력서생성
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}
