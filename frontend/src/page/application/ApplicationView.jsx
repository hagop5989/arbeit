import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";

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
          .get(`/api/jobs/${id}/apply/select`)
          .then((res) => {
            setJobsTitle(res.data.jobsTitle);
            setApplication(res.data);
          })
          .catch((err) => {
            if (err.response.status === 403 || 404) {
              navigate("/");
            }
          });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [account.id, id, application.resumeId]);

  return (
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Heading mb={"10px"} p={1}>
        지원서 보기
      </Heading>
      <Divider mb={"40px"} borderWidth={"2px"} />
      <Box>
        <FormControl>
          <FormLabel>공고글 제목</FormLabel>
          <Input defaultValue={jobsTitle} value={jobsTitle} ReadOnly />
          <Divider my={2} />
          <FormLabel>이력서 첨부</FormLabel>
          <Input value={application.title || ""} ReadOnly />
          <Divider my={2} />
          <FormLabel>지원메세지</FormLabel>
          <Textarea h={"300px"} value={application.comment || ""} ReadOnly />
          <Flex gap={"10px"} my={8}>
            <Button
              onClick={() => {
                navigate("/jobs/apply/list");
              }}
              w={"50%"}
              bgColor={"gray.500"}
              color={"white"}
            >
              목록
            </Button>
            <Button
              onClick={() => {
                navigate(`/jobs/${id}/apply/edit`);
              }}
              w={"50%"}
              bgColor={"#FF7F3E"}
              color={"white"}
            >
              수정하기
            </Button>
          </Flex>
        </FormControl>
      </Box>
    </Box>
  );
}
