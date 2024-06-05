import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { name } = useContext(LoginContext);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  function handleSaveClick() {
    setLoading(true);
    axios
      .post(`api/board/write`, {
        title,
        content,
        writer: name,
      })
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
      .finally(() => setLoading(false));
  }

  let disableSaveButton = false;
  if (title.trim().length === 0) {
    disableSaveButton = true;
  }
  if (content.trim().length === 0) {
    disableSaveButton = true;
  }

  return (
    <Box>
      <Box>알바 경험담</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input onChange={(e) => setTitle(e.target.value)}></Input>
          </FormControl>
        </Box>
        {/*-----*/}
        <Box>
          <FormControl>
            <FormLabel>내용</FormLabel>
            <Input onChange={(e) => setContent(e.target.value)}></Input>
          </FormControl>
        </Box>

        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={name} isReadOnly></Input>
          </FormControl>
        </Box>

        <Box mb={7}>
          <FormControl>
            <FormLabel>가입일시</FormLabel>
            <Input
              isReadOnly
              value={new Date().toISOString().substr(0, 16)}
              type={"datetime-local"}
            />
          </FormControl>
        </Box>
        <Box>
          <Button
            isLoading={loading}
            isDisabled={disableSaveButton}
            colorSchem={"yellow.100"}
            onClick={handleSaveClick}
          >
            등록
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
