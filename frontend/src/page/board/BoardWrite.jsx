import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BoardWrite() {
  const [board, setBoard] = useState({});
  const [member, setMember] = useState({});
  const [errors, setErrors] = useState({});
  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/member/${account.id}`).then((res) => {
      setMember(res.data);
    });
  }, []);

  function handleSaveClick() {
    setBoard({ ...board, memberId: member.id });
    axios
      .post(`/api/board/write`, board)
      .then(() => {
        toast({
          description: "글이 작성 되었습니다",
          status: "success",
          position: "top-left",
        });
        navigate("/");
      })
      .catch((e) => {
        const code = e.response.status;

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
            <Input onChange={handleInputChange("content")}></Input>
            {errors && <FormHelperText>{errors.content}</FormHelperText>}

            <FormLabel>작성자</FormLabel>
            <Input value={member.name} isReadOnly></Input>
          </FormControl>
        </Box>
        <Box>
          <Button colorScheme={"blue"} onClick={handleSaveClick}>
            등록
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
