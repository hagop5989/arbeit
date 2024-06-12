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
import { useParams } from "react-router-dom";
import * as PropTypes from "prop-types";

function FormControll(props) {
  return null;
}

FormControll.propTypes = { children: PropTypes.node };

export function CommentEdit() {
  const { id } = useParams();
  const [errors, setErrors] = useState(null);
  const [comment, setComment] = useState(comment);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    axios.get(`/api/comment/${id}`).then((res) => {
      setComment(res.data);
    });
  }, []);

  function handleCommentSubmit() {
    axios
      .put(`/api/comment/${id}`, comment)
      .then(() => {
        toast({
          description: "댓글이 수정되었습니다.",
          position: "top",
          status: "success",
        });
        navigator(`/comment/${comment.id}`);
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

  const hendleChage = (prop) => (e) => {
    setComment({ ...comment, [prop]: e.target.value });
  };

  if (comment == null) {
    return <Spinner />;
  }

  return (
    <Flex>
      <Box>
        <FormControll>
          <FormLabel>댓글</FormLabel>
          <Box flex={1}>
            <Textarea
              defaultValue={comment.comment}
              onChange={hendleChage("comment")}
            />
            {errors && <FormHelperText>{errors.comment}</FormHelperText>}
          </Box>
        </FormControll>
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
