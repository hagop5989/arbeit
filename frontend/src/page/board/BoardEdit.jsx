import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
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
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function BoardEdit() {
  const { id } = useParams();

  const account = useContext(LoginContext);
  const [board, setBoard] = useState({});
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState([]);
  const [title, setTitle] = useState([]);
  const [content, setContent] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [addImages, setAddImages] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setBoard(res.data.board);
        setImage(res.data.images);
        setTitle(res.data);
        setContent(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          navigate("/board/list");
        }
      });
  }, [id]);

  const fileNameList = [];
  for (let addFile of addImages) {
    let duplicate = false;
    for (let file of image) {
      if (file.name === addFile.name) {
        duplicate = true;
        break;
      }
    }
    fileNameList.push(
      <Flex key={addFile.name}>
        <Text fontSize={"md"} mr={3}>
          {addFile.name}
        </Text>
        <Box>{duplicate && <Badge colorScheme={"blue"}>덮어쓰기</Badge>}</Box>
      </Flex>,
    );
  }
  function handleRemovingImage(imageName) {
    setRemoveImages([...removeImages, imageName]);
    setImage((prevList) => {
      const index = prevList.findIndex((image) => image.name === imageName);
      if (index !== -1) {
        const newList = [...prevList];
        newList.splice(index, 1);
        return newList;
      }
      return prevList;
    });
  }

  function handleSaveBtn() {
    axios
      .putForm(`/api/board/${id}`, {
        id: board.id,
        title: board.title,
        content: board.content,
        removeImages,
        addImages,
      })
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

  if (board == null) {
    return <Spinner />;
  }

  return (
    <Box w={"735px"}>
      <Box>
        <Heading>게시물 수정</Heading>
      </Box>
      <Box>
        <FormControl>
          <FormLabel mt={8} fontSize={"xl"} fontWeight={"bold"}>
            제목
          </FormLabel>
          <Input
            defaultValue={board.title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors && <FormHelperText>{errors.title}</FormHelperText>}

          <FormLabel mt={8} fontSize={"xl"} fontWeight={"bold"}>
            본문
          </FormLabel>
          <Textarea
            defaultValue={board.content}
            onChange={(e) => setContent(e.target.value)}
          />
          {errors && <FormHelperText>{errors.content}</FormHelperText>}

          <FormLabel mt={8} fontSize={"xl"} fontWeight={"bold"}>
            사진
          </FormLabel>
          <Box>
            <FormControl>
              <Box border="1px solid bule" display="flex">
                {image.map((image, index) => (
                  <Box key={index}>
                    <Box>
                      <Box
                        h={"7%"}
                        position={"absolute"}
                        color={"yellow"}
                        onClick={() => handleRemovingImage(image.name)}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </Box>
                      <Image w={"100%"} h={"100%"} src={image.src} />
                    </Box>
                  </Box>
                ))}
              </Box>
              <FormLabel mt={8} fontSize={"xl"} fontWeight={"bold"}>
                사진 등록
              </FormLabel>
              <Input
                lineHeight={"30px"}
                multiple
                type="file"
                accept="image/*"
                onChange={(e) => setAddImages(e.target.files)}
              />
              {fileNameList.length > 0 && (
                <Box>
                  <Card>
                    <CardHeader>
                      <Heading>선택된 이미지 목록</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing={3}>
                        {fileNameList}
                      </Stack>
                    </CardBody>
                  </Card>
                </Box>
              )}
            </FormControl>
          </Box>
        </FormControl>
      </Box>

      <Box>
        <Button onClick={onOpen}>저장</Button>
        <Button onClick={() => navigate("/board/list")}>취소</Button>
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
