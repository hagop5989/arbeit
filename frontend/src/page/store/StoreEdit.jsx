import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
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
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DaumPostcodeEmbed from "react-daum-postcode";
import LocationMap from "../../component/LocationMap.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
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

export function StoreEdit() {
  const { id } = useParams();
  const [store, setStore] = useState({});
  const [categories, setCategories] = useState([]);
  const [originImage, setOriginImage] = useState([]);
  const [errors, setErrors] = useState({});
  const [addImage, setAddImage] = useState([]);
  const [removeImage, setRemoveImage] = useState([]);
  const account = useContext(LoginContext);
  const [checkLength, setCheckLength] = useState({});

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isFileModalOpen,
    onClose: onFileModalClose,
    onOpen: onFileModalOpen,
  } = useDisclosure();
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const param = new URLSearchParams();
    param.append("id", id);
    axios
      .post("/api/access-store", param)
      .then(() => {
        axios.get(`/api/store/category`).then((res) => {
          setCategories(res.data);
        });
        axios.get(`/api/store/${id}`).then((res) => {
          setStore(res.data.store);
          setOriginImage(res.data.images);
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
  }, [account.id]);

  function handleSaveClick() {
    const confirm = window.confirm("수정하시겠습니까?");
    if (confirm) {
      axios
        .putForm(`/api/store/${id}`, {
          ...store,
          removeImage: removeImage,
          addImage: addImage,
        })
        .then(() => {
          navigate(`/store/${store.id}`);
        })
        .catch((err) => {
          setErrors(err.response.data);
        });
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAddImage(files);
    if (files.length > 0) {
      if (originImage.length !== 0) {
        setRemoveImage(originImage[0].name);
        originImage.pop();
      }
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setPreviewImage(null);
    }
  };

  const handleInputChange = (prop) => (e) => {
    setStore({ ...store, [prop]: e.target.value });
    setCheckLength({ ...checkLength, [prop]: e.target.value.length });
  };

  const onCompletePost = (data) => {
    setStore({ ...store, address: data.address });
    onClose();
  };

  function handleRemoveLogo() {
    if (originImage.length !== 0) {
      setRemoveImage(originImage[0].name);
      originImage.length = 0;
    }
    if (addImage.length !== 0) {
      console.log(addImage);
      addImage.pop();
    }
    setPreviewImage(null);
  }

  const isError = (prop) => prop !== undefined;

  return (
    <>
      {account.hasAccess(store.memberId) && (
        <Box width={"100%"}>
          <Box
            h={"70px"}
            mb={"70px"}
            bg={"#FF7F3E"}
            color={"white"}
            borderRadius={"10px"}
          >
            <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
              사업장 정보 수정
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
                  defaultValue={store.name || ""}
                  onChange={handleInputChange("name")}
                  placeholder="사업장명을 입력해주세요."
                  mb={1}
                />
                <Flex gap={"10px"}>
                  <FormErrorMessage>{errors.content}</FormErrorMessage>
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
                  defaultValue={store.content || ""}
                  onChange={handleInputChange("content")}
                  placeholder="가게 설명을 입력하세요."
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
                  w={"40%"}
                  maxLength={"11"}
                  defaultValue={store.phone}
                  onChange={handleInputChange("phone")}
                  placeholder="전화 번호를 입력하세요."
                  mb={1}
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </Center>
            </FormControl>
            <FormControl {...styles.formControl} mb={"100px"}>
              <FormLabel {...styles.formLabel}>사업장 로고</FormLabel>
              <Center>
                <Button
                  bgColor={"rgba(255,145,83,0.93)"}
                  color={"white"}
                  w={"150px"}
                  h={"40px"}
                  onClick={onFileModalOpen}
                >
                  {addImage.length !== 0 ? "덮어쓰기" : "로고 추가"}
                </Button>
                <Box
                  border={"2px solid #CCD4E0"}
                  w={"80%"}
                  h={"40px"}
                  ml={3}
                  pl={"20px"}
                  borderRadius={"10px"}
                >
                  {(originImage.length !== 0 || addImage.length !== 0) && (
                    <Flex pt={"5px"}>
                      <Box mr={"5px"}>
                        {addImage.length !== 0
                          ? addImage[0].name
                          : originImage[0].name}
                      </Box>
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
                  value={store.categoryId || ""}
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
                    w={"50%"}
                    value={store.address || ""}
                    readOnly
                    mr={2}
                  />
                  <Button onClick={onOpen} colorScheme={"teal"}>
                    우편번호 검색
                  </Button>
                </Flex>
                <FormErrorMessage mb={1}>{errors.address}</FormErrorMessage>
                <Input
                  w={"50%"}
                  value={store.detailAddress || ""}
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
                w={"100%"}
                h={"50px"}
                bgColor={"#FFA74F"}
                color={"white"}
                onClick={handleSaveClick}
              >
                가게 수정
              </Button>
            </Center>
          </Box>
        </Box>
      )}
    </>
  );
}
