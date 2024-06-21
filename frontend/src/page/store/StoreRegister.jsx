import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  UnorderedList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import KakaoMap2 from "../posts/KakaoMap2.jsx";
import DaumPostcodeEmbed from "react-daum-postcode";

const styles = {
  formControl: {
    marginBottom: "60px",
    height: "100px",
  },
  formLabel: {
    fontSize: "25px",
    width: "100%",
    borderBottom: "2px solid #1F3042",
    marginBottom: 6,
  },
  center: {
    width: "97%",
    margin: "auto",
    display: "block",
  },
};

export function StoreRegister() {
  const [store, setStore] = useState({});
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  const toast = useToast();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isFileModalOpen,
    onClose: onFileModalClose,
    onOpen: onFileModalOpen,
  } = useDisclosure();
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    axios.get(`/api/store/category`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  function handleSaveClick() {
    const confirm = window.confirm("가게를 등록하시겠습니까?");
    if (confirm) {
      axios
        .postForm("/api/store/register", { ...store, files: images })
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
  }

  let disableSaveButton = false;

  // Input
  const handleInputChange = (prop) => (e) => {
    setStore({ ...store, [prop]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setStore({ ...store, phone: formattedPhoneNumber });
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;

    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }

    if (phoneNumberLength < 11) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    }

    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const onCompletePost = (data) => {
    setStore({ ...store, address: data.address });
    onClose();
  };

  // 파일 목록
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    if (files.length > 0) {
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setPreviewImage(null);
    }
  };

  const imageNameList = images.map((image, index) => (
    <li key={index}>{image.name}</li>
  ));

  const isError = (prop) => prop !== undefined;

  return (
    <Box width={"100%"}>
      <Box
        h={"70px"}
        mb={"70px"}
        bg={"#FF7F3E"}
        color={"white"}
        borderRadius={"10px"}
      >
        <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
          가게 등록
        </Heading>
      </Box>
      <Box>
        <FormControl {...styles.formControl} isInvalid={isError(errors.name)}>
          <FormLabel {...styles.formLabel}>가게명</FormLabel>
          <Center {...styles.center}>
            <Input
              onChange={handleInputChange("name")}
              placeholder="가게명을 입력하세요."
              mb={1}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </Center>
        </FormControl>
        <FormControl
          {...styles.formControl}
          mb={"100px"}
          isInvalid={isError(errors.content)}
        >
          <FormLabel {...styles.formLabel}>가게 설명</FormLabel>
          <Center {...styles.center}>
            <Textarea
              onChange={handleInputChange("content")}
              placeholder="가게 설명을 입력하세요."
            />
            <FormErrorMessage>{errors.content}</FormErrorMessage>
          </Center>
        </FormControl>
        <FormControl {...styles.formControl} isInvalid={isError(errors.phone)}>
          <FormLabel {...styles.formLabel}>가게 전화번호</FormLabel>
          <Center {...styles.center}>
            <Input
              value={store.phone || ""}
              onChange={handlePhoneChange}
              placeholder="전화 번호를 입력하세요."
              mb={1}
            />
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </Center>
        </FormControl>
        <FormControl {...styles.formControl} mb={"180px"}>
          <FormLabel {...styles.formLabel}>가게 로고</FormLabel>
          <Center>
            <Button
              colorScheme={"orange"}
              w={"100px"}
              h={"100px"}
              onClick={onFileModalOpen}
              // onClick={() => inputRef.current.click()}
            >
              사진 추가
            </Button>
            <Box
              border={"2px solid #CCD4E0"}
              w={"80%"}
              h={"150px"}
              ml={3}
              p={"10px"}
              borderRadius={"20px"}
              overflow="auto"
            >
              {imageNameList.length > 0 && (
                <UnorderedList>{imageNameList}</UnorderedList>
              )}
            </Box>
          </Center>
        </FormControl>

        {/*미리보기 모달*/}
        <Modal
          isOpen={isFileModalOpen}
          onClose={onFileModalClose}
          border={"1px solid red"}
        >
          <ModalOverlay />
          <ModalContent w={"500px"} h={"300px"}>
            <ModalBody>
              <Text my={4} fontSize={"sm"}>
                사진을 첨부해주세요.(250px * 100px 권장)
              </Text>
              <Input
                ml={"-17px"}
                my={2}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                border={"none"}
              />
              <Box
                mt={4}
                w={"250px"}
                h={"100px"}
                border={"1px solid lightgray"}
                borderRadius={"8px"}
              >
                <Image
                  w={"100%"}
                  h={"100%"}
                  src={previewImage || "/public/alba_connector_logo.png"}
                  alt="미리보기"
                  objectFit="contain"
                />
                <Text
                  position={"absolute"}
                  fontWeight={"bold"}
                  top={"130px"}
                  left={"35px"}
                  color={"gray.600"}
                >
                  미리보기
                </Text>
              </Box>
              <Button
                onClick={onFileModalClose}
                colorScheme={"blue"}
                mt={4}
                w={"70px"}
                left={"330px"}
              >
                저장
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
        {/*미리보기 모달*/}

        <FormControl
          {...styles.formControl}
          isInvalid={isError(errors.categoryId)}
        >
          <FormLabel {...styles.formLabel}>가게 카테고리</FormLabel>
          <Center {...styles.center}>
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
            <FormErrorMessage>{errors.categoryId}</FormErrorMessage>
          </Center>
        </FormControl>
        <FormControl
          {...styles.formControl}
          mb={"530px"}
          isInvalid={isError(errors.address) || isError(errors.detailAddress)}
        >
          <FormLabel {...styles.formLabel}>주소</FormLabel>
          <Center {...styles.center}>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <DaumPostcodeEmbed onComplete={onCompletePost} />
              </ModalContent>
            </Modal>
            <Flex mb={2}>
              <Input w={"70%"} defaultValue={store.address} readOnly mr={2} />
              <Button onClick={onOpen}>우편번호 검색</Button>
            </Flex>
            <FormErrorMessage mb={1}>{errors.address}</FormErrorMessage>

            <Input
              onChange={handleInputChange("detailAddress")}
              placeholder={"상세 주소를 입력해주세요."}
            />
            <FormErrorMessage mb={3}>{errors.detailAddress}</FormErrorMessage>
            <Box mt={3}>
              <KakaoMap2 address={store.address} />
            </Box>
          </Center>
        </FormControl>
        <Center>
          <Button
            w={"150px"}
            colorScheme={"orange"}
            isDisabled={disableSaveButton}
            onClick={handleSaveClick}
          >
            가게 등록
          </Button>
        </Center>
      </Box>
      <Input
        ref={inputRef}
        display={"none"}
        multiple
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </Box>
  );
}
