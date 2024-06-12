import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function ResumeView() {
  const { id } = useParams();
  const [resume, setResume] = useState({});
  const [profileSrc, setProfileSrc] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/resume/${id}`).then((res) => {
      setResume(res.data);
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

  function handlePrevClick() {
    navigate("/resume/list");
  }

  return (
    <Box>
      <Heading>이력서 세부항목</Heading>
      <FormControl>
        <FormLabel></FormLabel>
        <Image
          w={"240px"}
          h={"240px"}
          border={"1px solid gray"}
          borderRadius={150}
          src={
            profileSrc === ""
              ? "https://contents.albamon.kr/monimg/msa/assets/images/icon_profile_male80.svg"
              : profileSrc
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input defaultValue={resume.title} readOnly />
        <FormLabel>성별</FormLabel>
        <Input defaultValue={resume.gender} readOnly />
        <FormLabel>생년월일</FormLabel>
        <Input defaultValue={resume.birthDate} readOnly />
        <FormLabel>이메일</FormLabel>
        <Input defaultValue={resume.email} readOnly />
        <FormLabel>전화번호</FormLabel>
        <Input defaultValue={resume.phone} readOnly />
        <FormLabel>자기소개</FormLabel>
        <Input defaultValue={resume.content} readOnly />
        <FormLabel>신입여부</FormLabel>
        {resume.isRookie === 1 && <Input defaultValue={"신입"} readOnly />}
        {resume.isRookie !== 1 && <Input defaultValue={"경력"} readOnly />}
        <FormLabel>작성일시</FormLabel>
        <Input defaultValue={resume.inserted} readOnly />
        <Button onClick={handlePrevClick}>이전</Button>
      </FormControl>
    </Box>
  );
}
