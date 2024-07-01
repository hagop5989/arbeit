import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Flex, Spacer, Spinner, useToast } from "@chakra-ui/react";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { CommentWrite } from "../comment/CommentWrite.jsx";
import { CommentList } from "../comment/CommentList.jsx";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState({});
  const [images, setImages] = useState([]);
  const [like, setLike] = useState(null);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const [view, setView] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setView(res.data.view);
        setBoard(res.data.board);
        setImages(res.data.images);
        setLike(res.data.like);
      })
      .catch((err) => {
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
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (confirm) {
      axios.delete(`/api/board/${id}`).then(() => {
        toast({
          status: "success",
          description: `${id}번 게시물이 삭제되었습니다`,
          position: "top",
        });
        navigate("/board/list");
      });
    }
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
    <Box w={"735px"} minH={"700px"}>
      <Box>
        <Flex w={"100%"} h={"70px"} fontSize={"30px"} fontWeight={"700"}>
          <Box color={"#3396FE"} mr={"15px"} lineHeight={"70px"}>
            Q.
          </Box>
          <Box fontSize={"25px"} lineHeight={"70px"}>
            {board.title}
          </Box>
          <Spacer />
          {!isLikeProcessing && (
            <Flex alignItems="center" ml={4} fontSize={"20px"}>
              <Box
                onClick={handleClickLike}
                cursor={account.id ? "pointer" : "not-allowed"}
                color="red.500"
                mr={2}
              >
                {like && like.like ? (
                  <FontAwesomeIcon icon={fullHeart} />
                ) : (
                  <FontAwesomeIcon icon={emptyHeart} />
                )}
              </Box>
              <Box color="gray.600">{like ? like.count : 0}</Box>
            </Flex>
          )}
        </Flex>
        <Flex ml={"45px"} color="#94908F">
          <Box mr={1}>작성자:</Box>
          <Box mr={1}>{board.name} |</Box>
          <Box mr={1}>조회수</Box>
          <Box mr={4}>{view.count}</Box>
          <Spacer />
          {account.hasAccess(board.memberId) && (
            <Box align={"right"}>
              <Button
                colorScheme="blue"
                variant={"outline"}
                w={"40px"}
                h={"25px"}
                fontSize={"12px"}
                onClick={() => navigate(`/board/${board.id}/edit`)}
                mr={1}
              >
                수정
              </Button>
              <Button
                colorScheme="red"
                variant={"outline"}
                w={"40px"}
                h={"25px"}
                fontSize={"12px"}
                onClick={handleRemoveBtn}
              >
                삭제
              </Button>
            </Box>
          )}
        </Flex>
      </Box>
      <Box bg="gray.100" h={"400px"} my={"40px"} p={"15px"} fontSize={"20px"}>
        {board.content}
      </Box>
      <CommentWrite />
      <CommentList boardId={board.id} />
    </Box>
  );
}
