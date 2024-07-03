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
import { useNavigate } from "react-router-dom";

export function CommentWrite({ boardId, reload, setReload }) {
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [isAnswered, setIsAnswered] = useState(false);
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  const maxCommentLength = 300;

  function handleSubmitBtn() {
    axios
      .post("/api/comment/write", {
        comment,
        boardId,
        memberId: account.id,
      })
      .then(() => {
        setComment("");
      })
      .catch((err) => {
        setErrors(err.response.data);
      })
      .finally(() => {
        setReload(!reload);
      });
  }

  const handleTextareaChange = (e) => {
    setComment(e.target.value);
  };

  function handleAnswerBtn() {
    if (account.isLoggedIn()) {
      setIsAnswered(!isAnswered);
    } else {
      alert("로그인 후 이용해주세요.");
    }
  }
  const btnStyles = (color) => ({
    bgColor: "white",
    color: color,
    border: `1px solid ${color}`,
    _hover: { bgColor: color, color: "white" },
  });

  return (
    <Box w={"100%"} mb={"30px"}>
      <FormControl isInvalid={errors.comment !== undefined}>
        <Flex justifyContent="space-between">
          <Box ml={"5px"} color={"gray.500"} fontSize={"13px"}>
            답변을 작성하려면 '답변하기'를 클릭해주세요.
          </Box>
          <Button
            onClick={() => navigate("/board/list")}
            {...btnStyles("teal")}
            fontSize={"sm"}
            w={"50px"}
            h={"30px"}
            mt={"-30px"}
          >
            목록
          </Button>
        </Flex>

        <Flex
          w={"100px"}
          fontSize={"xl"}
          fontWeight={"bold"}
          h={"30px"}
          cursor={"pointer"}
          onClick={handleAnswerBtn}
          color={account.isLoggedIn() ? "black" : "gray.400"}
          // justifyContent={"space-between"}
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
                value={comment}
                onChange={(e) => handleTextareaChange(e)}
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
              {comment?.length} / {maxCommentLength}
            </Text>
          </Box>
        )}
      </FormControl>
    </Box>
  );
}
