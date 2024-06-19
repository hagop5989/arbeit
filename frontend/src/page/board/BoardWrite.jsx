import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BoardWrite() {
  const [board, setBoard] = useState({});
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const maxContentLength = 500;

  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(<li key={i}>{files[i].name}</li>);
  }

  function handleWriteBtn() {
    if (!account || !account.id) {
      toast({
        status: "error",
        description: "로그인해주세요",
        position: "top",
      });
      return;
    }

    axios
      .post(`/api/board/write`, { ...board, memberId: account.id, files })
      .then(() => {
        toast({
          description: "글이 작성 되었습니다",
          status: "success",
          position: "top",
        });
        navigate("/");
      })
      .catch((err) => {
        setErrors(err.response.data);
        const code = err.response.status;
        if (code === 400) {
          toast({
            status: "error",
            description: "등록되지 않았습니다. 입력한 내용을 확인해주세요",
            position: "top",
          });
        }
      })
      .finally();
  }

  function handleWritecancel() {
    navigate("/");
    toast({
      description: " 글작성이 취소되었습니다",
      status: "info",
      position: "top",
    });
  }

  const handleInputChange = (prop) => (e) => {
    setBoard({ ...board, [prop]: e.target.value });
  };

  return (
    <Box>
      <Box>
        <Heading>게시판 작성</Heading>
      </Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input onChange={handleInputChange("title")}></Input>
            {errors && <FormHelperText>{errors.title}</FormHelperText>}
            <FormLabel>내용</FormLabel>
            <Textarea onChange={handleInputChange("content")}></Textarea>
            <Text>
              {board.content?.length} / {maxContentLength}
            </Text>
            {errors && <FormHelperText>{errors.content}</FormHelperText>}
            <FormLabel>사진</FormLabel>
            <Input
              multiple
              type={"file"}
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
            />
            <Text>이미지 터져요</Text>
          </FormControl>
          {fileNameList.length > 0 && (
            <Box>
              <Text>파일 리스트</Text>
              <UnorderedList>{fileNameList}</UnorderedList>
            </Box>
          )}
        </Box>
        <Box mt={3}>
          <Button onClick={handleWritecancel}>취소</Button>
          <Button colorScheme={"blue"} onClick={handleWriteBtn}>
            등록
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
