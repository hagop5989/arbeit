import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Tab,
  TabList,
  Tabs,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function ResumeView() {
  const { id } = useParams();
  const [resume, setResume] = useState({});
  const [profileSrc, setProfileSrc] = useState("");
  const initialIndex = resume.isRookie === 1 ? 0 : 1;
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/resume/${id}`)
      .then((res) => {
        setResume(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          navigate("/resume/list");
        }
      });
    if (resume.memberId !== undefined) {
      getProfilePicture();
    }
  }, [resume.memberId]);

  function getProfilePicture() {
    axios
      .get(`/api/profile/${resume.memberId}`)
      .then((res) => {
        setProfileSrc(res.data);
      })
      .catch(() =>
        toast({
          status: "error",
          description: "내부 오류 발생",
          position: "top",
        }),
      )
      .finally();
  }

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

  function handlePrevClick() {
    navigate("/resume/list");
  }

  return (
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Heading mb={"10px"} p={1}>
        이력서 세부항목
      </Heading>
      <Divider mb={"40px"} borderWidth={"2px"} />
      <Box w="full" gap={"20px"} display={"flex"} flexDirection={"column"}>
        <FormControl>
          <FormLabel></FormLabel>
          <Image
            w={"240px"}
            h={"240px"}
            border={"1px solid gray"}
            borderRadius={150}
            src={profileSrc === "" ? "/public/base_profile.png" : profileSrc}
          />
        </FormControl>
        <FormControl>
          <Box mb={4}>
            <FormLabel fontSize={"xl"}>제목</FormLabel>
            <Input defaultValue={resume.title} readOnly />
          </Box>
          <Flex gap={"10px"} mb={4}>
            <Box w={"50%"}>
              <FormLabel fontSize={"xl"}>성별</FormLabel>
              <Input defaultValue={resume.gender} readOnly />
            </Box>
            <Box w={"50%"}>
              <FormLabel fontSize={"xl"}>생년월일</FormLabel>
              <Input defaultValue={resume.birthDate} readOnly />
            </Box>
          </Flex>
          <Flex gap={"10px"} mb={4}>
            <Box w={"50%"}>
              <FormLabel fontSize={"xl"}>이메일</FormLabel>
              <Input defaultValue={resume.email} readOnly />
            </Box>
            <Box w={"50%"}>
              <FormLabel fontSize={"xl"}>전화번호</FormLabel>
              <Input defaultValue={formatPhoneNumber(resume.phone)} readOnly />
            </Box>
          </Flex>
          <Box mb={4}>
            <FormLabel fontSize={"xl"}>자기소개</FormLabel>
            <Textarea defaultValue={resume.content} h={"150px"} readOnly />
          </Box>
          <Box mb={4}>
            <FormLabel fontSize={"xl"}>신입여부</FormLabel>
            {resume.isRookie === 1 && <Input defaultValue={"신입"} readOnly />}
            {resume.isRookie !== 1 && <Input defaultValue={"경력"} readOnly />}
          </Box>

          <Box mb={4}>
            <FormLabel fontSize={"xl"}>경력</FormLabel>
            <Tabs variant="solid-rounded" index={initialIndex}>
              <TabList>
                <Tab
                  w={"160px"}
                  h={"50px"}
                  border={"1px solid lightgray"}
                  onClick={(e) => e.preventDefault()} // 클릭 이벤트 무효화
                >
                  신입
                </Tab>
                <Tab
                  w={"160px"}
                  h={"50px"}
                  border={"1px solid lightgray"}
                  onClick={(e) => e.preventDefault()} // 클릭 이벤트 무효화
                >
                  경력
                </Tab>
              </TabList>
            </Tabs>
          </Box>

          <Box mb={8}>
            <FormLabel fontSize={"xl"}>작성일시</FormLabel>
            <Input defaultValue={resume.inserted} readOnly />
          </Box>
          <Flex gap={"10px"}>
            <Button
              w={"50%"}
              bgColor={"gray.500"}
              color={"white"}
              onClick={handlePrevClick}
            >
              이전
            </Button>
            <Button
              w={"50%"}
              bgColor={"#FF7F3E"}
              color={"white"}
              onClick={() => navigate(`/resume/${resume.id}/edit`)}
            >
              수정
            </Button>
          </Flex>
        </FormControl>
      </Box>
    </Box>
  );
}
