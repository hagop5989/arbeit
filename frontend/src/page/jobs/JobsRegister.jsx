import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  Textarea,
  UnorderedList,
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
  center: {
    width: "97%",
    margin: "auto",
    display: "block",
  },
};

export function JobsRegister() {
  const account = useContext(LoginContext);
  const printRef = useRef();

  const [storeList, setStoreList] = useState([]);
  const [category, setCategory] = useState("");
  const [jobs, setJobs] = useState({});
  const [isAgeLimitChecked, setIsAgeLimitChecked] = useState(false);
  const [images, setImages] = useState([]);
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
      <li key={i}>
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
      </li>,
    );
  }

  // Create 관련 필요정보 얻기(store,category)
  useEffect(() => {
    axios
      .get("/api/jobs/store-names")
      .then((res) => {
        setStoreList(res.data);
      })
      .catch();
  }, [account.id]);

  // Create
  function handleSubmitCreateJobs() {
    axios
      .postForm("/api/jobs/register", { ...jobs, images })
      .then(() => {
        myToast("공고생성 되었습니다", "success");
        navigate("/jobs/list");
      })
      .catch((e) => {
        myToast("입력 값을 확인해주세요.", "error");
        console.log(e);
      })
      .finally(() => {});
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

  return (
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
        <FormControl {...styles.formControl}>
          <FormLabel {...styles.mainFormLabel}>제목</FormLabel>
          <Input
            h={"50px"}
            placeholder="제목을 입력해주세요."
            onChange={handleInputChange("title")}
          />
        </FormControl>

        <FormControl w={"100%"} mr={"50px"} mb={"50px"}>
          <FormLabel {...styles.mainFormLabel}>지점 선택</FormLabel>
          <Select
            mb={4}
            onChange={(e) => handleSelectChange(e.target.value)}
            placeholder={"지점을 선택해주세요."}
          >
            {storeList.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </Select>
          <Flex>
            <Box fontWeight={"700"} mr={"10px"}>
              카테고리 :{" "}
            </Box>
            <Box> {category}</Box>
          </Flex>
        </FormControl>

        <Box mb={"20px"}>
          <Checkbox
            size="lg"
            colorScheme="orange"
            onChange={handleCheckboxChange}
          >
            개인 폼 사용하기 (알바커넥터 기본 폼을 사용하지 않습니다.)
          </Checkbox>
        </Box>
        {checked && (
          <FormControl {...styles.formControl}>
            <Flex>
              <FormLabel
                textAlign={"center"}
                lineHeight={"50px"}
                fontWeight={"700"}
                fontSize={"20px"}
                w={"150px"}
              >
                이미지 등록
              </FormLabel>
              <Input
                multiple
                type="file"
                p={2}
                h={"50px"}
                value={""} // 추가: file input을 초기화하여 파일 목록이 겹치지 않도록 함
                onChange={(e) => {
                  setImages(e.target.files);
                }}
              />
            </Flex>
            {imageNameList.length > 0 && (
              <Box mt={2}>
                <Text>첨부파일 리스트:</Text>
                <UnorderedList>{imageNameList}</UnorderedList>
              </Box>
            )}
            <Box>미리보기</Box>
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
            <FormControl w={"45%"} mr={"50px"}>
              <FormLabel {...styles.formLabel}>시급</FormLabel>
              <InputGroup>
                <InputRightElement mx={3}>원</InputRightElement>
                <Input
                  mb={4}
                  type="number"
                  placeholder="시급을 입력해주세요."
                  onChange={handleInputChange("salary")}
                />
              </InputGroup>
            </FormControl>

            <FormControl w={"50%"}>
              <FormLabel {...styles.formLabel}>공고 마감일</FormLabel>
              <Input
                mb={4}
                type="datetime-local"
                placeholder="마감일을 선택해주세요."
                onChange={handleInputChange("deadline")}
              />
            </FormControl>
          </Flex>
          <FormControl w={"45%"} mr={"50px"}>
            <FormLabel {...styles.formLabel}>모집인원</FormLabel>
            <InputGroup>
              <InputRightElement mx={3}>명</InputRightElement>
              <Input
                mb={4}
                type="number"
                placeholder="모집인원을 입력해주세요."
                onChange={handleInputChange("recruitmentNumber")}
              />
            </InputGroup>
          </FormControl>
          <Box mb={4}>
            <Box mt={"50px"}>
              <Text {...styles.mainFormLabel} mb={"40px"}>
                세부 항목
              </Text>
              <Divider />
            </Box>
            <Flex w={"100%"} mb={"-30px"}>
              <FormControl w="45%" mr={"50px"} {...styles.formControl}>
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
              </FormControl>
              <FormControl w={"50%"}>
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
              </FormControl>
            </Flex>

            <FormControl mb={"30px"}>
              <FormLabel {...styles.formLabel}>우대사항</FormLabel>
              <Input
                placeholder="우대사항을 입력해주세요."
                onChange={handleInputChange("preferred")}
              />
            </FormControl>

            <Flex mb={"30px"}>
              <FormControl w={"45%"} mr={"50px"}>
                <FormLabel {...styles.formLabel}>연령제한</FormLabel>
                <Checkbox
                  p={1}
                  isChecked={isAgeLimitChecked}
                  onChange={handleAgeLimitChange}
                >
                  <Text fontSize={"sm"}>연령무관</Text>
                </Checkbox>
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
                    placeholder="연령을 입력해주세요."
                    onChange={handleInputChange("age")}
                    type="number"
                    disabled={isAgeLimitChecked}
                  />
                </InputGroup>
              </FormControl>
              <FormControl w={"50%"}>
                <FormLabel {...styles.formLabel} mb={"52px"}>
                  근무기간
                </FormLabel>
                <Select
                  mb={4}
                  onChange={handleInputChange("workPeriod")}
                  placeholder={"선택해주세요."}
                >
                  {workPeriodList.map((workPeriod, index) => (
                    <option key={index} value={workPeriod}>
                      {workPeriod}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>

            <Flex>
              <FormControl w={"45%"} mr={"50px"}>
                <FormLabel {...styles.formLabel}>근무요일</FormLabel>
                <Select
                  mb={4}
                  onChange={handleInputChange("workWeek")}
                  placeholder={"선택해주세요."}
                >
                  {workWeekList.map((workWeek, index) => (
                    <option key={index} value={workWeek}>
                      {workWeek}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl w={"50%"}>
                <FormLabel {...styles.formLabel}>근무시간</FormLabel>
                <Select
                  mb={4}
                  onChange={handleInputChange("workTime")}
                  placeholder={"선택해주세요."}
                >
                  {workTimeList.map((workTime, index) => (
                    <option key={index} value={workTime}>
                      {workTime}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
            <Box mt={"50px"}>
              <Text {...styles.mainFormLabel} mb={"40px"}>
                추가 사항
              </Text>
            </Box>
            <Textarea
              mb={"50px"}
              h={"100px"}
              defaultValue={jobs.content}
              onChange={handleInputChange("content")}
            ></Textarea>
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
  );
}
