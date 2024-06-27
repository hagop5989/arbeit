import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import LocationMap from "../../component/LocationMap.jsx";
import DaumPostcodeEmbed from "react-daum-postcode";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "../../provider/LoginProvider.jsx";

const styles = {
  formControl: {
    marginBottom: "60px",
    height: "100px",
  },
  formLabel: {
    fontSize: "25px",
    fontWeight: "800",
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
  const [image, setImage] = useState([]);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [checkLength, setCheckLength] = useState(0);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const account = useContext(LoginContext);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isFileModalOpen,
    onClose: onFileModalClose,
    onOpen: onFileModalOpen,
  } = useDisclosure();
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    axios
      .get("/api/only-boss")
      .then(() => {
        axios.get(`/api/store/category`).then((res) => {
          setCategories(res.data);
        });
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/");
        }
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [account.id]);

  function handleSaveClick() {
    const confirm = window.confirm("등록하시겠습니까?");
    if (confirm) {
      axios
        .postForm("/api/store/register", { ...store, files: image })
        .then(() => {
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
    setCheckLength({ ...checkLength, [prop]: e.target.value.length });
  };
  const onCompletePost = (data) => {
    setStore({ ...store, address: data.address });
    onClose();
  };
  // 파일 목록

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImage(files);
    if (files.length > 0) {
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setPreviewImage(null);
    }
  };
  const isError = (prop) => prop !== undefined;

  function handleRemoveLogo() {
    image.pop();
    setPreviewImage(null);
  }

  if (account.id === "") {
    return <Spinner />;
  }

  return (
    <>
      {account.isBoss() && (
        <Box width={"100%"}>
          <Box
            h={"70px"}
            mb={"70px"}
            bg={"#FF7F3E"}
            color={"white"}
            borderRadius={"10px"}
          >
            <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
              사업장 등록
            </Heading>
          </Box>
          <Box>
            <FormControl
              {...styles.formControl}
              isInvalid={isError(errors.name)}
            >
              <FormLabel {...styles.formLabel}>사업장명</FormLabel>
              <Center {...styles.center}>
                <Input
                  onChange={handleInputChange("name")}
                  placeholder="사업장명을 입력해주세요."
                  mb={1}
                />
                <Flex gap={"10px"}>
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                  <FormHelperText color={"gray"}>
                    {checkLength.name}/45
                  </FormHelperText>
                </Flex>
              </Center>
            </FormControl>
            <FormControl
              {...styles.formControl}
              mb={"100px"}
              isInvalid={isError(errors.content)}
            >
              <FormLabel {...styles.formLabel}>사업장 소개</FormLabel>
              <Center {...styles.center}>
                <Textarea
                  onChange={handleInputChange("content")}
                  placeholder="사업장을 소개해주세요."
                />
                <Flex gap={"10px"}>
                  <FormErrorMessage>{errors.content}</FormErrorMessage>
                  <FormHelperText color={"gray"}>
                    {checkLength.content}/1,000
                  </FormHelperText>
                </Flex>
              </Center>
            </FormControl>
            <FormControl
              {...styles.formControl}
              isInvalid={isError(errors.phone)}
            >
              <FormLabel {...styles.formLabel}>연락처</FormLabel>
              <Center {...styles.center}>
                <Input
                  maxLength={"11"}
                  value={store.phone || ""}
                  onChange={handleInputChange("phone")}
                  placeholder="연락처를 입력하세요. ('-'는 빼고 작성해주세요.)"
                  mb={1}
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </Center>
            </FormControl>
            <FormControl {...styles.formControl} mb={"100px"}>
              <FormLabel {...styles.formLabel}>사업장 로고</FormLabel>
              <Center>
                <Button
                  colorScheme={"orange"}
                  w={"100px"}
                  h={"40px"}
                  onClick={onFileModalOpen}
                >
                  {image.length !== 0 ? "덮어쓰기" : "로고 추가"}
                </Button>
                <Box
                  border={"2px solid #CCD4E0"}
                  w={"80%"}
                  h={"40px"}
                  ml={3}
                  pl={"20px"}
                  borderRadius={"10px"}
                >
                  {image.length !== 0 && (
                    <Flex pt={"5px"}>
                      <Box mr={"5px"}>{image[0].name}</Box>
                      <Box
                        color={"red"}
                        onClick={handleRemoveLogo}
                        cursor={"pointer"}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Center>
            </FormControl>

            {/*미리보기 모달*/}
            <Modal isOpen={isFileModalOpen} onClose={onFileModalClose}>
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
                  <Text
                    position={"absolute"}
                    fontWeight={"bold"}
                    top={"110px"}
                    left={"30px"}
                    color={"gray.600"}
                  >
                    미리보기
                  </Text>
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
                      src={
                        previewImage || "/public/alba_connector_store_logo.png"
                      }
                      objectFit="contain"
                    />
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
              <FormLabel {...styles.formLabel}>카테고리</FormLabel>
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
              isInvalid={
                isError(errors.address) || isError(errors.detailAddress)
              }
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
                  <Input
                    w={"70%"}
                    defaultValue={store.address}
                    readOnly
                    mr={2}
                  />
                  <Button onClick={onOpen}>우편번호 검색</Button>
                </Flex>
                <FormErrorMessage mb={1}>{errors.address}</FormErrorMessage>

                <Input
                  onChange={handleInputChange("detailAddress")}
                  placeholder={"상세 주소를 입력해주세요."}
                />
                <FormErrorMessage mb={3}>
                  {errors.detailAddress}
                </FormErrorMessage>
                <Box mt={3}>
                  <LocationMap address={store.address} height={"400px"} />
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
                사업장 등록
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
      )}
    </>
  );
}
