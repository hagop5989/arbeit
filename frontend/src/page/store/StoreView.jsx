import axios from "axios";
import {
  Box,
  Button,
  Flex,
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
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function StoreView() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/store/${id}`)
      .then((res) => setStore(res.data))
      .catch((error) => {
        console.error("Error fetching store data", error);
        toast({
          status: "error",
          description: "가게 정보를 불러오는데 실패했습니다.",
          position: "top",
        });
      });
  }, [id]);

  function handleClickRemove() {
    axios
      .delete(`/api/store/${id}`)
      .then(() => {
        toast({
          status: "success",
          description: `${id}번 가게 등록이 삭제되었습니다.`,
          position: "top",
        });
        navigate("/store");
      })
      .catch(() => {
        toast({
          status: "error",
          description: `${id}번 삭제 중 오류가 발생하였습니다.`,
          position: "top",
        });
      })
      .finally(() => {
        onClose();
      });
  }

  if (store === null) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box
      p={8}
      maxWidth="1000px"
      mx="auto"
      boxShadow="lg"
      borderRadius="md"
      bg="white"
    >
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        가게 정보
      </Heading>
      <Box mb={6}>
        <FormControl>
          <FormLabel>가게 이름</FormLabel>
          <Input value={store.name} readOnly />
        </FormControl>
      </Box>
      <Box mb={6}>
        <FormControl>
          <FormLabel>가게 내용</FormLabel>
          <Textarea value={store.content} readOnly />
        </FormControl>
      </Box>
      <Box mb={6}>
        <FormControl>
          <FormLabel>가게 주소</FormLabel>
          <Input value={store.address} readOnly />
        </FormControl>
      </Box>
      <Box mb={6}>
        <FormControl>
          <FormLabel>가게 카테고리</FormLabel>
          <Input value={store.category} readOnly />
        </FormControl>
      </Box>
      <Flex justifyContent="space-between">
        <Button
          colorScheme="purple"
          onClick={() => navigate(`/store/edit/${store.id}`)}
        >
          수정
        </Button>
        <Button colorScheme="red" onClick={onOpen}>
          삭제
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Flex gap={2}>
              <Button onClick={onClose}>취소</Button>
              <Button colorScheme="red" onClick={handleClickRemove}>
                확인
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
