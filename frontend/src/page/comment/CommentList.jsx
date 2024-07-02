import React, { useContext, useEffect, useState } from "react";
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
import { LoginContext } from "../../provider/LoginProvider.jsx";

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
  const account = useContext(LoginContext);

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
      const confirm = window.confirm("수정하시겠습니까?");
      if (confirm) {
        axios
          .put(`/api/comment/${comment.id}`, { comment: updatedComment })
          .then(() => setIsEditing(false))
          .finally(() => setReload(!reload));
      }
    }

    function handleRemoveBtn() {
      const confirm = window.confirm("정말 삭제하시겠습니까?");
      if (confirm) {
        axios
          .delete(`/api/comment/${comment.id}`)
          .then(() => setReload(!reload));
      }
    }

    function handleDelete() {
      axios.delete(`/api/comment/${comment.id}`).then((res) => {
        setReload(!reload);
      });
    }

    return (
      <Box p={5} shadow="md" borderWidth="1px" w={"100%"}>
        <Flex fontSize={"17px"}>
          <Box mr={"10px"} color={"#F5C903"} pt={2}>
            A.
          </Box>
          {!isEditing && (
            <Box
              w="550px"
              minH="80px"
              bg={"#EDF2F7"}
              mb={"10px"}
              p={2}
              borderRadius={"10px"}
            >
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
          {account.hasAccess(comment.memberId) && (
            <>
              {!isEditing && (
                <Flex>
                  <Box mr={"5px"} {...styles.btn} onClick={handleIsEditing}>
                    수정
                  </Box>
                  <Box {...styles.btn} onClick={handleRemoveBtn}>
                    삭제
                  </Box>
                </Flex>
              )}
              {isEditing && (
                <Box {...styles.btn} onClick={handleIsEditing}>
                  취소
                </Box>
              )}
            </>
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
      <Box mb={"5px"} mr={"5px"}>
        답변 수 : {commentList.length}
      </Box>
      {commentList.length === 0 && (
        <Box mr={"5px"}>작성된 답변이 없습니다.</Box>
      )}
      <VStack spacing={8}>
        {commentList.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </VStack>
    </Box>
  );
}
