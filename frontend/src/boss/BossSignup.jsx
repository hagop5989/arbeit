import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl, FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import axios from "axios";

function BossSignup(props) {
  const [newBoss, setNewBoss] = useState({
    email: "",
    password: "",
    name: "",
    address: "",
    phone:"",
  });

  function handleBossSignupInput(field,e) {
    setNewBoss((prevBoss)=>({...prevBoss,
      [field]:e.target.value,}))
  }

  function handleBossSignup() {
    axios
      .post("/api/boss/insert",newBoss)
      .then((res)=>{})
      .catch(()=>{})
      .finally(()=>{})
  }


  return (
    <Box>
      <Heading>회원가입</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input
            value={newBoss.email}
            onChange={(e)=>handleBossSignupInput("email",e)}
            type={"text"}
              placeholder={"abc@abc.com"} />
            <FormLabel>비밀번호</FormLabel>
            <Input
              value={newBoss.password}
              onChange={(e)=>handleBossSignupInput("password",e)}
              type={"password"} />
            <FormLabel>비밀번호 확인</FormLabel>
            <Input type={"password"} />
            <FormLabel>이름</FormLabel>
            <Input
              value={newBoss.name}
              onChange={(e)=>handleBossSignupInput("name",e)}
              type={"text"} />
            <FormLabel>주소</FormLabel>
            <Input
              value={newBoss.address}
              onChange={(e)=>handleBossSignupInput("address",e)}
              type={"text"} />
            <FormLabel>핸드폰 번호</FormLabel>
            <Input
              value={newBoss.phone}
              onChange={(e)=>handleBossSignupInput("phone",e)}
              type={"text"} />
            <Flex justifyContent="center">
              <Button onClick={handleBossSignup} colorScheme={"purple"} w={120} my={3}>
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
