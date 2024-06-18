import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function CommentEdit({ comment, setIsEditing }) {
  const { id } = useParams();
  const [errors, setErrors] = useState(null);
  const [commentText, setCommentText] = useState(comment.comment);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const toast = useToast();

  function handleCommentSubmit() {
    axios
      .put(`/api/comment/${comment.id}`, {
        id: comment.id,
        comment: commentText,
      })
      .then(() => {
        toast({
          description: "댓글이 수정되었습니다.",
          position: "top",
          status: "success",
        });
      })
      .catch((err) => {
        setErrors(err.response.data);
        toast({
          status: "warning",
          description: "댓글 수정을 실패하였습니다",
          position: "top",
        });
      })
      .finally(() => {
        setIsEditing(false);
      });
  }

  if (commentText == null) {
    return <Spinner />;
  }

  return (
    <Flex>
      <Box>
        <Box>
          <FormLabel>댓글</FormLabel>
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          {errors && <FormHelperText>{errors.comment}</FormHelperText>}
        </Box>
        <Box>
          <Button size={"sm"} colorScheme="blue" onClick={onOpen}>
            수정
          </Button>
          <Box>
            <Button colorScheme="grey" onClick={() => setIsEditing(false)}>
              취소
            </Button>
          </Box>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>수정 확인</ModalHeader>
            <ModalBody>댓글을 저장하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button colorScheme={"gray"} onClick={onClose}>
                취소
              </Button>
              <Button colorScheme={"blue"} onClick={handleCommentSubmit}>
                확인
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
}
