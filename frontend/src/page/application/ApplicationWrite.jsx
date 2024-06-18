import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function ApplicationWrite() {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const [application, setApplication] = useState({});
  const [jobsTitle, setJobsTitle] = useState();
  const [resumeList, setResumeList] = useState([]);
  const navigate = useNavigate();

  // Create
  function handleSubmitApply() {
    axios
      .post(`/api/jobs/${id}/apply`, {
        ...application,
        memberId: account.id,
      })
      .then((res) => {
        navigate("/jobs/apply/list");
      })
      .catch()
      .finally();
  }

  // Read (자기 resume 리스트 받기)
  useEffect(() => {
    if (account.id) {
      axios.get(`/api/jobs/${id}/apply`).then((res) => {
        setJobsTitle(res.data.jobsTitle);
        setResumeList(res.data.resumes);
      });
    }
  }, [account.id, id, application.resumeId]);

  const handleInputChange = (field) => (e) => {
    setApplication((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleResumeChange = (e) => {
    const selectedResumeId = e.target.value;
    const selectedResume = resumeList.find(
      (resume) => resume.id === parseInt(selectedResumeId),
    );
    setApplication((prev) => ({
      ...prev,
      jobsId: id,
      resumeId: selectedResumeId,
      title: selectedResume.title,
      comment: selectedResume.content,
    }));
  };

  return (
    <Box>
      <Heading>지원서 작성</Heading>
      <Center w={"50%"} ml={"25%"}>
        <FormControl>
          <FormLabel>공고글 제목</FormLabel>
          <Input defaultValue={jobsTitle} value={jobsTitle} ReadOnly />
          <Divider my={2} />
          <FormLabel>이력서 첨부</FormLabel>
          <Select
            value={application.resumeId || ""}
            onChange={handleResumeChange}
          >
            <option value="" disabled>
              선택
            </option>
            {resumeList.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.title}
              </option>
            ))}
          </Select>
          <Divider my={2} />
          <FormLabel>지원메세지</FormLabel>
          <Textarea
            h={"300px"}
            value={application.comment || ""}
            onChange={handleInputChange("comment")}
          />
          <Button onClick={handleSubmitApply}>지원하기</Button>
          <Button
            onClick={() => {
              navigate("/jobs/apply/list");
            }}
          >
            지원서관리
          </Button>
          <Button
            onClick={() => {
              navigate("/jobs/list");
            }}
          >
            공고목록
          </Button>
        </FormControl>
      </Center>
    </Box>
  );
}
