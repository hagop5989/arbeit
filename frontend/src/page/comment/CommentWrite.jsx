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
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faChevronRight,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

export function CommentWrite({ boardId, reload, setReload }) {
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [isAnswered, setIsAnswered] = useState(false);

  const account = useContext(LoginContext);

  const maxCommentLength = 300;

  function handleSubmitBtn() {
    axios
      .post("/api/comment/write", {
        ...comment,
        boardId,
        memberId: account.id,
      })
      .then(() => {
        setComment("");
      })
      .catch((err) => {
        setErrors(err.response.data);
      })
      .finally(() => setReload(!reload));
  }

  const handleTextareaChange = (prop) => (e) => {
    setComment({ ...comment, [prop]: e.target.value });
  };

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
          <Box mt={"5px"}>
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
                  onClick={handleSubmitBtn}
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
