import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  FormControl,
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
    <Box w={"100%"}>
      <Heading>알바공고 생성</Heading>
      <Center>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input onChange={handleInputChange("title")} />

          <FormLabel>내용</FormLabel>
          <Textarea onChange={handleInputChange("content")} />

          <FormLabel>시급</FormLabel>
          <Input type={"number"} onChange={handleInputChange("salary")} />

          <FormLabel>마감일</FormLabel>
          <Input
            onChange={handleInputChange("deadline")}
            type={"datetime-local"}
          />

          <FormLabel>모집인원</FormLabel>
          <Input
            type={"number"}
            onChange={handleInputChange("recruitmentNumber")}
          />

          <FormLabel>가게명</FormLabel>
          <Select
            onChange={(e) => handleSelectChange(e.target.value)}
            placeholder={"선택해주세요"}
          >
            {storeList.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </Select>

          <FormLabel>카테고리(자동선택)</FormLabel>
          <Input defaultValue={category} readOnly />

          <Box>
            <Text>사진첨부</Text>
            <Input
              multiple
              type={"file"}
              onChange={(e) => {
                setImages(e.target.files);
              }}
            />
            {imageNameList.length > 0 && (
              <Box>
                <Text>첨부파일 리스트:</Text>
                <UnorderedList>{imageNameList}</UnorderedList>
              </Box>
            )}
          </Box>
          <Box>
            <Text fontSize={"2xl"}>상세 조건</Text>
            <Divider />
            <Flex gap={"50px"}>
              <Box w={"50%"}>
                <FormLabel>최소학력</FormLabel>
                <Select onChange={handleInputChange("education")}>
                  {eduList.map((education, index) => (
                    <option key={index} value={education}>
                      {education}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box w={"50%"}>
                <FormLabel>학력상세</FormLabel>
                <Select onChange={handleInputChange("educationDetail")}>
                  {eduDetailList.map((eduDetail, index) => (
                    <option key={index} value={eduDetail}>
                      {eduDetail}
                    </option>
                  ))}
                </Select>
              </Box>
            </Flex>

            <FormLabel>연령제한</FormLabel>
            <Checkbox
              isChecked={isAgeLimitChecked}
              onChange={handleAgeLimitChange}
            >
              연령무관
            </Checkbox>

            <Input
              onChange={handleInputChange("age")}
              type={"number"}
              disabled={isAgeLimitChecked}
            />

            <FormLabel>우대사항</FormLabel>
            <Input onChange={handleInputChange("preferred")} />
            <FormLabel>근무기간</FormLabel>
            <Select
              onChange={handleInputChange("workPeriod")}
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
              onChange={handleInputChange("workWeek")}
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
              onChange={handleInputChange("workTime")}
              placeholder={"시간을 정해주세요."}
            >
              {workTimeList.map((workTime, index) => (
                <option key={index} value={workTime}>
                  {workTime}
                </option>
              ))}
            </Select>
          </Box>
        </FormControl>
      </Center>
      <Button onClick={handleSubmitCreateJobs}>공고생성</Button>
    </Box>
  );
}
