import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  OrderedList,
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import {
  eduDetailList,
  eduList,
  workPeriodList,
  workTimeList,
  workWeekList,
} from "./jobsConst.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

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

export function JobsRegister() {
  const account = useContext(LoginContext);
  const [storeList, setStoreList] = useState([]);
  const [category, setCategory] = useState("");
  const [jobs, setJobs] = useState({});
  const [isAgeLimitChecked, setIsAgeLimitChecked] = useState(false);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false);

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
  const inputRef = useRef(null);
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const isError = (prop) => prop !== undefined;

  // Create 관련 필요정보 얻기(store,category)
  useEffect(() => {
    axios
      .get("/api/only-boss")
      .then(() => {
        axios.get("/api/jobs/store-names").then((res) => {
          setStoreList(res.data);
        });
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

  // Create
  function handleSubmitCreateJobs() {
    axios
      .postForm("/api/jobs/register", { ...jobs, images })
      .then(() => {
        myToast("공고생성 되었습니다", "success");
        navigate("/jobs/list");
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  }

  // 첨부파일 리스트에서 특정 파일을 삭제하는 함수
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // file 목록
  const imageNameList = [];
  for (let i = 0; i < images.length; i++) {
    imageNameList.push(
      <ListItem key={i}>
        <Flex>
          {images[i].name}
          <Box w={"10px"} h={"5px"} ml={3} onClick={() => handleRemoveImage(i)}>
            <FontAwesomeIcon
              icon={faX}
              bgcolor="gray"
              size="sm"
              color={"red"}
            />
          </Box>
        </Flex>
      </ListItem>,
    );
  }

  // 연령무관 체크박스
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

  function handleSelectChange(storeId) {
    const store = storeList.find((store) => store.id == storeId);
    if (store !== undefined) {
      setJobs({ ...jobs, categoryId: store.categoryId, storeId: store.id });
      setCategory(store.categoryName);
    } else {
      setCategory("");
    }
  }

  function handleCheckboxChange() {
    setChecked(!checked);
  }

  const handleImageChange = (event) => {
    if (images.length !== 0) {
      images.length = 0;
    }
    const newImages = Array.from(event.target.files);
    if (images.length + newImages.length > 5) {
      alert("이미지는 최대 5개까지 입력가능합니다.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...newImages]);
    setJobs({ ...jobs, content: "추가사항 없음" });
  };

  return (
    <>
      {account.isBoss() && (
        <Box w="100%" mx="auto" p={5}>
          <Box
            h={"70px"}
            mb={"70px"}
            bg={"#FF7F3E"}
            color={"white"}
            borderRadius={"10px"}
          >
            <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
              알바 채용 공고 등록
            </Heading>
          </Box>
          <Box w="full" gap={"20px"}>
            <FormControl
              {...styles.formControl}
              isInvalid={isError(errors.title)}
            >
              <FormLabel {...styles.mainFormLabel}>제목</FormLabel>
              <Input
                h={"50px"}
                placeholder="제목을 입력해주세요."
                onChange={handleInputChange("title")}
              />
              {errors.title && (
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              w={"100%"}
              mr={"50px"}
              mb={"50px"}
              isInvalid={isError(errors.storeId)}
            >
              <FormLabel {...styles.mainFormLabel}>지점 선택</FormLabel>
              <Select
                onChange={(e) => handleSelectChange(e.target.value)}
                placeholder={"지점을 선택해주세요."}
              >
                {storeList.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </Select>
              {errors.storeId && (
                <FormErrorMessage mb={4}>{errors.storeId}</FormErrorMessage>
              )}
              <Flex>
                <Box fontWeight={"700"} mr={"10px"}>
                  카테고리 :{" "}
                </Box>
                <Box> {category}</Box>
              </Flex>
            </FormControl>

            <Box mb={"20px"}>
              <Box {...styles.mainFormLabel}>개인 폼 사용여부</Box>
              <Checkbox
                size="lg"
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
                      {images.length !== 0 ? "다시 등록" : "이미지 등록"}
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
                  {imageNameList.length > 0 && (
                    <Box
                      bg={"#E8E8E8"}
                      w={"400px"}
                      p={"10px"}
                      pl={"20px"}
                      borderRadius={"10px"}
                    >
                      <Text fontWeight={"800"} fontSize={"18px"} mb={"5px"}>
                        이미지 목록 (이미지는 순서대로 출력됩니다.)
                      </Text>
                      <OrderedList>{imageNameList}</OrderedList>
                    </Box>
                  )}
                </Flex>
              </FormControl>
            )}

            <>
              <Box mt={"50px"}>
                <Text {...styles.mainFormLabel} mb={"40px"}>
                  모집 조건
                </Text>
                <Divider />
              </Box>
              <Flex mb={"20px"}>
                <FormControl
                  w={"45%"}
                  mr={"50px"}
                  isInvalid={isError(errors.salary)}
                >
                  <FormLabel {...styles.formLabel}>시급</FormLabel>
                  <InputGroup>
                    <InputRightElement mx={3}>원</InputRightElement>
                    <Input
                      type="number"
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
                    placeholder="모집인원을 입력해주세요."
                    onChange={handleInputChange("recruitmentNumber")}
                  />
                  <InputRightElement mx={3}>명</InputRightElement>
                </InputGroup>
                {errors.recruitmentNumber && (
                  <FormErrorMessage>
                    {errors.recruitmentNumber}
                  </FormErrorMessage>
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
                      onChange={handleInputChange("education")}
                      placeholder={"선택해주세요."}
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
                  <FormControl
                    w={"50%"}
                    isInvalid={isError(errors.educationDetail)}
                  >
                    <FormLabel {...styles.formLabel}>학력상세</FormLabel>
                    <Select
                      onChange={handleInputChange("educationDetail")}
                      placeholder={"선택해주세요."}
                    >
                      {eduDetailList.map((eduDetail, index) => (
                        <option key={index} value={eduDetail}>
                          {eduDetail}
                        </option>
                      ))}
                    </Select>
                    {errors.educationDetail && (
                      <FormErrorMessage>
                        {errors.educationDetail}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>

                <FormControl mb={"30px"} isInvalid={isError(errors.preferred)}>
                  <FormLabel {...styles.formLabel}>우대사항</FormLabel>
                  <Input
                    placeholder="우대사항을 입력해주세요."
                    onChange={handleInputChange("preferred")}
                  />
                  {errors.preferred && (
                    <FormErrorMessage>{errors.preferred}</FormErrorMessage>
                  )}
                </FormControl>

                <Flex mb={"30px"}>
                  <FormControl
                    w={"45%"}
                    mr={"50px"}
                    isInvalid={isError(errors.age)}
                  >
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
                        <InputRightElement
                          w={"50px"}
                          mx={3}
                          fontSize={"sm"}
                          color={"gray.500"}
                        >
                          세 이상
                        </InputRightElement>
                        <Input
                          placeholder="연령을 입력해주세요."
                          onChange={handleInputChange("age")}
                          type="number"
                          disabled={isAgeLimitChecked}
                        />
                      </InputGroup>
                    )}
                    {errors.age && (
                      <FormErrorMessage>{errors.age}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl w={"50%"} isInvalid={isError(errors.workPeriod)}>
                    <FormLabel {...styles.formLabel} mb={"52px"}>
                      근무기간
                    </FormLabel>
                    <Select
                      onChange={handleInputChange("workPeriod")}
                      placeholder={"선택해주세요."}
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
                      onChange={handleInputChange("workWeek")}
                      placeholder={"선택해주세요."}
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
                      onChange={handleInputChange("workTime")}
                      placeholder={"선택해주세요."}
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
                </FormControl>
              </Box>
            </>
          </Box>
          <Button
            onClick={handleSubmitCreateJobs}
            bgColor={"#FFA500"}
            color={"white"}
            w="full"
            h={"50px"}
            my={"25px"}
          >
            공고생성
          </Button>
        </Box>
      )}
    </>
  );
}
