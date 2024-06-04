import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";

function BossLogin(props) {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const [loginBoss, setLoginBoss] = useState({
    email: "",
    password: "",
  });
  const allFieldsFilled = Object.values(loginBoss).every(
    (value) => value.length > 0,
  );

  function handleLoginBoss() {
    if (allFieldsFilled) {
      axios
        .post("/api/boss/token", loginBoss)
        .then((res) => {
          account.login(res.data.token);
          mytoast("로그인 되었습니다", "success");
          navigate("/");
        })
        .catch((e) => {
          if (e.response.status === 403) {
            mytoast(`로그인 실패 !\n 입력 값을 확인 해주세요.`, "error");
          }
        })
        .finally(() => {});
    } else {
      mytoast("입력값 중 빈칸이 존재합니다.", "error");
    }
  }

  function handleLoginBossInput(field, e) {
    setLoginBoss((prevBoss) => ({
      ...prevBoss,
      [field]: e.target.value,
    }));
  }

  const toast = useToast();
  function mytoast(text, status) {
    toast({
      description: <Box whiteSpace="pre-line">{text}</Box>,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  return (
    <Box>
      <Heading>로그인</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input
              value={loginBoss.email.trim()}
              onChange={(e) => handleLoginBossInput("email", e)}
              type={"text"}
              placeholder={"abc@abc.com"}
            />
            <FormLabel>비밀번호</FormLabel>
            <Input
              value={loginBoss.password}
              onChange={(e) => handleLoginBossInput("password", e)}
              type={"password"}
            />

            <Flex justifyContent="center">
              <Button
                onClick={handleLoginBoss}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                로그인
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}

export default BossLogin;
