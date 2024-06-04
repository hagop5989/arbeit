import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
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

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => setBoard(res.data))
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "게시물이 존재하지않습니다",
            position: "top",
          });
          navigate("/");
        }
      });
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleReMoving() {
    axios
      .delete(`/api/board/${id}`)
      .then(() => {
        toast({
          status: "success",
          description: `${id}번 게시물이 삭제되었습니다`,
          position: "top",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          status: "error",
          description: `${id}번 게시물 삭제를 실패하였습니다`,
        });
      });
  }

  return (
    <Box>
      <Box>{board.writer}</Box>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title} readOnly></Input>
        </FormControl>
      </Box>
      {/*-----------*/}
      <Box>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Input value={board.content} readOnly></Input>
        </FormControl>
      </Box>

      {/*-----------*/}
      <Box>
        <FormControl>
          <FormLabel>별명</FormLabel>
          <Input value={board.nickName} readOnly></Input>
        </FormControl>
      </Box>
      {/*-----------*/}
      <Box>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input value={board.writer} readOnly></Input>
        </FormControl>
      </Box>
      {/*-----------*/}
      <Box>
        <FormControl>
          <FormLabel>작성일시</FormLabel>
          <Input
            type={"datetime-local"}
            value={board.inserted}
            readOnly
          ></Input>
        </FormControl>
      </Box>
      {/*-----------*/}
      <Box>
        <Button
          colorScheme={"purple"}
          onClick={() => navigate(`/edit/${board.id}`)}
        >
          수정
        </Button>

        <Button colorScheme={"red"} onClick={onOpen}>
          삭제
        </Button>
      </Box>
      {/*-----------*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button colorScheme={"green"} onClick={handleReMoving}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
