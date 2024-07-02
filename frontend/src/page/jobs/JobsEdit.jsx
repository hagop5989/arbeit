import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  OrderedList,
  Select,
  Spinner,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { Helmet } from "react-helmet";

const styles = {
  formControl: {
    marginBottom: "60px",
    height: "100px",
  },
  formLabel: {
    color: "gray.600",
    fontSize: "22px",
    fontWeight: "800",
    width: "100%",
    marginBottom: 6,
  },
  mainFormLabel: {
    fontSize: "30px",
    fontWeight: "800",
    width: "100%",
    borderBottom: "2px solid #1F3042",
    marginBottom: 6,
  },
};

export function JobsEdit() {
  const { id } = useParams();

  const [jobs, setJobs] = useState({});
  const [jobsCondition, setJobsCondition] = useState({});
  const [images, setImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [addImages, setAddImages] = useState([]);
  const [isAgeLimitChecked, setIsAgeLimitChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false);
  const [checkLength, setCheckLength] = useState({});
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
  const account = useContext(LoginContext);

  const isError = (prop) => prop !== undefined;
  const inputRef = useRef(null);
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Read
  useEffect(() => {
    const param = new URLSearchParams();
    param.append("id", id);
    axios
      .post("/api/access-jobs", param)
      .then(() => {
        if (account.id !== null) {
          axios
            .get(`/api/jobs/${id}`)
            .then((res) => {
              setJobs(res.data.jobs);
              setJobsCondition(res.data.jobsCondition);
              setImages(res.data.images);
              setChecked(images.length !== 0);
            })
            .catch((err) => {
              if (err.response && err.response.status === 404) {
                navigate("/jobs/list");
              }
            });
          if (jobsCondition.age == 0) {
            setIsAgeLimitChecked(true);
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
  }, [account.id]);

  const handleImageChange = (event) => {
    const newImages = Array.from(event.target.files);
    if (newImages.length === 0) {
      return;
    }
    if (images.length + newImages.length > 5) {
      alert("이미지는 최대 5개까지 입력가능합니다.");
      return;
    }
    setAddImages(event.target.files);
    setJobs({ ...jobs, content: "추가사항 없음" });
    setImages((prevImageFiles) => {
      let updatedImageFiles = [...prevImageFiles];

      newImages.forEach((newImage) => {
        const newImageName = newImage.name; // 새로운 이미지 파일의 이름
        const index = updatedImageFiles.findIndex(
          (file) => file.name === newImageName,
        );
        if (index !== -1) {
          updatedImageFiles[index] = newImage;
          updatedImageFiles[index].dupl = 1;
        } else {
          // 새로운 이미지 파일 추가
          updatedImageFiles.push(newImage);
        }
      });

      return updatedImageFiles;
    });
  };

  // update
  function handleSaveBtn() {
    const confirm = window.confirm("수정하시겠습니까?");
    if (confirm) {
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
        .catch((err) => setErrors(err.response.data));
    }
  }

  const handleAgeLimitChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setJobsCondition({ ...jobsCondition, age: 0 });
    }
    setIsAgeLimitChecked(isChecked);
  };

  const handleInputChange = (prop) => (e) => {
    setJobs({ ...jobs, [prop]: e.target.value });
    setCheckLength({ ...checkLength, [prop]: e.target.value.length });
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

  function handleCheckboxChange() {
    setChecked(!checked);
    if (checked === true) {
      setRemoveImages(
        images.map((image) => {
          return image.name;
        }),
      );
    } else {
      setRemoveImages([]);
    }
  }

  if (jobs === null) {
    return <Spinner />;
  }

  return (
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Helmet>
        <title>채용공고 수정 - 알바커넥터</title>
      </Helmet>
      <Box
        h={"70px"}
        mb={"70px"}
        bg={"#FF7F3E"}
        color={"white"}
        borderRadius={"10px"}
      >
        <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
          채용 공고 수정
        </Heading>
      </Box>
      <Divider mb={"40px"} borderWidth={"2px"} />
      <Box w="full" gap={"20px"} display={"flex"} flexDirection={"column"}>
        <FormControl {...styles.formControl} isInvalid={isError(errors.title)}>
          <FormLabel {...styles.mainFormLabel}>제목</FormLabel>
          <Input
            h={"50px"}
            defaultValue={jobs.title}
            placeholder="제목을 입력해주세요."
            onChange={handleInputChange("title")}
          />
          {errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage>}
          <FormHelperText color={"gray"}>{checkLength.title}/30</FormHelperText>
        </FormControl>
        <Box>
          <Box {...styles.mainFormLabel}>개인 폼 사용여부</Box>
          <Checkbox
            size="lg"
            isChecked={checked}
            colorScheme="orange"
            onChange={handleCheckboxChange}
          >
            개인 폼 사용하기 (알바커넥터 기본 폼을 사용하지 않습니다.)
          </Checkbox>
        </Box>
        {checked && (
          <FormControl {...styles.formControl} mb={"100px"}>
            <Flex>
              <Box mr={"20px"}>
                <Text>최대 5개까지 첨부가능합니다.</Text>
                <Button onClick={handleButtonClick} colorScheme={"orange"}>
                  {images.length !== 0 ? "이미지 추가" : "이미지 등록"}
                </Button>
              </Box>
              <Input
                ref={inputRef}
                maxLength={"5"}
                display={"none"}
                multiple
                type="file"
                p={2}
                h={"50px"}
                onChange={handleImageChange}
              />
              <Box
                bg={"#E8E8E8"}
                w={"400px"}
                p={"10px"}
                pl={"20px"}
                borderRadius={"10px"}
              >
                <Text fontWeight={"800"} fontSize={"15px"} mb={"5px"}>
                  이미지 목록 (이미지는 A~z, 가 ~ 힣 순서로 출력됩니다.)
                </Text>
                <OrderedList>
                  {images.map((image, index) => (
                    <ListItem key={index}>
                      <Flex>
                        <Text>{image.name}</Text>
                        <Box mx={2}>
                          <FontAwesomeIcon
                            icon={faXmark}
                            color={"red"}
                            onClick={() => handleRemoveImage(image.name)}
                            cursor={"pointer"}
                          />
                        </Box>
                        {image.dupl === 1 && (
                          <Text color={"red"} fontWeight={"700"}>
                            덮어쓰기
                          </Text>
                        )}
                      </Flex>
                    </ListItem>
                  ))}
                </OrderedList>
              </Box>
            </Flex>
          </FormControl>
        )}
        <Box mt={"50px"}>
          <Text {...styles.mainFormLabel} mb={"20px"}>
            모집 조건
          </Text>
          <Divider />
        </Box>
        <Flex mb={"20px"}>
          <FormControl w={"45%"} mr={"50px"} isInvalid={isError(errors.salary)}>
            <FormLabel {...styles.formLabel}>시급</FormLabel>
            <InputGroup>
              <InputRightElement mx={3}>원</InputRightElement>
              <Input
                type="number"
                defaultValue={jobs.salary}
                placeholder="시급을 입력해주세요."
                onChange={handleInputChange("salary")}
              />
            </InputGroup>
            {errors.salary && (
              <FormErrorMessage>{errors.salary}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl w={"50%"} isInvalid={isError(errors.deadline)}>
            <FormLabel {...styles.formLabel}>공고 마감일</FormLabel>
            <Input
              type="datetime-local"
              defaultValue={jobs.deadline}
              placeholder="마감일을 선택해주세요."
              onChange={handleInputChange("deadline")}
            />
            {errors.deadline && (
              <FormErrorMessage>{errors.deadline}</FormErrorMessage>
            )}
          </FormControl>
        </Flex>

        <FormControl
          w={"45%"}
          mr={"50px"}
          isInvalid={isError(errors.recruitmentNumber)}
        >
          <FormLabel {...styles.formLabel}>모집인원</FormLabel>
          <InputGroup>
            <Input
              type="number"
              defaultValue={jobs.recruitmentNumber}
              placeholder="모집인원을 입력해주세요."
              onChange={handleInputChange("recruitmentNumber")}
            />
            <InputRightElement mx={3}>명</InputRightElement>
          </InputGroup>
          {errors.recruitmentNumber && (
            <FormErrorMessage>{errors.recruitmentNumber}</FormErrorMessage>
          )}
        </FormControl>
        <Box mb={4}>
          <Box mt={"50px"}>
            <Text {...styles.mainFormLabel} mb={"40px"}>
              세부 항목
            </Text>
            <Divider />
          </Box>
          <Flex w={"100%"} mb={"-30px"}>
            <FormControl
              w="45%"
              mr={"50px"}
              {...styles.formControl}
              isInvalid={isError(errors.education)}
            >
              <FormLabel {...styles.formLabel}>최소학력</FormLabel>
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
              {errors.education && (
                <FormErrorMessage>{errors.education}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl w={"50%"} isInvalid={isError(errors.educationDetail)}>
              <FormLabel {...styles.formLabel}>학력상세</FormLabel>
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
              {errors.educationDetail && (
                <FormErrorMessage>{errors.educationDetail}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>

          <FormControl mb={"30px"} isInvalid={isError(errors.preferred)}>
            <FormLabel {...styles.formLabel}>우대사항</FormLabel>
            <Input
              defaultValue={jobsCondition.preferred}
              onChange={handleCondInputChange("preferred")}
            />
            {errors.preferred && (
              <FormErrorMessage>{errors.preferred}</FormErrorMessage>
            )}
            <FormHelperText>{checkLength.preferred}/200</FormHelperText>
          </FormControl>

          <Flex mb={"30px"}>
            <FormControl w={"45%"} mr={"50px"} isInvalid={isError(errors.age)}>
              <FormLabel {...styles.formLabel}>연령제한</FormLabel>
              <Checkbox
                p={1}
                isChecked={isAgeLimitChecked}
                onChange={handleAgeLimitChange}
              >
                <Text fontSize={"sm"}>연령무관</Text>
              </Checkbox>
              {!isAgeLimitChecked && (
                <InputGroup>
                  <Input
                    defaultValue={jobsCondition.age}
                    placeholder="연령을 입력해주세요."
                    onChange={handleCondInputChange("age")}
                    type="number"
                    disabled={isAgeLimitChecked}
                  />
                  <InputRightElement
                    w={"50px"}
                    mx={3}
                    fontSize={"sm"}
                    color={"gray.500"}
                  >
                    세 이상
                  </InputRightElement>
                </InputGroup>
              )}
              {errors.age && <FormErrorMessage>{errors.age}</FormErrorMessage>}
            </FormControl>
            <FormControl w={"50%"} isInvalid={isError(errors.workPeriod)}>
              <FormLabel {...styles.formLabel} mb={"52px"}>
                근무기간
              </FormLabel>
              <Select
                value={jobsCondition.workPeriod}
                onChange={handleCondInputChange("workPeriod")}
              >
                {workPeriodList.map((workPeriod, index) => (
                  <option key={index} value={workPeriod}>
                    {workPeriod}
                  </option>
                ))}
              </Select>
              {errors.workPeriod && (
                <FormErrorMessage>{errors.workPeriod}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>

          <Flex>
            <FormControl
              w={"45%"}
              mr={"50px"}
              isInvalid={isError(errors.workWeek)}
            >
              <FormLabel {...styles.formLabel}>근무요일</FormLabel>
              <Select
                value={jobsCondition.workWeek}
                onChange={handleCondInputChange("workWeek")}
              >
                {workWeekList.map((workWeek, index) => (
                  <option key={index} value={workWeek}>
                    {workWeek}
                  </option>
                ))}
              </Select>
              {errors.workWeek && (
                <FormErrorMessage>{errors.workWeek}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl w={"50%"} isInvalid={isError(errors.workTime)}>
              <FormLabel {...styles.formLabel}>근무시간</FormLabel>
              <Select
                defaultValue={jobsCondition.workTime}
                onChange={handleCondInputChange("workTime")}
              >
                {workTimeList.map((workTime, index) => (
                  <option key={index} value={workTime}>
                    {workTime}
                  </option>
                ))}
              </Select>
              {errors.workTime && (
                <FormErrorMessage>{errors.workTime}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
          <FormControl isInvalid={isError(errors.content)}>
            <Box mt={"50px"}>
              <Text {...styles.mainFormLabel} mb={"40px"}>
                추가 사항
              </Text>
            </Box>
            <Textarea
              h={"100px"}
              defaultValue={jobs.content}
              onChange={handleInputChange("content")}
            ></Textarea>
            {errors.content && (
              <FormErrorMessage>{errors.content}</FormErrorMessage>
            )}
            <FormHelperText color={"gray"}>
              {checkLength.content}/3,000
            </FormHelperText>
          </FormControl>
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
    </Box>
  );
}
