import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
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

export function JobsRegister() {
  const account = useContext(LoginContext);

  const [storeList, setStoreList] = useState([]);
  const [category, setCategory] = useState("");
  const [jobs, setJobs] = useState({});
  const [isAgeLimitChecked, setIsAgeLimitChecked] = useState(false);
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

  // file 목록
  const imageNameList = [];
  for (let i = 0; i < images.length; i++) {
    imageNameList.push(<li key={i}>{images[i].name}</li>);
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

  return (
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Heading mb={"50px"}>알바공고 생성</Heading>
      <Box w="full" gap={"15px"} display={"flex"} flexDirection={"column"}>
        <Box>
          <FormLabel fontSize={"3xl"}>제목</FormLabel>
          <Input
            mb={4}
            placeholder="제목을 입력해주세요."
            onChange={handleInputChange("title")}
          />
        </Box>

        <Box>
          <FormLabel fontSize={"3xl"}>내용</FormLabel>
          <Textarea
            mb={4}
            placeholder="내용을 입력해주세요."
            onChange={handleInputChange("content")}
          />
        </Box>

        <Flex gap={"20px"}>
          <Box w={"50%"}>
            <FormLabel fontSize={"3xl"}>시급</FormLabel>
            <Input
              mb={4}
              type="number"
              placeholder="시급을 입력해주세요."
              onChange={handleInputChange("salary")}
            />
          </Box>

          <Box w={"50%"}>
            <FormLabel fontSize={"3xl"}>마감일</FormLabel>
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
          <Input
            mb={4}
            type="number"
            placeholder="모집인원을 입력해주세요."
            onChange={handleInputChange("recruitmentNumber")}
          />
        </Box>

        <Box>
          <FormLabel fontSize={"3xl"}>가게명</FormLabel>
          <Select mb={4} onChange={(e) => handleSelectChange(e.target.value)}>
            <option value={""} disabled>
              선택
            </option>
            {storeList.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </Select>
        </Box>
        <Box>
          <FormLabel fontSize={"3xl"}>카테고리(자동선택)</FormLabel>
          <Input
            mb={4}
            defaultValue={category}
            readOnly
            placeholder="자동선택"
          />
        </Box>

        <Box mb={4}>
          <Text fontSize={"3xl"}>사진첨부</Text>
          <Input
            multiple
            type="file"
            placeholder="사진을 첨부해주세요."
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

        <Box mb={4}>
          <Box mt={"50px"}>
            <Text fontSize="3xl" mb={2}>
              상세 조건
            </Text>
            <Divider mb={4} />
          </Box>
          <Flex gap={4}>
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
            <Box w="50%" maxW="480px">
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
            <FormLabel fontSize={"3xl"}>연령제한</FormLabel>
            <Checkbox
              mb={4}
              isChecked={isAgeLimitChecked}
              onChange={handleAgeLimitChange}
            >
              연령무관
            </Checkbox>

            <Input
              mb={4}
              placeholder="연령을 입력해주세요."
              onChange={handleInputChange("age")}
              type="number"
              disabled={isAgeLimitChecked}
            />
          </Box>

          <Box>
            <FormLabel fontSize={"3xl"}>우대사항</FormLabel>
            <Input
              mb={4}
              placeholder="우대사항을 입력해주세요."
              onChange={handleInputChange("preferred")}
            />
          </Box>

          <Box>
            <FormLabel fontSize={"3xl"}>근무기간</FormLabel>
            <Select mb={4} onChange={handleInputChange("workPeriod")}>
              {workPeriodList.map((workPeriod, index) => (
                <option key={index} value={workPeriod}>
                  {workPeriod}
                </option>
              ))}
            </Select>
          </Box>

          <Box>
            <FormLabel fontSize={"3xl"}>근무요일</FormLabel>
            <Select mb={4} onChange={handleInputChange("workWeek")}>
              {workWeekList.map((workWeek, index) => (
                <option key={index} value={workWeek}>
                  {workWeek}
                </option>
              ))}
            </Select>
          </Box>

          <Box>
            <FormLabel fontSize={"3xl"}>근무시간</FormLabel>
            <Select mb={4} onChange={handleInputChange("workTime")}>
              {workTimeList.map((workTime, index) => (
                <option key={index} value={workTime}>
                  {workTime}
                </option>
              ))}
            </Select>
          </Box>
        </Box>
      </Box>
      <Button colorScheme="blue" w="full" onClick={handleSubmitCreateJobs}>
        공고생성
      </Button>
    </Box>
  );
}
