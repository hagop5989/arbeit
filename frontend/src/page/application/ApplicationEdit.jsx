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

export function ApplicationEdit() {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const [application, setApplication] = useState({});
  const [resumeList, setResumeList] = useState([]);
  const navigate = useNavigate();

  // Read (resume 리스트 받기)
  useEffect(() => {
    if (account.id) {
      axios.get(`/api/jobs/${id}/apply/edit`).then((res) => {
        setApplication(res.data.application);
        setResumeList(res.data.resumes);
      });
    }
  }, [account.id, id]);

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
      resumeId: selectedResumeId,
      title: selectedResume.title,
      comment: selectedResume.content,
    }));
  };

  function handleSubmitApply() {
    axios
      .put(`/api/jobs/${id}/apply/edit`, { ...application })
      .then((res) => {
        navigate(`/jobs/${id}/apply/select`);
      })
      .catch()
      .finally();
  }

  return (
    <Box>
      <Heading>지원서 수정</Heading>
      <Center w={"50%"} ml={"25%"}>
        <FormControl>
          <FormLabel>공고글 제목</FormLabel>
          <Input value={application.jobsTitle || ""} readOnly />
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
          <Button
            onClick={() => {
              navigate(`/jobs/${id}/apply/select`);
            }}
          >
            이전
          </Button>
          <Button onClick={handleSubmitApply}>수정</Button>
        </FormControl>
      </Center>
    </Box>
  );
}
