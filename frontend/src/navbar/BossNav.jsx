import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function BossNav() {
  const navigate = useNavigate();

  return (
    <>
      <Box onClick={() => navigate(`/jobs/create`)}>/jobsCreate</Box>
      <Box onClick={() => navigate(`/jobs/list`)}>/jobsList</Box>
      <Box onClick={() => navigate(`/resume/write`)}>/ResumeWrite</Box>
      <Box onClick={() => navigate(`/resume/list`)}>/ResumeList</Box>
      <Box onClick={() => navigate(`/resume/edit`)}>/ResumeEdit(Test 중)</Box>
    </>
  );
}
