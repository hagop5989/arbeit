import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function BossNav() {
  const navigate = useNavigate();

  return (
    <>
      <Box onClick={() => navigate("/boss/Signup")}>/bossSignup</Box>
      <Box onClick={() => navigate("/boss/Login")}>/bossLogin</Box>
      <Box onClick={() => navigate("/boss/Edit")}>/bossEdit</Box>
      <Box onClick={() => navigate(`/jobs/create`)}>/jobsCreate</Box>
      <Box onClick={() => navigate(`/jobs/list`)}>/jobsList</Box>
      <Box onClick={() => navigate(`/member/resume/write`)}>/ResumeWrite</Box>
      <Box onClick={() => navigate(`/member/resume/list`)}>/ResumeList</Box>
    </>
  );
}
