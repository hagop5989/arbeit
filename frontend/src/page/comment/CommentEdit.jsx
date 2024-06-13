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
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function FormControl(props) {
  return null;
}

export function CommentEdit() {
  const { id } = useParams();
  const [errors, setErrors] = useState(null);
  const [comment, setComment] = useState(null);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/comment/${id}`).then((res) => {
      setComment(res.data);
    });
  }, [id]);

  function handleCommentSubmit() {
    axios
      .put(`/api/comment/${id}`, ...comment)
      .then(() => {
        toast({
          description: "댓글이 수정되었습니다.",
          position: "top",
          status: "success",
        });
        navigate(`/board/list`);
      })
      .catch((err) => {
        setErrors(err.response.data);
        toast({
          status: "warning",
          description: "오류가발생하였습니다",
          position: "top",
        });
      })
      .finally(() => {
        onClose();
      });
  }

  const handleChange = (prop) => (e) => {
    setComment({ ...comment, [prop]: e.target.value });
  };

  if (!comment == null) {
    return <Spinner />;
  }

  return (
    <Flex>
      <Box>
        <FormControl>
          <FormLabel>댓글</FormLabel>
          <Textarea
            value={comment.comment}
            onChange={handleChange("comment")}
          />
          {errors && <FormHelperText>{errors.comment}</FormHelperText>}
        </FormControl>
        <Box>
          <Button onClick={onOpen}>저장</Button>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
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
