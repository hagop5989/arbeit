import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Select,
  Spinner,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  eduDetailList,
  eduList,
  workPeriodList,
  workTimeList,
  workWeekList,
} from "./jobsConst.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export function JobsEdit() {
  const { id } = useParams();

  const [jobs, setJobs] = useState({});
  const [jobsCondition, setJobsCondition] = useState({});
  const [images, setImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [addImages, setAddImages] = useState([]);
  const [isAgeLimitChecked, setIsAgeLimitChecked] = useState(false);

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
          navigate("/jobs/list");
        }
      });
    if (jobsCondition.age == 0) {
      setIsAgeLimitChecked(true);
    }
  }, [jobsCondition.age]);

  // update
  function handleSaveBtn() {
    axios
      .putForm(`/api/jobs/${id}`, {
        ...jobs,
        ...jobsCondition,
        removeImages,
        addImages,
      })
      .then(() => {
        myToast("수정이 완료됐습니다.", "success");
        navigate(`/jobs/${id}`);
      })
      .catch(() => alert("오류 발생"));
  }

  const handleAgeLimitChange = (e) => {
    const isChecked = e.target.checked;
    setIsAgeLimitChecked(isChecked);
    if (isChecked) {
      setJobs({ ...jobs, age: 0 });
    }
  };

  const handleInputChange = (prop) => (e) => {
    setJobs({ ...jobs, [prop]: e.target.value });
  };
  const handleCondInputChange = (prop) => (e) => {
    setJobsCondition({ ...jobsCondition, [prop]: e.target.value });
  };

  function handleRemoveImage(imageName) {
    setRemoveImages([...removeImages, imageName]);
    setImages((prevList) => {
      const index = prevList.findIndex((image) => image.name === imageName);
      if (index !== -1) {
        const newList = [...prevList];
        newList.splice(index, 1);
        return newList;
      }
      return prevList;
    });
  }

  const fileNameList = [];
  for (let addFile of addImages) {
    // 이미 있는 파일과 중복된 파일명인지?
    let duplicate = false;
    for (let file of images) {
      if (file.name === addFile.name) {
        duplicate = true;
        break;
      }
    }
    fileNameList.push(
      <Flex key={addFile.name}>
        <Text fontSize={"md"} mr={3}>
          {addFile.name}
        </Text>
        <Box>{duplicate && <Badge colorScheme="red">덮어쓰기</Badge>}</Box>
      </Flex>,
    );
  }

  if (jobs === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading>알바공고 상세페이지</Heading>
      <Center w={"100%"} ml={""}>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            defaultValue={jobs.title}
            onChange={handleInputChange("title")}
          />

          <FormLabel>내용</FormLabel>
          <Textarea
            defaultValue={jobs.content}
            onChange={handleInputChange("content")}
          />

          <FormLabel>시급</FormLabel>
          <Input
            defaultValue={jobs.salary}
            onChange={handleInputChange("salary")}
          />

          <FormLabel>마감일</FormLabel>
          <Input
            type={"datetime-local"}
            defaultValue={jobs.deadline}
            onChange={handleInputChange("deadline")}
          />

          <FormLabel>모집인원</FormLabel>
          <Input
            defaultValue={jobs.recruitmentNumber}
            onChange={handleInputChange("recruitmentNumber")}
          />

          <FormLabel>카테고리(자동선택)</FormLabel>
          <Input defaultValue={jobs.categoryName} readOnly />

          <FormLabel>가게명</FormLabel>
          <Input defaultValue={jobs.storeName} readOnly />

          <FormLabel>첨부사진</FormLabel>
          <Box>
            <FormControl>
              {/* todo : 이미지 등록 수정 */}
              <Box
                border="1px solid gray"
                display="flex"
                justifyContent="center"
              >
                {images.map((image, index) => (
                  <Box key={index}>
                    <Box>
                      <Box
                        h={"10%"}
                        position={"absolute"}
                        color={"red"}
                        onClick={() => handleRemoveImage(image.name)}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </Box>
                      <Image w={"100%"} h={"100%"} src={image.src} />
                    </Box>
                  </Box>
                ))}
              </Box>
              <FormLabel>이미지 등록</FormLabel>
              <Input
                multiple
                type="file"
                accept="image/*"
                onChange={(e) => setAddImages(e.target.files)}
              />
              {fileNameList.length > 0 && (
                <Box>
                  <Card>
                    <CardHeader>
                      <Heading size="md">추가 선택된 이미지 목록</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing={4}>
                        {fileNameList}
                      </Stack>
                    </CardBody>
                  </Card>
                </Box>
              )}
            </FormControl>
          </Box>
          <Box>
            <Text>상세 조건</Text>
            <Box>
              <FormLabel>학력</FormLabel>
              <Select
                value={jobsCondition.education}
                onChange={handleCondInputChange("education")}
              >
                {eduList.map((education, index) => (
                  <option key={index} value={education}>
                    {education}
                  </option>
                ))}
              </Select>
              <Select
                value={jobsCondition.educationDetail}
                onChange={handleCondInputChange("educationDetail")}
              >
                {eduDetailList.map((eduDetail, index) => (
                  <option key={index} value={eduDetail}>
                    {eduDetail}
                  </option>
                ))}
              </Select>

              <FormLabel>연령제한</FormLabel>
              <Checkbox
                isChecked={isAgeLimitChecked}
                onChange={handleAgeLimitChange}
              >
                연령무관
              </Checkbox>

              <Input
                defaultValue={jobsCondition.age}
                onChange={handleInputChange("age")}
                type={"number"}
                disabled={isAgeLimitChecked}
              />

              <FormLabel>우대사항</FormLabel>
              <Input
                defaultValue={jobsCondition.preferred}
                onChange={handleInputChange("preferred")}
              />

              <FormLabel>근무기간</FormLabel>
              <Select
                value={jobsCondition.workPeriod}
                onChange={handleCondInputChange("workPeriod")}
                placeholder={"기간을 정해주세요."}
              >
                {workPeriodList.map((workPeriod, index) => (
                  <option key={index} value={workPeriod}>
                    {workPeriod}
                  </option>
                ))}
              </Select>

              <FormLabel>근무요일</FormLabel>
              <Select
                value={jobsCondition.workWeek}
                onChange={handleCondInputChange("workWeek")}
                placeholder={"요일을 정해주세요."}
              >
                {workWeekList.map((workWeek, index) => (
                  <option key={index} value={workWeek}>
                    {workWeek}
                  </option>
                ))}
              </Select>
              <FormLabel>근무시간</FormLabel>
              <Select
                value={jobsCondition.workTime}
                onChange={handleCondInputChange("workTime")}
                placeholder={"시간을 정해주세요."}
              >
                {workTimeList.map((workTime, index) => (
                  <option key={index} value={workTime}>
                    {workTime}
                  </option>
                ))}
              </Select>
            </Box>
          </Box>
          <Flex justifyContent="center">
            <Button onClick={handleSaveBtn}>저장</Button>
          </Flex>
        </FormControl>
      </Center>
    </Box>
  );
}
