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
  const [like, setLike] = useState(null);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  /*const [view, setView] = useState(null);
  const [isViewingProcessing, setIsViewingProcessing] = useState(false);*/
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setBoard(res.data.board);
        setImages(res.data.images);
        setLike(res.data.like);
        setView(res.data.view);

        /*axios;
        isViewingProcessing(true)
          .put(`/api/board/view`, { boardId: res.data.board.id })
          .then((res) => {
            setView(res.data);
          })
          .catch((err) => {
            console.log("Failed to update view count:", err);
          })
          .finally(() => {
            setIsViewingProcessing(false);
          });*/
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "게시물이 존재하지 않습니다",
            position: "top",
          });
          navigate("/");
        }
      });
  }, [account.id, id]);

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
    <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
      <Flex mb={4} alignItems="center">
        <Heading size="lg" fontWeight="bold">
          {board.name}번 게시물
        </Heading>
        <Spacer />
        {!isLikeProcessing && (
          <Flex alignItems="center">
            <Box
              onClick={handleClickLike}
              cursor="pointer"
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

        {/* {!isViewingProcessing && (
          <Flex>
            <Box cursor="pointer" fontSize="3xl">
              {view && view.view ? (
                <FontAwesomeIcon icon={ViewIcon} />
              ) : (
                <FontAwesomeIcon icon={ViewOffIcon} />
              )}
            </Box>
            <Box fontSize="3xl">{view ? view.count : 0} </Box>
          </Flex>
        )}*/}
      </Flex>
      <Box mb={4}>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title} readOnly bg="gray.100" borderRadius="md" />
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
          <FormLabel mt={4}>본문</FormLabel>
          <Textarea
            value={board.content}
            readOnly
            bg="gray.100"
            borderRadius="md"
          />
          <FormLabel mt={4}>첨부사진</FormLabel>
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
          <FormLabel mt={4}>작성자</FormLabel>
          <Input value={board.name} readOnly bg="gray.100" borderRadius="md" />
        </FormControl>
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
