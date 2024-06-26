import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";

const styles = {
  text: {
    fontSize: "16px",
    fontWeight: "600",
    mr: "20px",
  },
};
export function ApplicationView() {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const [application, setApplication] = useState({});
  const [jobsTitle, setJobsTitle] = useState();
  const navigate = useNavigate();
  const toast = useToast();

  // Read (리스트 받기)
  useEffect(() => {
    axios
      .get("/api/only-login")
      .then(() => {
        axios
          .get(`/api/jobs/${id}/application`)
          .then((res) => {
            setJobsTitle(res.data.jobsTitle);
            setApplication(res.data);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [account.id, id, application.resumeId]);

  return (
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Box>지원한 공고 : {application.title}</Box>
      <Box
        h={"70px"}
        mb={"30px"}
        bg={"#FF7F3E"}
        color={"white"}
        borderRadius={"10px"}
      >
        <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
          000 님의 지원서
        </Heading>
      </Box>
      <Box>
        <Center
          border={"2px solid #E0E0E0"}
          h={"100px"}
          borderRadius={"10px"}
          mb={"20px"}
        >
          <Box>
            <Box {...styles.text} mb={"5px"}>
              이름: 하정현
            </Box>
            <Flex>
              <Box {...styles.text}>연락처: 010-7178-2025</Box>
              <Box {...styles.text}>이메일: aszx2024@naver.com</Box>
            </Flex>
          </Box>
          <Button
            colorScheme={"yellow"}
            ml={"20px"}
            onClick={() => navigate(`/resume/${application.resumeId}`)}
          >
            이력서 확인하기
          </Button>
        </Center>
        <Box>
          <Box
            h={"300px"}
            border={"2px solid #E0E0E0"}
            borderRadius={"10px"}
            p={"20px"}
            fontSize={"17px"}
          >
            <Box
              {...styles.text}
              mb={"10px"}
              borderBottom={"1px solid #E0E0E0"}
            >
              지원메세지
            </Box>
            {application.comment}
          </Box>
          <Flex gap={"10px"} my={8}>
            <Spacer />
            <Button
              onClick={() => {
                navigate("/jobs/apply/list");
              }}
              w={"150px"}
              bgColor={"gray.500"}
              color={"white"}
            >
              목록
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
