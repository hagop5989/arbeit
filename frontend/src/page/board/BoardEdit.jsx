import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardEdit() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    axios.get(`/api/board/${id}`).then((res) => setBoard(res.data));
  }, []);

  function handleClickSave() {
    axios
      .put("/api/board/edit", board)
      .then(() => {
        toast({
          status: "성공",
          description: `${board.id}번 게시물이 수정되었습니다`,
          position: "left",
        });
        navigate(`/board/${board.id}`);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: `게시물이 수정되지 않았습니다. 작성한 내용을 확인해주세요.`,
            position: "top",
          });
        }
      })
      .finally(() => {
        onClose();
      });
  }

  if (board == null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box>{board.writer} 수정</Box>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input />
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Input />
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input />
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel>별명</FormLabel>
          <Input />
        </FormControl>
      </Box>

      <Box>
        <Button colorScheme={"blue"} onClick={onOpen}>
          저장
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>저장하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleClickSave} colorScheme={"blue"}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
