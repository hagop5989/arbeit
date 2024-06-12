import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function ResumeView() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/resume/${id}`).then((res) => {
      setResume(res.data);
    });
  }, []);

  function handlePrevClick() {
    navigate("/resume/list");
  }
  if (resume === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading>이력서 세부항목</Heading>
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
        <Input
          defaultValue={resume.isRookie === 0 ? "신입" : "경력"}
          readOnly
        />
        <FormLabel>작성일시</FormLabel>
        <Input defaultValue={resume.inserted} readOnly />
        <Button onClick={handlePrevClick}>이전</Button>
      </FormControl>
    </Box>
  );
}
