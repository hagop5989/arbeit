import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function JobsView() {
  const { id } = useParams();

  const [jobs, setJobs] = useState({});
  const [jobsCondition, setJobsCondition] = useState({});
  const [images, setImages] = useState([]);

  const toast = useToast();
  function myToast(text, status) {
    toast({
      description: <Box whiteSpace="pre-line">{text}</Box>,
      status: status,
      position: "top",
      duration: "700",
    });
  }
  const navigate = useNavigate();

  // Read
  useEffect(() => {
    axios
      .get(`/api/jobs/${id}`)
      .then((res) => {
        setJobs(res.data.jobs);
        setJobsCondition(res.data.jobsCondition);
        setImages(res.data.images);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          myToast("해당 게시물이 존재하지 않습니다", "error");
          navigate("/jobs/list");
        }
      });
  }, []);

  function handleRemoveBtn() {
    axios.delete(`/api/jobs/${id}`).then(() => navigate("/jobs/list"));
  }

  // 스피너
  if (jobs === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading>알바공고 상세페이지</Heading>
      <Center w={"50%"} ml={"25%"}>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input defaultValue={jobs.title} readOnly />

          <FormLabel>내용</FormLabel>
          <Textarea defaultValue={jobs.content} readOnly />

          <FormLabel>시급</FormLabel>
          <Input defaultValue={jobs.salary} readOnly />

          <FormLabel>마감일</FormLabel>
          <Input defaultValue={jobs.deadline} readOnly />

          <FormLabel>모집인원</FormLabel>
          <Input defaultValue={jobs.recruitmentNumber} readOnly />

          <FormLabel>카테고리(자동선택)</FormLabel>
          <Input defaultValue={jobs.categoryName} readOnly />

          <FormLabel>가게명</FormLabel>
          <Input defaultValue={jobs.storeName} readOnly />
          <FormLabel>첨부사진</FormLabel>
          <Box>
            {images.map((image) => (
              <Image key={image.name} src={image.src} />
            ))}
          </Box>

          <Box>
            <Text>상세 조건</Text>
            <Box>
              <FormLabel>학력</FormLabel>
              <Input defaultValue={jobsCondition.education} readOnly />

              <FormLabel>학력상세</FormLabel>
              <Input defaultValue={jobsCondition.educationDetail} readOnly />

              <FormLabel>연령제한</FormLabel>
              <Input defaultValue={jobsCondition.age} readOnly />

              <FormLabel>우대사항</FormLabel>
              <Input defaultValue={jobsCondition.preferred} readOnly />

              <FormLabel>근무기간</FormLabel>
              <Input defaultValue={jobsCondition.workPeriod} />

              <FormLabel>근무요일</FormLabel>
              <Input defaultValue={jobsCondition.workWeek} readOnly />

              <FormLabel>근무시간</FormLabel>
              <Input defaultValue={jobsCondition.workTime} readOnly />
            </Box>
          </Box>
          <Flex justifyContent="center">
            <Button onClick={() => navigate(`/jobs/${id}/apply`)}>
              지원하기
            </Button>
            <Button onClick={() => navigate("/jobs/89/edit")}>수정</Button>
            <Button onClick={handleRemoveBtn}>삭제</Button>
          </Flex>
        </FormControl>
      </Center>
    </Box>
  );
}
