import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import KakaoMap2 from "../posts/KakaoMap2.jsx";
import DaumPostcodeEmbed from "react-daum-postcode";

export function StoreRegister() {
  const [store, setStore] = useState({});
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  const toast = useToast();
  const navigate = useNavigate();

  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/store/category`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  function handleSaveClick() {
    axios
      .postForm("/api/store/register", { ...store, files })
      .then(() => {
        toast({
          title: "가게 등록 성공",
          description: "새 가게가 등록되었습니다.",
          status: "success",
        });
        navigate("/store/list");
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  }

  let disableSaveButton = false;

  // Input
  const handleInputChange = (prop) => (e) => {
    setStore({ ...store, [prop]: e.target.value });
  };

  const onCompletePost = (data) => {
    setStore({ ...store, address: data.address });
    onClose();
  };

  return (
    <Box>
      <Box>
        <Heading>가게 등록</Heading>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>가게 이름</FormLabel>
          <Input
            onChange={handleInputChange("name")}
            placeholder="가게명을 입력하세요."
          />
          <FormHelperText>{errors.name}</FormHelperText>

          <FormLabel>가게 설명</FormLabel>
          <Textarea
            onChange={handleInputChange("content")}
            placeholder="가게 설명을 입력하세요."
          />
          <FormHelperText>{errors.content}</FormHelperText>

          <FormLabel>가게 전화번호</FormLabel>
          <Input
            onChange={handleInputChange("phone")}
            placeholder="전화 번호를 입력하세요."
          />
          <FormHelperText>{errors.phone}</FormHelperText>

          <FormLabel>사진</FormLabel>
          <Input
            multiple
            type="file"
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />

          <FormLabel>가게 카테고리</FormLabel>
          <Select
            onChange={handleInputChange("categoryId")}
            placeholder="카테고리 선택"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <FormHelperText>{errors.categoryId}</FormHelperText>

          {/* 카카오 맵 */}
          <FormLabel>주소</FormLabel>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <DaumPostcodeEmbed onComplete={onCompletePost} />
            </ModalContent>
          </Modal>
          <Flex>
            <Input w={"70%"} defaultValue={store.address} readOnly />
            <Button onClick={onOpen}>우편번호 검색</Button>
          </Flex>
          <FormHelperText>{errors.address}</FormHelperText>

          <Input
            onChange={handleInputChange("detailAddress")}
            placeholder={"상세 주소를 입력해주세요."}
          />
          <FormHelperText>{errors.detailAddress}</FormHelperText>

          <KakaoMap2 address={store.address} />

          <Button
            isDisabled={disableSaveButton}
            colorScheme="blue"
            onClick={handleSaveClick}
          >
            가게 등록
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
}
