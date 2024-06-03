import React from "react";
import { Box, Button, Heading } from "@chakra-ui/react";

function Boss(props) {
  return (
    <Box>
      <Heading>보스페이지</Heading>
      <Button onClick={() => {}}>
        <a href={"/BossSignup"}>회원가입</a>
      </Button>
      <Button onClick={() => {}}>
        <a href={"/BossLogin"}>로그인</a>
      </Button>
      <Button onClick={() => {}}>
        <a href={"/BossEdit"}>정보수정</a>
      </Button>
    </Box>
  );
}

export default Boss;
