import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
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
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardEdit() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/board/${id}`).then((res) => {
      setBoard(res.data);
    });
  }, []);

  function handleSaveBtn() {
    axios
      .put(`/api/board/${id}`, board)
      .then(() => {
        toast({
          status: "success",
          description: `${board.id}번 게시물 수정 완료`,
          position: "top",
        });
        navigate(`/board/${board.id}`);
      })
      .catch((err) => {
        setErrors(err.response.data);
        toast({
          status: "warning",
          description: `다시 확인해주세요`,
          position: "top",
        });
      })
      .finally(() => {
        onClose();
      });
  }

  const handleInputChange = (prop) => (e) => {
    setBoard({ ...board, [prop]: e.target.value });
  };

  if (board == null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box>
        <Heading>게시물 수정</Heading>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            defaultValue={board.title}
            onChange={handleInputChange("title")}
          />
          {errors && <FormHelperText>{errors.title}</FormHelperText>}

          <FormLabel>본문</FormLabel>
          <Textarea
            defaultValue={board.content}
            onChange={handleInputChange("content")}
          />
          {errors && <FormHelperText>{errors.content}</FormHelperText>}

          <FormLabel>사진</FormLabel>
          <Image defaultValue={board.files}></Image>
          <Input
            multiple
            type={"file"}
            accept="image/*"
            onChange={handleInputChange("files")}
          ></Input>
          {errors && <FormHelperText>{errors.files}</FormHelperText>}
        </FormControl>
      </Box>

      <Box>
        <Button onClick={onOpen}>저장</Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>저장!</ModalHeader>
          <ModalBody>저장하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleSaveBtn}>확인</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
