import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function CommentList({ boardId }) {
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (boardId !== undefined) {
      axios.get(`/api/comment/${boardId}/list`).then((res) => {
        setCommentList(res.data);
      });
    }
  }, [boardId]);

  function handleRemove() {
    if (selectedCommentId === null) {
      toast({
        status: "error",
        description: "댓글 ID가 설정되지 않았습니다.",
        position: "top",
      });
      return;
    }

    axios
      .delete(`/api/comment/${selectedCommentId}`)
      .then(() => {
        toast({
          description: "댓글이 삭제되었습니다.",
          status: "info",
          position: "top",
        });
        setCommentList(
          commentList.filter((comment) => comment.id !== selectedCommentId),
        );
        onClose();
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "삭제를 실패하였습니다",
          position: "top",
        });
      });
  }

  function Comment({ comment }) {
    return (
      <Box p={5} shadow="md" borderWidth="1px" w={"100%"}>
        <Flex fontSize={"17px"}>
          <Box mr={"10px"} color={"#F5C903"}>
            A.
          </Box>
          <Box w={"100%"} minH="40px">
            {comment.comment}
          </Box>
        </Flex>
        <Flex>
          <Box mr={"5px"}>작성자:</Box>
          <Box
            color={comment.memberName === "탈퇴한 유저" ? "gray.400" : "black"}
          >
            {comment.memberName}
          </Box>
          <Spacer />
          <Box fontSize={"15px"}>{comment.inserted}</Box>
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
      <Box>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>삭제 확인</ModalHeader>
            <ModalBody>삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>취소</Button>
              <Button colorScheme="red" onClick={handleRemove} ml={3}>
                삭제
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
