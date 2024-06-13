import {
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  List,
  Select,
  Spinner,
  Switch,
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
} from "./conditionConst.jsx";

export function JobsView() {
  const { id } = useParams();

  const [editJobs, setEditJobs] = useState({});
  const [jobsCondition, setJobsCondition] = useState({});
  const [isAgeLimitChecked, setIsAgeLimitChecked] = useState(false);
  const [storeList, setStoreList] = useState([]);

  const fileNameList = [];
  const [fileList, setFileList] = useState([]);
  const [addFileList, setAddFileList] = useState([]);
  const [removeFileList, setRemoveFileList] = useState([]);

  const toast = useToast();
  const navigate = useNavigate();

  // Read
  useEffect(() => {
    axios
      .get(`/api/jobs/${id}`)
      .then((res) => {
        setStoreList(res.data.storeList);
        setEditJobs(res.data.jobs);
        setJobsCondition(res.data.jobsCondition);
        setFileList(res.data.jobs.fileList || []);
        delete res.data.jobs.fileList;
        console.log(editJobs.storeName);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          myToast("해당 게시물이 존재하지 않습니다", "error");
          navigate("/jobs/list");
        }
      });
  }, [id, navigate]);

  // Update
  function handleSubmitEditJobs() {
    axios
      .putForm("/api/jobs/update", {
        ...editJobs,
        ...jobsCondition,
        removeFileList,
        addFileList,
      })
      .then((res) => {
        myToast("수정 완료 되었습니다", "success");
        navigate("/jobs/list");
      })
      .catch(() => {
        myToast("수정실패", "error");
      })
      .finally(() => {});
  }

  // Delete
  function handleSubmitDeleteJobs() {
    axios
      .delete(`/api/jobs/delete?id=${id}`)
      .then((res) => {
        myToast("삭제 완료 되었습니다", "success");
        navigate("/jobs/list");
      })
      .catch(() => {
        myToast("삭제실패", "error");
      })
      .finally(() => {});
  }

  // Input 값 관리
  function handleEditInput(field, e) {
    const value = e.target.value;
    if (field === "storeName") {
      const [storeName, categoryId] = value.split("-cateNo:");
      console.log(storeName);
      const store = storeList.find(
        (store) =>
          store.name === storeName && store.categoryId === parseInt(categoryId),
      );
      setEditJobs((prev) => ({
        ...prev,
        storeName: storeName,
        storeId: store ? store.id : null,
        categoryName: store ? store.cateName : "",
        categoryId: store ? store.categoryId : "",
      }));
    } else {
      setEditJobs((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  }

  // condition input 관리
  const handleConditionInput = (field) => (e) => {
    setJobsCondition((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // toast 커스텀
  function myToast(text, status) {
    toast({
      description: <Box whiteSpace="pre-line">{text}</Box>,
      status: status,
      position: "top",
      duration: "700",
    });
  }
  // 스피너
  if (editJobs === null) {
    return <Spinner />;
  }

  /* 파일 관련 함수들 (handleRemoveSwitchChange 포함) */

  // 중복체크
  for (let addFile of addFileList) {
    let duplicate = false;
    for (let file of fileList) {
      if (file.name === addFile.name) {
        duplicate = true;
        break;
      }
    }
    // 입력한 fileNameList 관리
    fileNameList.push(
      <Flex key={addFile.name}>
        <Text fontSize={"md"} mr={3}>
          {addFile.name}
        </Text>
        <Box>{duplicate && <Badge colorScheme="red">override</Badge>}</Box>
      </Flex>,
    );
  }

  // file 삭제 스위치
  function handleRemoveSwitchChange(name, checked) {
    if (checked) {
      setRemoveFileList([...removeFileList, name]);
    } else {
      setRemoveFileList(removeFileList.filter((item) => item !== name));
    }
  }
  // 연령무관 체크박스
  const handleAgeLimitChange = (e) => {
    const isChecked = e.target.checked;
    setIsAgeLimitChecked(isChecked);
    setJobsCondition((prev) => ({
      ...prev,
      age: isChecked ? 0 : prev.age,
    }));
  };

  return (
    <Box>
      <Heading>알바공고 상세페이지</Heading>
      <Center w={"50%"} ml={"25%"}>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            value={editJobs.title}
            onChange={(e) => handleEditInput("title", e)}
            type={"text"}
          />

          <FormLabel>내용</FormLabel>
          <Textarea
            value={editJobs.content}
            onChange={(e) => handleEditInput("content", e)}
            type={"text"}
          />
          <FormLabel>시급</FormLabel>
          <Input
            value={editJobs.salary}
            onChange={(e) => handleEditInput("salary", e)}
            type={"number"}
          />

          <FormLabel>마감일</FormLabel>
          <Input
            value={editJobs.deadline}
            onChange={(e) => handleEditInput("deadline", e)}
            type={"datetime-local"}
          />

          <FormLabel>모집인원</FormLabel>
          <Input
            value={editJobs.recruitmentNumber}
            onChange={(e) => handleEditInput("recruitmentNumber", e)}
            type={"number"}
          />
          <FormLabel>카테고리(자동선택)</FormLabel>
          <Input value={editJobs.categoryName} readOnly />

          <FormLabel>가게명</FormLabel>
          <Select
            value={
              editJobs.storeName
                ? `${editJobs.storeName}-cateNo:${editJobs.categoryId}`
                : ""
            }
            onChange={(e) => handleEditInput("storeName", e)}
          >
            {storeList.map((store) => (
              <option
                key={store.id}
                value={`${store.name}-cateNo:${store.categoryId}`}
              >
                {store.name}-cateNo:{store.categoryId}
              </option>
            ))}
          </Select>

          <FormLabel>작성자</FormLabel>
          <Input
            value={editJobs.memberName}
            onChange={(e) => handleEditInput("memberName", e)}
            type={"text"}
            readOnly
          />

          <FormLabel>첨부사진</FormLabel>
          <Input
            multiple
            type="file"
            accept="image/*"
            onChange={(e) => setAddFileList(e.target.files)}
          />
          {fileNameList.length > 0 && (
            <>
              <Heading size="md">추가 선택된 파일 목록</Heading>
              <List>{fileNameList}</List>
            </>
          )}

          <Box>
            {fileList &&
              fileList.map((file) => (
                <Box key={file.name}>
                  <Switch
                    onChange={(e) =>
                      handleRemoveSwitchChange(file.name, e.target.checked)
                    }
                  />
                  <Image src={file.src} />
                </Box>
              ))}
          </Box>
          <Box>
            <Text>상세 조건</Text>
            <Box>
              <FormLabel>학력</FormLabel>
              <Select
                value={jobsCondition.education || ""}
                onChange={handleConditionInput("education")}
                type={"text"}
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

              <FormLabel>학력상세</FormLabel>
              <Select
                value={jobsCondition.educationDetail || ""}
                onChange={handleConditionInput("educationDetail")}
                type={"text"}
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

              <FormLabel>연령제한</FormLabel>
              <Checkbox
                isChecked={isAgeLimitChecked}
                onChange={handleAgeLimitChange}
              >
                연령무관
              </Checkbox>

              <Input
                value={jobsCondition.age}
                onChange={handleConditionInput("age")}
                type={"number"}
                disabled={isAgeLimitChecked}
              />

              <FormLabel>우대사항</FormLabel>
              <Input
                value={jobsCondition.preferred || ""}
                onChange={handleConditionInput("preferred")}
                type={"text"}
              />

              <FormLabel>근무기간</FormLabel>
              <Select
                value={jobsCondition.workPeriod || ""}
                onChange={handleConditionInput("workPeriod")}
                type={"text"}
              >
                <option value="" disabled>
                  선택
                </option>
                {workPeriodList.map((workPeriod, index) => (
                  <option key={index} value={workPeriod}>
                    {workPeriod}
                  </option>
                ))}
              </Select>

              <FormLabel>근무요일</FormLabel>
              <Select
                value={jobsCondition.workWeek || ""}
                onChange={handleConditionInput("workWeek")}
                type={"text"}
              >
                <option value="" disabled>
                  선택
                </option>
                {workWeekList.map((workWeek, index) => (
                  <option key={index} value={workWeek}>
                    {workWeek}
                  </option>
                ))}
              </Select>

              <FormLabel>근무시간</FormLabel>
              <Select
                value={jobsCondition.workTime || ""}
                onChange={handleConditionInput("workTime")}
                type={"text"}
              >
                <option value="" disabled>
                  선택
                </option>
                {workTimeList.map((workTime, index) => (
                  <option key={index} value={workTime}>
                    {workTime}
                  </option>
                ))}
              </Select>
            </Box>
          </Box>
          <Flex justifyContent="center">
            <Button>지원</Button>
            <Button onClick={handleSubmitEditJobs}>수정</Button>
            <Button onClick={handleSubmitDeleteJobs}>삭제</Button>
            <Button onClick={() => navigate("/jobs/list")}>이전</Button>
          </Flex>
        </FormControl>
      </Center>
    </Box>
  );
}
