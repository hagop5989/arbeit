import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
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
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);

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

  function handleRemoveBtn() {
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
          status: "warning",
          description: "접근 권한이 없습니다.",
          position: "top",
        });
      });
  }

  return (
    <Box>
      <Box>
        <Heading>게시판 정보</Heading>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title} readOnly></Input>
          <FormLabel>본문</FormLabel>
          <Textarea value={board.content} readOnly></Textarea>
          <FormLabel>작성자</FormLabel>
          <Input value={board.name} readOnly></Input>
        </FormControl>
      </Box>

      {account.hasAccess(board.memberId) && (
        <Box>
          <Box>
            <Button
              colorScheme={"blue"}
              onClick={() => navigate(`/board/edit/${board.id}`)}
            >
              수정
            </Button>
            <Button colorScheme={"red"} onClick={onOpen}>
              삭제
            </Button>
          </Box>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>게시물 삭제</ModalHeader>
              <ModalBody>삭제하시겠습니까?</ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>취소</Button>
                <Button colorScheme={"red"} onClick={handleRemoveBtn}>
                  확인
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
    </Box>
  );
}
