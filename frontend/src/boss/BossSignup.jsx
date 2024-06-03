import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Heading,
  Input,
} from "@chakra-ui/react";

function BossSignup(props) {
  const [newMember, setNewMember] = useState({
    nickName: "",
    password: "",
    email: "",
  });
  return (
    <Box>
      <Heading>회원가입</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            이메일
            <Input placeholder={"abc@abc.com"} />
            비밀번호
            <Input type={"password"} />
            비밀번호 확인
            <Input type={"password"} />
            이름
            <Input type={"text"} />
            주소
            <Input type={"text"} />
            핸드폰 번호
            <Input type={"text"} />
            <Flex justifyContent="center">
              <Button colorScheme={"purple"} w={120} my={3}>
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
