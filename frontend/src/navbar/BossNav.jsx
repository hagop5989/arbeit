import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function BossNav() {
  const navigate = useNavigate();

  return (
    <>
      <Box onClick={() => navigate("/bossSignup")}>/bossSignup</Box>
      <Box onClick={() => navigate("/bossLogin")}>/bossLogin</Box>
      <Box onClick={() => navigate("/bossEdit")}>/bossEdit</Box>
      <Box onClick={() => navigate(`/bossAlbaPost`)}>/bossAlbaPost</Box>
      <Box onClick={() => navigate(`/bossAlbaPostCreate`)}>
        /bossAlbaPostCreate
      </Box>
      <Box onClick={() => navigate(`/bossAlbaPostManage`)}>
        /bossAlbaPostManage
      </Box>
    </>
  );
}
