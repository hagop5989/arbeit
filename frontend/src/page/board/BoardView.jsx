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
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { CommentComponent } from "../comment/CommentComponent.jsx";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState({});
  const [images, setImages] = useState([]);
  const [like, setLike] = useState(null);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [isViewingProcessing, setIsViewingProcessing] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);
  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        axios
          .put(`/api/board/view`, { boardId: res.data.board.id })
          .then((response) => {
            setViewCount(response.data.count);
            setBoard(res.data.board);
            setImages(res.data.images);
            setLike(res.data.like);
          });
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 404) {
          toast({
            status: "error",
            description: "게시물이 존재하지 않습니다",
            position: "top",
          });
          navigate("/board/list");
        }
      });
  }, [id]);

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

  // 좋아요 처리 함수
  function handleClickLike() {
    if (!account.id) {
      return; // 비로그인 상태에서는 처리 중단
    }

    setIsLikeProcessing(true);
    axios
      .put(`/api/board/like`, { boardId: board.id })
      .then((res) => {
        setLike(res.data);
      })
      .catch(() => {})
      .finally(() => {
        setIsLikeProcessing(false);
      });
  }

  return (
    <Box w={"735px"} p={4}>
      <Flex mb={4} alignItems="center">
        <Heading as="h2" size="lg" mb={4}>
          {board.name}의 게시물
        </Heading>
        <Spacer />

        {!isLikeProcessing && (
          <Flex alignItems="center" ml={4}>
            <Box
              onClick={handleClickLike}
              cursor={account.id ? "pointer" : "not-allowed"}
              fontSize="2xl"
              color="red.500"
              mr={2}
            >
              {like && like.like ? (
                <FontAwesomeIcon icon={fullHeart} />
              ) : (
                <FontAwesomeIcon icon={emptyHeart} />
              )}
            </Box>
            <Box fontSize="xl" color="gray.600">
              {like ? like.count : 0}
            </Box>
          </Flex>
        )}
        <Flex alignItems="center" ml={4} justifyContent="space-between">
          <FontAwesomeIcon icon={faEye} color="gray.400" />
          <Box ml={3} color="gray.600">
            {viewCount}
          </Box>
        </Flex>
      </Flex>
      <Box overflow="hidden">
        <FormControl>
          <FormLabel mt={8} fontSize={"xl"} fontWeight={"bold"}>
            제목
          </FormLabel>
          <Input value={board.title} readOnly bg="gray.100" borderRadius="md" />
          <FormLabel mt={8} fontSize={"xl"} fontWeight={"bold"}>
            본문
          </FormLabel>
          <Textarea
            value={board.content}
            readOnly
            bg="gray.100"
            borderRadius="md"
          />
          <FormLabel mt={8} fontSize={"xl"} fontWeight={"bold"}>
            첨부사진
          </FormLabel>
          <Box>
            {images.map((image) => (
              <Image
                key={image.name}
                src={image.src}
                borderRadius="md"
                mt={2}
              />
            ))}
          </Box>
          <FormLabel mt={8} fontSize={"xl"} fontWeight={"bold"}>
            작성자
          </FormLabel>
          <Input value={board.name} readOnly bg="gray.100" borderRadius="md" />
        </FormControl>
      </Box>

      <Box position="relative">
        {account.hasAccess(board.memberId) && (
          <Box position="absolute" top={-10} right={-40}>
            <Button
              colorScheme="blue"
              onClick={() => navigate(`/board/${board.id}/edit`)}
              mr={3}
            >
              수정
            </Button>
            <Button colorScheme="red" onClick={onOpen}>
              삭제
            </Button>
          </Box>
        )}
      </Box>

      <Box mt={6}>
        <CommentComponent boardId={board.id} />

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>게시물 삭제</ModalHeader>
            <ModalBody>정말 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>취소</Button>
              <Button colorScheme="red" onClick={handleRemoveBtn} ml={3}>
                삭제
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
