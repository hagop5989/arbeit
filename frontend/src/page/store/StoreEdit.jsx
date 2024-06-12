import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
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
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DaumPostcode from "react-daum-postcode";

export function StoreEdit() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [inputAddress, setInputAddress] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: DisOpen,
    onClose: DonClose,
    onOpen: DonOpen,
  } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/store/cate`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    if (inputAddress) {
      setStore((prevStore) => ({ ...prevStore, address: inputAddress }));
    }
  }, [inputAddress]);

  useEffect(() => {
    axios.get(`/api/store/${id}`).then((res) => setStore(res.data));
  }, [id]);

  if (!store) {
    return <div>Loading...</div>;
  }

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedCategory = categories.find(
      (cate) => cate.id.toString() === selectedId,
    );
    setStore({
      ...store,
      categoryId: selectedId,
      cateName: selectedCategory ? selectedCategory.name : "",
    });
  };

  function handleClickSave() {
    axios
      .put("/api/store/edit", store, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast({
          status: "success",
          description: `${store.id} 가게가 수정되었습니다.`,
          position: "top",
        });
        navigate(`/store/${store.id}`);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: `가게가 수정되지 않았습니다. 작성한 내용을 확인해주세요.`,
            position: "top",
          });
        }
      })
      .finally(() => {
        onClose();
      });
  }

  const onCompletePost = (data) => {
    setInputAddress(data.address);
    DonClose();
  };

  return (
    <Box>
      <Box mb={10}></Box>
      <Box
        p={8}
        maxWidth="1100px"
        mx="auto"
        boxShadow="lg"
        borderRadius="md"
        bg="white"
      >
        <Heading as="h2" size="lg" mb={6} ml={2}>
          가게 정보
        </Heading>
        <Flex>
          <Box flex="1">
            <FormControl mt={5}>
              <FormLabel>가게 이름</FormLabel>
              <Input
                value={store.name}
                width="80%"
                onChange={(e) => setStore({ ...store, name: e.target.value })}
              />
            </FormControl>
            <Flex mt="1cm">
              <Box>
                <FormControl>
                  <FormLabel>
                    <FontAwesomeIcon icon={faPhone} /> 전화 번호
                  </FormLabel>
                  <Input
                    value={store.phone}
                    width="80%"
                    onChange={(e) =>
                      setStore({ ...store, phone: e.target.value })
                    }
                  />
                </FormControl>
              </Box>
              <Box ml={6}>
                <FormControl>
                  <FormLabel>가게 카테고리</FormLabel>
                  <Select
                    value={store.categoryId || ""}
                    onChange={handleCategoryChange}
                  >
                    <option value="" disabled>
                      카테고리 선택
                    </option>
                    {categories.map((cate) => (
                      <option key={cate.id} value={cate.id}>
                        {cate.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Flex>
          </Box>
          <Box
            flex="1"
            width="500px"
            height="250px"
            border="1px solid lightgray"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="gray.400"
          >
            사진
          </Box>
        </Flex>
        <Box mb={7}>
          <FormControl>
            <FormLabel>가게 주소</FormLabel>
            <Input
              value={store.address}
              onChange={(e) => setStore({ ...store, address: e.target.value })}
            />
            <Button onClick={DonOpen}>우편번호 검색</Button>
            <Modal isOpen={DisOpen} onClose={DonClose}>
              <ModalOverlay />
              <ModalContent>
                <DaumPostcode onComplete={onCompletePost} height="100%" />
              </ModalContent>
            </Modal>
          </FormControl>
        </Box>

        <Box mb={7}>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Textarea
              value={store.content}
              onChange={(e) => setStore({ ...store, content: e.target.value })}
            ></Textarea>
          </FormControl>
        </Box>

        <Box>
          <Button colorScheme={"blue"} onClick={onOpen}>
            저장
          </Button>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalBody>저장하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>취소</Button>
              <Button onClick={handleClickSave} colorScheme={"blue"}>
                확인
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
