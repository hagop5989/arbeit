import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BoardWrite() {
  const [board, setBoard] = useState({});
  const [errors, setErrors] = useState({});
  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  function handleWriteBtn() {
    axios
      .post(`/api/board/write`, { ...board, memberId: account.id })
      .then(() => {
        toast({
          description: "글이 작성 되었습니다",
          status: "success",
          position: "top-left",
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
            position: "top-right",
          });
        }
      })
      .finally();
  }

  const handleInputChange = (prop) => (e) => {
    setBoard({ ...board, [prop]: e.target.value });
  };

  return (
    <Box>
      <Box>알바 경험담</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input onChange={handleInputChange("title")}></Input>
            {errors && <FormHelperText>{errors.title}</FormHelperText>}

            <FormLabel>내용</FormLabel>
            <Textarea onChange={handleInputChange("content")}></Textarea>
            {errors && <FormHelperText>{errors.content}</FormHelperText>}
          </FormControl>
        </Box>
        <Box>
          <Button colorScheme={"blue"} onClick={handleWriteBtn}>
            등록
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
