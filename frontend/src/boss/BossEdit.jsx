import React, {useState} from "react";
import {Box, Button, Center, Flex, FormControl, FormLabel, Heading, Input} from "@chakra-ui/react";
import axios from "axios";

function BossEdit(props) {
  const [editBoss, setEditBoss] = useState({
    email: "",
    password: "",
    name: "",
    address: "",
    phone:"",
  });

  function handleBossEditInput(field,e) {
    setEditBoss((prevBoss)=>({...prevBoss,
      [field]:e.target.value,}))
  }

  function handleBossEdit() {
    axios
      .put("/api/boss/edit",editBoss)
      .then((res)=>{})
      .catch(()=>{})
      .finally(()=>{})
  }
  return (
    <Box>
      <Heading>정보수정</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input
              value={editBoss.email}
              onChange={(e)=>handleBossEditInput("email",e)}
              type={"text"}
              placeholder={"abc@abc.com"} />
            <FormLabel>비밀번호</FormLabel>
            <Input
              value={editBoss.password}
              onChange={(e)=>handleBossEditInput("password",e)}
              type={"password"} />

            <FormLabel>이름</FormLabel>
            <Input
              value={editBoss.name}
              onChange={(e)=>handleBossEditInput("name",e)}
              type={"text"} />
            <FormLabel>주소</FormLabel>
            <Input
              value={editBoss.address}
              onChange={(e)=>handleBossEditInput("address",e)}
              type={"text"} />
            <FormLabel>핸드폰 번호</FormLabel>
            <Input
              value={editBoss.phone}
              onChange={(e)=>handleBossEditInput("phone",e)}
              type={"text"} />
            <Flex justifyContent="center">
              <Button onClick={handleBossEdit} colorScheme={"purple"} w={120} my={3}>
                정보수정
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}

export default BossEdit;
