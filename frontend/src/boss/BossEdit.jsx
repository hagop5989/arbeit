import React, { useContext, useEffect, useState } from "react";
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
import { LoginContext } from "./LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BossEdit(props) {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [editBoss, setEditBoss] = useState({
    id: account.id,
    email: "",
    password: "",
    name: "",
    address: "",
    phone: "",
  });

  function handleBossEditInput(field, e) {
    setEditBoss((prevBoss) => ({ ...prevBoss, [field]: e.target.value }));
  }

  function handleBossEdit() {
    axios
      .put("/api/boss/update", editBoss)
      .then((res) => {
        mytoast("수정 완료 되었습니다", "success");
      })
      .catch(() => {
        mytoast("수정실패", "error");
      })
      .finally(() => {});
  }

  function handleBossDelete() {
    axios
      .delete(`/api/boss/delete?id=${account.id}`)
      .then((res) => {
        mytoast("삭제 완료 되었습니다", "success");
      })
      .catch(() => {
        mytoast("삭제 실패", "error");
      })
      .finally(() => {
        account.logout();
        navigate("/bossLogin");
      });
  }

  useEffect(() => {
    if (account.isLoggedIn()) {
      axios
        .get(`/api/boss/select?id=${account.id}`)
        .then((res) => {
          setEditBoss(res.data);
          mytoast("회원정보를 로드하였습니다.", "success");
        })
        .catch(() => {})
        .finally(() => {});
    }
  }, []);

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
      <Heading>정보수정</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input
              value={editBoss.email.trim()}
              onChange={(e) => handleBossEditInput("email", e)}
              type={"text"}
              placeholder={"abc@abc.com"}
            />
            <FormLabel>비밀번호</FormLabel>
            <Input
              value={editBoss.password}
              onChange={(e) => handleBossEditInput("password", e)}
              type={"password"}
            />

            <FormLabel>이름</FormLabel>
            <Input
              value={editBoss.name.trim()}
              onChange={(e) => handleBossEditInput("name", e)}
              type={"text"}
            />
            <FormLabel>주소</FormLabel>
            <Input
              value={editBoss.address}
              onChange={(e) => handleBossEditInput("address", e)}
              type={"text"}
            />
            <FormLabel>핸드폰 번호</FormLabel>
            <Input
              value={editBoss.phone.trim()}
              onChange={(e) => handleBossEditInput("phone", e)}
              placeholder={"- 는 제외하고 적어주세요."}
              type={"number"}
            />
            <Flex justifyContent="center">
              <Button
                onClick={handleBossEdit}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                정보수정
              </Button>
              <Button
                onClick={handleBossDelete}
                colorScheme={"red"}
                w={120}
                my={3}
              >
                회원탈퇴
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}

export default BossEdit;
