import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function BoardWrite() {
  const [board, setBoard] = useState({});
  const [errors, setErrors] = useState({});
  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  const maxContentLength = 500;

  function handleWriteBtn() {
    axios
      .post(`/api/board/write`, { ...board, memberId: account.id })
      .then(() => {
        toast({
          description: "글이 작성 되었습니다",
          status: "success",
          position: "top",
        });
        navigate(`/board/list`);
      })
      .catch((err) => {
        setErrors(err.response.data);
      })
      .finally();
  }

  const handleInputChange = (prop) => (e) => {
    setBoard({ ...board, [prop]: e.target.value });
  };

  return (
    <Box w={"600px"} h={"600px"}>
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
        질문 작성
      </Heading>
      <Box>
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
                  onChange={handleInputChange("title")}
                  placeholder={"제목을 입력해주세요."}
                />
                {errors && (
                  <FormErrorMessage mb={"10px"}>
                    {errors.title}
                  </FormErrorMessage>
                )}
              </Box>
            </Flex>
          </FormControl>
          <FormControl isInvalid={errors.content !== undefined}>
            <Textarea
              onChange={handleInputChange("content")}
              placeholder={"내용을 입력해주세요."}
              h={"400px"}
              bg={"#EDF2F7"}
            />
            {errors && <FormErrorMessage>{errors.content}</FormErrorMessage>}
            <Text>
              {board.content?.length} / {maxContentLength}
            </Text>
          </FormControl>
        </Box>
        <Box align={"right"}>
          <Button
            onClick={handleWriteBtn}
            colorScheme={"blue"}
            size={"sm"}
            mr={"5px"}
          >
            등록
          </Button>
          <Button
            onClick={() => navigate("/board/list")}
            colorScheme={"blue"}
            size={"sm"}
            variant={"outline"}
          >
            작성 취소
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
