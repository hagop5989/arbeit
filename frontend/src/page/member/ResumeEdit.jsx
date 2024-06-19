import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Tab,
  TabList,
  Tabs,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function ResumeEdit() {
  const { id } = useParams();
  const [resume, setResume] = useState({});
  const [errors, setErrors] = useState({});
  const initialIndex = resume.isRookie === 1 ? 0 : 1;

  const navigate = useNavigate();
  const toast = useToast();

  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/resume/${id}`)
      .then((res) => {
        setResume(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404 || err.response.status === 403) {
          toast({
            status: "warning",
            description: "접근 권한이 없습니다.",
            position: "top",
          });
          navigate("/resume/list");
        }
      });
  }, []);

  function handleRookieBtn(prop) {
    setResume({ ...resume, isRookie: prop });
  }

  const handleInputChange = (prop) => (e) => {
    setResume({ ...resume, [prop]: e.target.value });
  };

  //  핸드폰 번호 - 붙여서 보여주기 (실제론 아님)
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  // Update
  function handleSaveBtn() {
    axios
      .put(`/api/resume/${id}`, resume)
      .then(() => {
        toast({
          status: "success",
          description: "수정 완료",
          position: "top",
        });
        navigate(`/resume/${id}`);
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  }

  return (
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Heading mb={"10px"} p={1}>
        이력서 수정
      </Heading>
      <Divider mb={"40px"} borderWidth={"2px"} />
      <Box w="full" gap={"20px"} display={"flex"} flexDirection={"column"}>
        <FormControl>
          <Box>
            <Box mb={4}>
              <FormLabel fontSize={"xl"}>이름</FormLabel>
              <Input defaultValue={account.name} readOnly h={"50px"} />
            </Box>

            <Flex gap={"10px"} mb={4}>
              <Box w={"50%"}>
                <FormLabel fontSize={"xl"}>성별</FormLabel>
                <Input defaultValue={resume.gender} readOnly h={"50px"} />
              </Box>

              <Box w={"50%"}>
                <FormLabel fontSize={"xl"}>생년월일</FormLabel>
                <Input defaultValue={resume.birthDate} readOnly h={"50px"} />
              </Box>
            </Flex>

            <Flex gap={"10px"} mb={4}>
              <Box w={"50%"}>
                <FormLabel fontSize={"xl"}>이메일</FormLabel>
                <Input defaultValue={resume.email} readOnly h={"50px"} />
              </Box>

              <Box w={"50%"}>
                <FormLabel fontSize={"xl"}>전화번호</FormLabel>
                <Input
                  defaultValue={formatPhoneNumber(resume.phone)}
                  readOnly
                  h={"50px"}
                />
              </Box>
            </Flex>
          </Box>
          <Box mb={4}>
            <FormLabel fontSize={"xl"}>제목</FormLabel>
            <Input
              placeholder="제목을 입력해주세요."
              defaultValue={resume.title}
              onChange={handleInputChange("title")}
              h={"50px"}
              mb={4}
            />
            {errors && (
              <FormHelperText color="red.500">{errors.title}</FormHelperText>
            )}
          </Box>
          <Box mb={4}>
            <FormLabel fontSize={"xl"}>경력</FormLabel>
            <Tabs variant="solid-rounded" index={initialIndex}>
              <TabList>
                <Tab
                  onClick={() => handleRookieBtn(1)}
                  w={"160px"}
                  h={"50px"}
                  border={"1px solid lightgray"}
                >
                  신입
                </Tab>
                <Tab
                  onClick={() => handleRookieBtn(0)}
                  w={"160px"}
                  h={"50px"}
                  border={"1px solid lightgray"}
                >
                  경력
                </Tab>
              </TabList>
            </Tabs>
          </Box>
          <Box>
            <FormLabel fontSize={"xl"}>자기 소개</FormLabel>
            <Textarea
              placeholder="자기소개를 써주세요."
              defaultValue={resume.content}
              onChange={handleInputChange("content")}
              mb={4}
              h={"150px"}
            />
            {errors && (
              <FormHelperText color="red.500">{errors.content}</FormHelperText>
            )}

            <Button
              onClick={handleSaveBtn}
              bgColor={"#FF7F3E"}
              color={"white"}
              w="full"
              h={"50px"}
            >
              이력서 수정
            </Button>
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
}
