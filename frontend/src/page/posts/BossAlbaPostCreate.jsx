import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BossAlbaPostCreate() {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [albaPost, setAlbaPost] = useState({
    title: "",
    content: "",
    storeName: "default",
    bossId: account.id,
    bossName: account.name,
  });
  const allFieldsFilled = Object.values(albaPost).every(
    (value) => value.length > 0,
  );

  function handleBossAlbaPostInput(field, e) {
    setAlbaPost((prevBoss) => ({ ...prevBoss, [field]: e.target.value }));
  }

  function handleBossAlbaPostCreate() {
    if (allFieldsFilled) {
      axios
        .post("/api/boss/post/insert", albaPost)
        .then((res) => {
          mytoast("공고생성 되었습니다", "success");
          navigate("/bossAlbaPostList");
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
      <Heading>알바공고 생성</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>제목</FormLabel>

            <Input
              value={albaPost.title}
              onChange={(e) => handleBossAlbaPostInput("title", e)}
              type={"text"}
              placeholder={"제목을 입력해주세요"}
            />

            <FormLabel>내용</FormLabel>
            <Textarea
              value={albaPost.content}
              onChange={(e) => handleBossAlbaPostInput("content", e)}
              type={"text"}
              placeholder={"내용을 입력해주세요"}
            />
            <FormLabel>가게명</FormLabel>
            <Input
              value={albaPost.storeName}
              onChange={(e) => handleBossAlbaPostInput("storeName", e)}
              type={"text"}
              readOnly
            />
            <FormLabel>작성자</FormLabel>
            <Input
              value={albaPost.bossName}
              onChange={(e) => handleBossAlbaPostInput("bossName", e)}
              type={"text"}
              readOnly
            />

            <Flex justifyContent="center">
              <Button
                isDisabled={!allFieldsFilled}
                onClick={handleBossAlbaPostCreate}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                공고생성
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}
