import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

export function BoardEdit() {
  const { id } = useParams();

  const [board, setBoard] = useState({});
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState([]);
  const [content, setContent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setBoard(res.data.board);
        setTitle(res.data.board.title);
        setContent(res.data.board.content);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          navigate("/board/list");
        }
      });
  }, [id]);

  function handleSaveBtn() {
    const confirm = window.confirm("저장하시겠습니까?");
    if (confirm) {
      axios
        .putForm(`/api/board/${id}`, {
          id: board.id,
          title: title,
          content: content,
        })
        .then(() => {
          navigate(`/board/${board.id}`);
        })
        .catch((err) => {
          setErrors(err.response.data);
        });
    }
  }

  if (board == null) {
    return <Spinner />;
  }

  return (
    <Box w={"600px"} h={"600px"}>
      <Helmet>
        <title>질문 수정 - 알바커넥터</title>
      </Helmet>
      <Heading
        align={"center"}
        color={"white"}
        mb={"30px"}
        size={"lg"}
        bg={"#FF8708"}
        lineHeight={"70px"}
        fontFamily={"SBAggroB"}
        borderRadius={"10px"}
      >
        질문 수정
      </Heading>
      <Box>
        <FormControl isInvalid={errors.title !== undefined}>
          <Flex>
            <FormLabel
              fontSize={"xl"}
              fontWeight={"bold"}
              color={"#3396FE"}
              w={"80px"}
              h={"40px"}
              lineHeight={"38px"}
            >
              Q. 질문
            </FormLabel>
            <Box w={"100%"}>
              <Input
                defaultValue={board.title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors && (
                <FormErrorMessage mb={"10px"}>{errors.title}</FormErrorMessage>
              )}
            </Box>
          </Flex>
        </FormControl>
        <FormControl isInvalid={errors.content !== undefined} mb={"10px"}>
          <Textarea
            defaultValue={board.content}
            onChange={(e) => setContent(e.target.value)}
            h={"400px"}
            bg={"#EDF2F7"}
          />
          {errors && <FormErrorMessage>{errors.content}</FormErrorMessage>}
        </FormControl>
      </Box>

      <Box align={"right"}>
        <Button
          onClick={handleSaveBtn}
          colorScheme={"blue"}
          size={"sm"}
          mr={"5px"}
        >
          저장
        </Button>
        <Button
          size={"sm"}
          onClick={() => navigate(`/board/${id}`)}
          colorScheme={"blue"}
          variant={"outline"}
        >
          작성 취소
        </Button>
      </Box>
    </Box>
  );
}
