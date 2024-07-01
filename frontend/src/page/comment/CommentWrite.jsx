import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faChevronRight,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

export function CommentWrite({ boardId, setIsProcessing }) {
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [isAnswered, setIsAnswered] = useState(false);
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
      .then(() => {
        setComment("");
        toast({
          status: "success",
          description: "댓글 등록 하였습니다 ",
          position: "top",
        });
      })
      .catch((err) => {
        setErrors(err.response.data);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }

  const handleTextareaChange = (prop) => (e) => {
    setComment({ ...comment, [prop]: e.target.value });
  };

  function handleCommentWrite() {
    if (!account || !account.id) {
      toast({
        status: "error",
        description: "로그인하세요",
        position: "top",
      });
    }
  }

  function handleAnswerBtn() {
    setIsAnswered(!isAnswered);
  }

  return (
    <Box w={"100%"} mb={"30px"}>
      <FormControl isInvalid={errors.comment !== undefined}>
        <Flex
          w={"100px"}
          fontSize={"xl"}
          fontWeight={"bold"}
          h={"30px"}
          cursor={"pointer"}
          onClick={handleAnswerBtn}
        >
          <Box mr={"5px"} ml={"5px"}>
            답변하기
          </Box>
          <Box fontSize={"md"} lineHeight={"30px"}>
            {!isAnswered ? (
              <FontAwesomeIcon icon={faChevronRight} />
            ) : (
              <FontAwesomeIcon icon={faAngleDown} />
            )}
          </Box>
        </Flex>
        {isAnswered && (
          <Box onClick={handleCommentWrite} mt={"5px"}>
            <InputGroup>
              <Textarea
                h={"70px"}
                placeholder="댓글을 입력해주세요"
                onChange={handleTextareaChange("comment")}
              />
              <InputRightElement>
                <Button
                  mt={"40px"}
                  mr={"10px"}
                  h={"70px"}
                  colorScheme={"green"}
                  onClick={handleCommentSubmitClick}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors && <FormErrorMessage>{errors.comment}</FormErrorMessage>}
            <Text>
              {comment.comment?.length} / {maxCommentLength}
            </Text>
          </Box>
        )}
      </FormControl>
    </Box>
  );
}
