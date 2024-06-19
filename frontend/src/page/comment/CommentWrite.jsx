import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function CommentWrite({ boardId, isProcessing, setIsProcessing }) {
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  const maxCommentLength = 300;

  function handleCommentSubmitClick() {
    if (!account || !account.id) {
      toast({
        status: "error",
        description: "로그인해주세요",
        position: "top",
      });
      return;
    }

    axios
      .post("/api/comment/add", {
        ...comment,
        boardId: boardId,
        memberId: account.id,
      })
      .then((res) => {
        setComment("");
        toast({
          status: "success",
          description: "댓글 등록 하였습니다 ",
          position: "top",
        });
        navigate("/board/view");
      })
      .catch((err) => {
        setErrors(err.response.data);
        const code = err.response.status;
        if (code === 400) {
          toast({
            status: "warning",
            description: "댓글등록중 오류발생하였습니다",
            position: "top",
          });
        }
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }

  function handlecancel() {
    toast({
      status: "info",
      description: "취소되었습니다",
      position: "top",
    });
    navigate("/");
  }

  const handleTextareaChange = (prop) => (e) => {
    setComment({ ...comment, [prop]: e.target.value });
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>댓글작성</FormLabel>
        <Textarea onChange={handleTextareaChange("comment")} />
        {errors && <FormHelperText>{errors.comment}</FormHelperText>}
        <Text>
          {comment.comment?.length} / {maxCommentLength}
        </Text>
        <Box>
          <Button colorScheme={"green"} onClick={handleCommentSubmitClick}>
            등록
          </Button>
          <Button onClick={handlecancel}>취소</Button>
        </Box>
      </FormControl>
    </Box>
  );
}
