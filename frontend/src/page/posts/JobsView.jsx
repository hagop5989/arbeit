import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function JobsView(props) {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [editJobs, setEditJobs] = useState({
    title: "default",
    content: "default",
    storeName: "default",
    memberId: account.id,
    memberName: "",
  });
  const allFieldsFilled =
    editJobs.title.length > 0 &&
    editJobs.content.length > 0 &&
    editJobs.storeName.length;

  function handleEditInput(field, e) {
    setEditJobs((prevJobs) => ({ ...prevJobs, [field]: e.target.value }));
  }

  function handleSubmitEditJobs() {
    if (allFieldsFilled) {
      axios
        .put("/api/jobs/update", editJobs)
        .then((res) => {
          myToast("수정 완료 되었습니다", "success");
        })
        .catch(() => {
          myToast("수정실패", "error");
        })
        .finally(() => {});
    } else {
      console.log(allFieldsFilled);
      console.log(editJobs);
      myToast("입력값 중 빈칸이 존재합니다.", "error");
    }
  }

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

  const toast = useToast();

  function myToast(text, status) {
    toast({
      description: <Box whiteSpace="pre-line">{text}</Box>,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  // useEffect(() => {
  //   axios
  //     .get(`/api/jobs/${id}`)
  //     .then((res) => {
  //       setEditJobs(res.data);
  //     })
  //     .catch((err) => {
  //       if (err.response.status === 404) {
  //         toast({
  //           status: "info",
  //           description: "해당 게시물이 존재하지 않습니다.",
  //           position: "top",
  //         });
  //         navigate("/api/jobs/list");
  //       }
  //     });
  // }, []);

  return (
    <Box>
      <Heading>알바공고 상세페이지 </Heading>
      <Center>{/*<JobsList2 />*/}</Center>
      <Flex justifyContent={"center"} alignItems={"center"}>
        {/*<JobsList />*/}

        <Center w={"30%"}>
          <FormControl>
            <FormLabel>제목</FormLabel>

            <Input
              value={editJobs.title}
              onChange={(e) => handleEditInput("title", e)}
              type={"text"}
              placeholder={"제목을 입력해주세요"}
            />

            <FormLabel>내용</FormLabel>
            <Textarea
              value={editJobs.content}
              onChange={(e) => handleEditInput("content", e)}
              type={"text"}
              placeholder={"내용을 입력해주세요"}
            />
            <FormLabel>가게명</FormLabel>
            <Input
              value={editJobs.storeName}
              onChange={(e) => handleEditInput("storeName", e)}
              type={"text"}
              readOnly
            />
            <FormLabel>작성자</FormLabel>
            <Input value={account.name} type={"text"} readOnly />

            <Flex justifyContent="center">
              <Button
                // isDisabled={!allFieldsFilled}
                // onClick={handleSubmitEditJobs}
                colorScheme={"teal"}
                w={120}
                my={3}
              >
                지원
              </Button>
              <Button
                isDisabled={!allFieldsFilled}
                onClick={handleSubmitEditJobs}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                수정
              </Button>
              <Button
                onClick={handleSubmitDeleteJobs}
                colorScheme={"red"}
                w={120}
                my={3}
              >
                삭제
              </Button>
              <Button
                onClick={() => navigate("/jobs/list")}
                colorScheme={"green"}
                w={120}
                my={3}
              >
                이전
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}

// Example usage
export function JobsList() {
  const job = {
    title:
      "[월최대410만가능]쿠팡CLS헬퍼리더채용(현장운영인력관리/물류관리자성장)",
    logo: "https://img11.albamon.kr/trans/150x60/2020-08-21/e31du74k1jai3zj.gif",
    hashtags: "#초간단즉시지원 #정규직전환가능 #셔틀제공",
    description:
      "4대보험 | 설립6년차 | 19년1월부터이용중 | 기업인증 | 채용1,532회",
    salary: "4,100,000원",
    duration: "1년이상",
    schedule: "요일협의",
    time: "시간협의",
  };

  function JobDetail({ job }) {
    return (
      <Box
        w={"full"}
        maxW={"800px"}
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        border={"1px solid lightgray"}
        m="2"
      >
        <Box
          w={"full"}
          p={5}
          borderBottomWidth="1px"
          borderBottomColor="gray.200"
          mb={5}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold">
              {job.title}
            </Text>
            <Image
              w={"150px"}
              h={"60px"}
              src={job.logo}
              alt={job.title}
              objectFit="cover"
            />
          </Flex>
          <Text fontSize="sm" color="gray.500" mt={2}>
            {job.hashtags}
          </Text>
          <Text fontSize="md" mt={2}>
            {job.description}
          </Text>
        </Box>

        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              {job.salary}
            </Text>
            <Text fontSize="sm" color="gray.500">
              월급
            </Text>
          </Box>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              {job.duration}
            </Text>
            <Text fontSize="sm" color="gray.500">
              기간
            </Text>
          </Box>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              {job.schedule}
            </Text>
            <Text fontSize="sm" color="gray.500">
              요일
            </Text>
          </Box>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              {job.time}
            </Text>
            <Text fontSize="sm" color="gray.500">
              시간
            </Text>
          </Box>
        </Grid>
      </Box>
    );
  }

  return (
    <Center>
      <JobDetail job={job} />
    </Center>
  );
}

export default JobsView;
