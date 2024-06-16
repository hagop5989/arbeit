import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function ApplicationView() {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const [application, setApplication] = useState({});
  const [jobsTitle, setJobsTitle] = useState();
  const navigate = useNavigate();

  // Read (리스트 받기)
  useEffect(() => {
    if (account.id) {
      axios.get(`/api/jobs/${id}/apply/select`).then((res) => {
        setJobsTitle(res.data.jobsTitle);
        setApplication(res.data);
      });
    }
  }, [account.id, id, application.resumeId]);

  return (
    <Box>
      <Heading>지원서 보기</Heading>
      <Center w={"50%"} ml={"25%"}>
        <FormControl>
          <FormLabel>공고글 제목</FormLabel>
          <Input defaultValue={jobsTitle} value={jobsTitle} ReadOnly />
          <Divider my={2} />
          <FormLabel>이력서 첨부</FormLabel>
          <Input value={application.title || ""} ReadOnly />
          <Divider my={2} />
          <FormLabel>지원메세지</FormLabel>
          <Textarea h={"300px"} value={application.comment || ""} ReadOnly />
          <Button
            onClick={() => {
              navigate("/jobs/apply/list");
            }}
          >
            목록
          </Button>
          <Button
            onClick={() => {
              navigate(`/jobs/${id}/apply/edit`);
            }}
          >
            수정하기
          </Button>
        </FormControl>
      </Center>
    </Box>
  );
}
