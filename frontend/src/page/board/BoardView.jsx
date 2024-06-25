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

  //좋아용
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
    <Box>
      <Flex>
        <Heading>{board.name}번 게시물</Heading>
        <Spacer />
        {isLikeProcessing || (
          <Flex>
            <Box onClick={handleClickLike} cursor="pointer" fontSize="3xl">
              {like && like.like ? (
                <FontAwesomeIcon icon={fullHeart} />
              ) : (
                <FontAwesomeIcon icon={emptyHeart} />
              )}
            </Box>
            <Box fontSize="3xl">{like ? like.count : 0} </Box>
          </Flex>
        )}
      </Flex>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title} readOnly></Input>
          <Box position="relative">
            {account.hasAccess(board.memberId) && (
              <Box position="absolute" top={-10} right={-40}>
                <Button
                  colorScheme={"blue"}
                  onClick={() => navigate(`/board/${board.id}/edit`)}
                  mr={3}
                >
                  수정
                </Button>
                <Button colorScheme={"red"} onClick={onOpen}>
                  삭제
                </Button>
              </Box>
            )}
          </Box>
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
