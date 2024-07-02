import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Spacer,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const styles = {
  btn: {
    _hover: { textDecoration: "underline" },
    cursor: "pointer",
    fontSize: "15px",
    w: "30px",
  },
};

export function CommentList({ boardId, reload, setReload }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (boardId !== undefined) {
      axios.get(`/api/comment/${boardId}/list`).then((res) => {
        setCommentList(res.data);
      });
    }
  }, [boardId, reload]);

  function Comment({ comment }) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedComment, setUpdatedComment] = useState("");

    function handleIsEditing() {
      setIsEditing(!isEditing);
    }

    function handleEditBtn() {
      axios
        .put(`/api/comment/${comment.id}`, { comment: updatedComment })
        .then(() => setIsEditing(false))
        .finally(() => setReload(!reload));
    }

    function handleDelete() {
      axios.delete(`/api/comment/${comment.id}`).then((res) => {
        setReload(!reload);
      });
    }

    return (
      <Box p={5} shadow="md" borderWidth="1px" w={"100%"}>
        <Flex fontSize={"17px"}>
          <Box mr={"10px"} color={"#F5C903"}>
            A.
          </Box>
          {!isEditing && (
            <Box w="550px" minH="80px" border={"1px solid red"} mb={"5px"}>
              {comment.comment}
            </Box>
          )}
          {isEditing && (
            <FormControl>
              <Textarea
                w="541px"
                minH="80px"
                mb={"5px"}
                mr={"5px"}
                defaultValue={comment.comment}
                onChange={(e) => setUpdatedComment(e.target.value)}
              />
              <Button
                h={"80px"}
                w={"20px"}
                colorScheme={"orange"}
                onClick={handleEditBtn}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </Button>
            </FormControl>
          )}
          <Spacer />
          {!isEditing && (
            <Flex>
              <Box mr={"5px"} {...styles.btn} onClick={handleIsEditing}>
                수정
              </Box>
              <Box {...styles.btn} onClick={handleDelete}>
                삭제
              </Box>
            </Flex>
          )}
          {isEditing && (
            <Box {...styles.btn} onClick={handleIsEditing}>
              취소
            </Box>
          )}
        </Flex>
        <Flex>
          <Box mr={"5px"}>작성자:</Box>
          <Box
            color={comment.memberName === "탈퇴한 유저" ? "gray.400" : "black"}
          >
            {comment.memberName}
          </Box>
          <Spacer />
          <Box fontSize={"13px"}>{comment.inserted}</Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={8}>
        {commentList.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </VStack>
    </Box>
  );
}
