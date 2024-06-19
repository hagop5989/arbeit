import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
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
  Spacer,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { CommentComponent } from "../comment/CommentComponent.jsx";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState({});
  const [images, setImages] = useState([]);
  const [like, setLike] = useState({
    like: false,
    count: 0,
  });
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setBoard(res.data);
        setImages(res.data.images);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "게시물이 존재하지않습니다",
            position: "top",
          });
          navigate("/");
        }
      });
  }, [account.id]);

  if (!board) {
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

  function handleCilckLike() {
    axios
      .put(`/api/board/like`, { boardId: board.id })
      .then((res) => {
        setLike(res.data);
      })
      .catch(() => {})
      .finally(() => {});
  }

  return (
    <Box>
      <Flex>
        <Heading>{board.name}번 게시물</Heading>
        <Spacer />
        <Flex>
          <Box onClick={handleCilckLike} fontSize={"2xl"}>
            {like.count}
          </Box>
          {like.like && <FontAwesomeIcon icon={fullHeart} />}
          {like.like || <FontAwesomeIcon icon={emptyHeart} />}
        </Flex>
      </Flex>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title} readOnly></Input>
          <FormLabel>본문</FormLabel>
          <Textarea value={board.content} readOnly></Textarea>
          <FormLabel>첨부사진</FormLabel>
          <Box>
            {images.map((image) => (
              <Image key={image.name} src={image.src} />
            ))}
          </Box>
          <FormLabel>작성자</FormLabel>
          <Input value={board.name} readOnly></Input>
        </FormControl>
      </Box>
      {account.hasAccess(board.memberId) && (
        <Box>
          <Box>
            <Button
              colorScheme={"blue"}
              onClick={() => navigate(`/board/${board.id}/edit`)}
            >
              수정
            </Button>
            <Button colorScheme={"red"} onClick={onOpen}>
              삭제
            </Button>
          </Box>
        </Box>
      )}
      <Box>
        <CommentComponent boardId={board.id} />

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
    </Box>
  );
}
