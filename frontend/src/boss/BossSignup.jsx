import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BossSignup(props) {
  const [newBoss, setNewBoss] = useState({
    email: "",
    password: "",
    name: "",
    address: "",
    phone: "",
  });
  const [emailCheck, setEmailCheck] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");
  const navigate = useNavigate();
  const allFieldsFilled = Object.values(newBoss).every(
    (value) => value.length > 0,
  );
  function handleBossSignupInput(field, e) {
    setNewBoss((prevBoss) => ({ ...prevBoss, [field]: e.target.value }));
  }

  function handleBossSignup() {
    if (allFieldsFilled) {
      axios
        .post("/api/boss/insert", newBoss)
        .then((res) => {
          mytoast("회원가입 되었습니다", "success");
          navigate("/bossLogin");
        })
        .catch((e) => {
          mytoast("입력 값을 확인해주세요.", "error");
          console.log(e);
        })
        .finally(() => {});
    } else {
      mytoast("입력값 중 빈칸이 존재합니다.", "error");
    }
  }

  function handleBossSignupEmailCheck() {
    axios
      .get(`/api/boss/signupCheck?email=${newBoss.email}`)
      .then(() => {
        mytoast("회원가입 가능합니다.", "info");
        setEmailCheck(true);
      })
      .catch((e) => {
        if (e.response.status === 400) {
          mytoast("이미 존재하는 이메일입니다.", "error");
          setEmailCheck(false);
        }
      })
      .finally(() => {});
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
      <Heading>회원가입</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <InputGroup>
              <Input
                value={newBoss.email.trim()}
                onChange={(e) => handleBossSignupInput("email", e)}
                type={"text"}
                placeholder={"abc@abc.com"}
              />
              <InputRightElement w={75} mr={1}>
                <Button
                  onClick={handleBossSignupEmailCheck}
                  bgColor={"blue.400"}
                  color={"white"}
                  fontWeight={"medium"}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormLabel>비밀번호</FormLabel>
            <Input
              value={newBoss.password}
              onChange={(e) => handleBossSignupInput("password", e)}
              type={"password"}
            />
            <FormLabel>비밀번호 확인</FormLabel>
            <Input
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              type={"password"}
            />
            {newBoss.password !== passwordCheck && (
              <FormHelperText>비밀번호 일치여부를 확인해주세요</FormHelperText>
            )}
            <FormLabel>이름</FormLabel>
            <Input
              value={newBoss.name.trim()}
              onChange={(e) => handleBossSignupInput("name", e)}
              type={"text"}
            />
            <FormLabel>주소</FormLabel>
            <Input
              value={newBoss.address}
              onChange={(e) => handleBossSignupInput("address", e)}
              type={"text"}
            />
            <FormLabel>핸드폰 번호</FormLabel>
            <Input
              value={newBoss.phone.trim()}
              onChange={(e) => handleBossSignupInput("phone", e)}
              placeholder={"- 는 제외하고 적어주세요."}
              type={"number"}
            />
            <Flex justifyContent="center">
              <Button
                isDisabled={!emailCheck || !allFieldsFilled}
                onClick={handleBossSignup}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                회원가입
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}

export default BossSignup;
