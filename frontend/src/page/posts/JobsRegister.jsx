import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
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
import { LoginContext } from "../../component/LoginProvider.jsx";
import {
  eduDetailList,
  eduList,
  workPeriodList,
  workTimeList,
  workWeekList,
} from "./jobsConst.jsx";
import { JobsInputForm } from "../../path/JobsInputForm.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

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
    const newJobs = {
      ...jobs,
      content: ".",
    };
    axios
      .postForm("/api/jobs/register", { ...newJobs, images })
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

  return (
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Heading mb={"10px"} p={1}>
        알바공고 생성
      </Heading>
      <Divider mb={"40px"} borderWidth={"2px"} />
      <Box w="full" gap={"20px"} display={"flex"} flexDirection={"column"}>
        <Box>
          <FormLabel fontSize={"3xl"}>제목</FormLabel>
          <Input
            h={"50px"}
            placeholder="제목을 입력해주세요."
            onChange={handleInputChange("title")}
          />
        </Box>

        <Box>
          <FormLabel fontSize={"3xl"}>공고내역</FormLabel>
          <Checkbox
            checked={checked}
            m={2}
            onChange={(e) => setChecked(e.target.checked)}
          >
            일반텍스트로 전환
          </Checkbox>
          {/* Test3 컴포넌트를 사용하는 부분 */}
          {!checked && (
            <JobsInputForm ref={printRef} w={"700px"} setImages={setImages} />
          )}
          {!checked || (
            <Textarea
              mb={2}
              placeholder={`공고내용을 입력해주세요. \n 예) OO 가게 신규 알바모집 (초보환영)`}
              onChange={handleInputChange("content")}
            />
          )}
        </Box>

        <Box mb={8}>
          <Text fontSize={"3xl"}>이미지 등록</Text>
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
          {imageNameList.length > 0 && (
            <Box mt={2}>
              <Text>첨부파일 리스트:</Text>
              <UnorderedList>{imageNameList}</UnorderedList>
            </Box>
          )}
        </Box>

        <Flex gap={"10px"}>
          <Box w={"50%"}>
            <FormLabel fontSize={"3xl"}>시급</FormLabel>
            <InputGroup>
              <InputRightElement mx={3}>원</InputRightElement>
              <Input
                mb={4}
                type="number"
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
              placeholder="모집인원을 입력해주세요."
              onChange={handleInputChange("recruitmentNumber")}
            />
          </InputGroup>
        </Box>

        <Flex gap={"10px"}>
          <Box w={"50%"}>
            <FormLabel fontSize={"3xl"}>가게명</FormLabel>
            <Select
              mb={4}
              onChange={(e) => handleSelectChange(e.target.value)}
              placeholder={"선택해주세요."}
            >
              {storeList.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </Select>
          </Box>
          <Box w={"50%"}>
            <FormLabel fontSize={"3xl"}>카테고리(자동선택)</FormLabel>
            <Input
              mb={4}
              defaultValue={category}
              readOnly
              placeholder="자동선택"
            />
          </Box>
        </Flex>

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
              <Select onChange={handleInputChange("education")}>
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
              <Select onChange={handleInputChange("educationDetail")}>
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
                  placeholder="연령을 입력해주세요."
                  onChange={handleInputChange("age")}
                  type="number"
                  disabled={isAgeLimitChecked}
                />
              </InputGroup>
            </Box>

            <Box w={"50%"}>
              <FormLabel fontSize={"3xl"}>근무기간</FormLabel>
              <Select mb={4} onChange={handleInputChange("workPeriod")}>
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
              <Select mb={4} onChange={handleInputChange("workWeek")}>
                {workWeekList.map((workWeek, index) => (
                  <option key={index} value={workWeek}>
                    {workWeek}
                  </option>
                ))}
              </Select>
            </Box>

            <Box w={"50%"}>
              <FormLabel fontSize={"3xl"}>근무시간</FormLabel>
              <Select mb={4} onChange={handleInputChange("workTime")}>
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
