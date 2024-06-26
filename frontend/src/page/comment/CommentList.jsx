import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { CommentEdit } from "./CommentEdit.jsx";

export function CommentList({ boardId }) {
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!boardId) return;

    axios
      .get(`/api/comment/list/${boardId}`)
      .then((res) => {
        setCommentList(res.data);
      })
      .catch((err) => console.log(err));
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

  return (
    <Box>
      <FormControl>
        <FormLabel>댓글목록</FormLabel>
        <Box>
          <Table>
            <Tbody>
              {commentList.map((comment) => (
                <Tr key={comment.id}>
                  <Td>{comment.id}</Td>
                  <Td>
                    {isEditing === comment.id ? (
                      <CommentEdit
                        comment={comment}
                        setIsEditing={setIsEditing}
                      />
                    ) : (
                      <Flex>
                        <Box>{comment.comment}</Box>
                      </Flex>
                    )}
                  </Td>
                  <Td>{comment.memberId}</Td>
                  <Td>{comment.inserted}</Td>
                  <Td>
                    {account.hasAccess(comment.memberId) && (
                      <Button
                        colorScheme={"blue"}
                        onClick={() => {
                          setIsEditing(comment.id);
                        }}
                      >
                        수정
                      </Button>
                    )}
                  </Td>
                  <Td>
                    {account.hasAccess(comment.memberId) && (
                      <Button
                        colorScheme={"red"}
                        onClick={() => {
                          setSelectedCommentId(comment.id);
                          onOpen();
                        }}
                      >
                        삭제
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </FormControl>
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
