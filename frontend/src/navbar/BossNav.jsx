import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function BossNav() {
  const navigate = useNavigate();

  return (
    <>
      <Box onClick={() => navigate(`/jobs/create`)}>공고생성</Box>
      <Box onClick={() => navigate(`/jobs/list`)}>공고리스트</Box>
      <Box onClick={() => navigate(`/resume/register`)}>이력서등록</Box>
      <Box onClick={() => navigate(`/resume/list`)}>이력서리스트</Box>
      <Box onClick={() => navigate(`/jobs/apply/list`)}>지원내역(알바)</Box>
      <Box onClick={() => navigate(`/jobs/management/list`)}>
        지원내역(사장)
      </Box>
    </>
  );
}
