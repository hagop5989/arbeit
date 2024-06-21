import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Divider,
  Flex,
  FormControl,
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
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Heading mb={"10px"} p={1}>
        알바공고 수정
      </Heading>
      <Divider mb={"40px"} borderWidth={"2px"} />
      <Box w="full" gap={"20px"} display={"flex"} flexDirection={"column"}>
        <Box>
          <FormLabel fontSize={"3xl"}>제목</FormLabel>
          <Input
            mb={4}
            h={"50px"}
            defaultValue={jobs.title}
            placeholder="제목을 입력해주세요."
            onChange={handleInputChange("title")}
          />
        </Box>

        <Box>
          <FormLabel fontSize={"3xl"}>공고내용</FormLabel>
          <Textarea
            mb={2}
            defaultValue={jobs.content}
            placeholder={`공고내용을 입력해주세요. \n 예) OO 가게 신규 알바모집 (초보환영)`}
            onChange={handleInputChange("content")}
          />
        </Box>

        <Flex gap={"10px"}>
          <Box w={"50%"}>
            <FormLabel fontSize={"3xl"}>시급</FormLabel>
            <InputGroup>
              <InputRightElement mx={3}>원</InputRightElement>
              <Input
                mb={4}
                type="number"
                defaultValue={jobs.salary}
                placeholder="시급을 입력해주세요."
                onChange={handleInputChange("salary")}
              />
            </InputGroup>
          </Box>

          <Box w={"50%"}>
            <FormLabel fontSize={"3xl"}>공고 마감일</FormLabel>
            <Input
              mb={4}
              type="datetime-local"
              defaultValue={jobs.deadline}
              placeholder="마감일을 선택해주세요."
              onChange={handleInputChange("deadline")}
            />
          </Box>
        </Flex>

        <Box>
          <FormLabel fontSize={"3xl"}>모집인원</FormLabel>
          <InputGroup w={"49.2%"}>
            <InputRightElement mx={3}>명</InputRightElement>
            <Input
              mb={4}
              type="number"
              defaultValue={jobs.recruitmentNumber}
              placeholder="모집인원을 입력해주세요."
              onChange={handleInputChange("recruitmentNumber")}
            />
          </InputGroup>
        </Box>

        <Flex gap={"10px"}>
          <Box w={"50%"}>
            <FormLabel fontSize={"3xl"}>가게명</FormLabel>
            <Input mb={4} defaultValue={jobs.storeName} readOnly />
          </Box>
          <Box w={"50%"}>
            <FormLabel fontSize={"3xl"}>카테고리(자동선택)</FormLabel>
            <Input mb={4} defaultValue={jobs.categoryName} readOnly />
          </Box>
        </Flex>

        <FormLabel>첨부사진</FormLabel>
        <Box>
          <FormControl>
            <Box border="1px solid gray" display="flex" justifyContent="center">
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
              p={1}
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

        <Box mb={4}>
          <Box mt={"50px"}>
            <Text fontSize="3xl" mb={2} color={"gray.600"} fontWeight={"bold"}>
              상세 조건
            </Text>
            <Divider mb={4} />
          </Box>
          <Flex gap={4} mb={4}>
            <Box w="50%" maxW="480px">
              <FormLabel fontSize={"2xl"}>최소학력</FormLabel>
              <Select
                value={jobsCondition.education}
                onChange={handleCondInputChange("education")}
              >
                <option value="" disabled>
                  선택
                </option>
                {eduList.map((education, index) => (
                  <option key={index} value={education}>
                    {education}
                  </option>
                ))}
              </Select>
            </Box>
            <Box w="50%" mb={4} maxW="480px">
              <FormLabel fontSize={"2xl"}>학력상세</FormLabel>
              <Select
                value={jobsCondition.educationDetail}
                onChange={handleCondInputChange("educationDetail")}
              >
                <option value="" disabled>
                  선택
                </option>
                {eduDetailList.map((eduDetail, index) => (
                  <option key={index} value={eduDetail}>
                    {eduDetail}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>

          <Box>
            <FormLabel fontSize={"3xl"}>우대사항</FormLabel>
            <Input
              mb={4}
              defaultValue={jobsCondition.preferred}
              placeholder="우대사항을 입력해주세요."
              onChange={handleInputChange("preferred")}
            />
          </Box>

          <Flex gap={"10px"} mt={"20px"}>
            <Box w={"50%"}>
              <Flex>
                <FormLabel fontSize={"3xl"}>연령제한</FormLabel>
                <Checkbox
                  p={1}
                  isChecked={isAgeLimitChecked}
                  onChange={handleAgeLimitChange}
                >
                  <Text fontSize={"sm"}>연령무관</Text>
                </Checkbox>
              </Flex>
              <InputGroup>
                <InputRightElement
                  w={"50px"}
                  mx={3}
                  fontSize={"sm"}
                  color={"gray.500"}
                >
                  세 이상
                </InputRightElement>
                <Input
                  mb={4}
                  defaultValue={jobsCondition.age}
                  placeholder="연령을 입력해주세요."
                  onChange={handleInputChange("age")}
                  type="number"
                  disabled={isAgeLimitChecked}
                />
              </InputGroup>
            </Box>

            <Box w={"50%"}>
              <FormLabel fontSize={"3xl"}>근무기간</FormLabel>
              <Select
                mb={4}
                value={jobsCondition.workPeriod}
                onChange={handleCondInputChange("workPeriod")}
              >
                {workPeriodList.map((workPeriod, index) => (
                  <option key={index} value={workPeriod}>
                    {workPeriod}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>

          <Flex gap={"10px"} mt={"20px"}>
            <Box w={"50%"}>
              <FormLabel fontSize={"3xl"}>근무요일</FormLabel>
              <Select
                mb={4}
                value={jobsCondition.workWeek}
                onChange={handleCondInputChange("workWeek")}
              >
                {workWeekList.map((workWeek, index) => (
                  <option key={index} value={workWeek}>
                    {workWeek}
                  </option>
                ))}
              </Select>
            </Box>

            <Box w={"50%"}>
              <FormLabel fontSize={"3xl"}>근무시간</FormLabel>
              <Select
                mb={4}
                value={jobsCondition.workTime}
                onChange={handleCondInputChange("workTime")}
              >
                {workTimeList.map((workTime, index) => (
                  <option key={index} value={workTime}>
                    {workTime}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
        </Box>
      </Box>
      <Button
        onClick={handleSaveBtn}
        bgColor={"#FFA500"}
        color={"white"}
        w="full"
        h={"50px"}
        my={"25px"}
      >
        저장
      </Button>
    </Box>
  );
}
