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
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function BossAlbaPostView(props) {
  const { id } = useParams();
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [editAlbaPost, setEditAlbaPost] = useState({
    title: "",
    content: "",
    storeName: "default",
    bossId: account.id,
    bossName: account.name,
  });
  const allFieldsFilled = Object.values(editAlbaPost).every(
    (value) => value.length > 0,
  );
  function handlePostInput(field, e) {
    setEditAlbaPost((prevPost) => ({ ...prevPost, [field]: e.target.value }));
  }

  function handleBossAlbaPostEdit() {
    axios
      .put("/api/boss/albaPost/edit", editAlbaPost)
      .then((res) => {
        mytoast("수정 완료 되었습니다", "success");
      })
      .catch(() => {
        mytoast("수정실패", "error");
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

  useEffect(() => {
    axios
      .get(`/api/boss/albaPost/${id}`)
      .then((res) => {
        setEditAlbaPost(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "해당 게시물이 존재하지 않습니다.",
            position: "top",
          });
          navigate("/api/boss/albaPost/list");
        }
      });
  }, []);

  return (
    <Box>
      <Heading>알바공고 상세페이지 </Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>제목</FormLabel>

            <Input
              value={editAlbaPost.title}
              onChange={(e) => handlePostInput("title", e)}
              type={"text"}
              placeholder={"제목을 입력해주세요"}
            />

            <FormLabel>내용</FormLabel>
            <Textarea
              value={editAlbaPost.content}
              onChange={(e) => handlePostInput("content", e)}
              type={"text"}
              placeholder={"내용을 입력해주세요"}
            />
            <FormLabel>가게명</FormLabel>
            <Input
              value={editAlbaPost.storeName}
              onChange={(e) => handlePostInput("storeName", e)}
              type={"text"}
              readOnly
            />
            <FormLabel>작성자</FormLabel>
            <Input
              value={editAlbaPost.bossName}
              onChange={(e) => handlePostInput("bossName", e)}
              type={"text"}
              readOnly
            />

            <Flex justifyContent="center">
              <Button
                isDisabled={!allFieldsFilled}
                onClick={handleBossAlbaPostEdit}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                공고수정
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}

export default BossAlbaPostView;
