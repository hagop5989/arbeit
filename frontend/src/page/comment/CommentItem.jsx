import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function CommentItem({ comment, isProcessing, setIsProcessing }) {
  const { id } = useParams();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [commentState, setCommentState] = useState(comment);
  const navigate = useNavigate();
  const toast = useToast();
  const account = useContext(LoginContext);

  function handleRemove() {
    setIsProcessing(true);
    axios
      .delete(`/api/comment/${id}`, {})
      .then(() => {
        toast({
          description: "댓글이 삭제되었습니다.",
          status: "info",
          position: "top",
        });
        navigate("/");
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
      <Flex>
        <Heading>{commentState.memberId}</Heading>
      </Flex>
      <Box>
        <FormControl>
          <FormLabel>댓글</FormLabel>
          <Input value={commentState.comment} readOnly></Input>
          <FormLabel>작성자</FormLabel>
          <Input value={commentState.memberId} readOnly></Input>
          <FormLabel>작성시간</FormLabel>
          <Input value={commentState.inserted} readOnly></Input>
        </FormControl>
      </Box>
      <Box>
        <Box>
          <Button
            colorScheme={"blue"}
            onClick={() => navigate(`/comment/${commentState.id}/edit`)}
          >
            수정
          </Button>
          <Button colorScheme={"red"} onClick={onOpen}>
            삭제
          </Button>
        </Box>
      </Box>
      {account.hasAccess(commentState.memberId) && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>댓글삭제</ModalHeader>
            <ModalBody>삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>취소</Button>
              <Button colorScheme={"red"} onClick={handleRemove}>
                삭제
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
