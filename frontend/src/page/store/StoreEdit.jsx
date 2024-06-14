import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  ModalContent,
  ModalOverlay,
  Select,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DaumPostcodeEmbed from "react-daum-postcode";
import KakaoMap2 from "../posts/KakaoMap2.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export function StoreEdit() {
  const { id } = useParams();
  const [store, setStore] = useState({});
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [imageList, setImageList] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [addImages, setAddImages] = useState([]);

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/store/category`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get(`/api/store/${id}`)
      .then((res) => {
        setStore(res.data.store);
        setImageList(res.data.images);
      })
      .catch(() => navigate(-1));
  }, []);

  function handleClickSave() {
    axios
      .putForm(`/api/store/${id}`, {
        ...store,
        removeImages,
        addImages,
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
        setErrors(err.response.data);
      })
      .finally(() => {
        onClose();
      });
  }

  const fileNameList = [];
  for (let addFile of addImages) {
    // 이미 있는 파일과 중복된 파일명인지?
    let duplicate = false;
    for (let file of imageList) {
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
        <Box>{duplicate && <Badge colorScheme="red">덮어쓰기</Badge>}</Box>
      </Flex>,
    );
  }

  const handleInputChange = (prop) => (e) => {
    setStore({ ...store, [prop]: e.target.value });
  };

  const onCompletePost = (data) => {
    setStore({ ...store, address: data.address });
    onClose();
  };

  function handleRemoveImage(imageName) {
    setRemoveImages([...removeImages, imageName]);
    setImageList((prevList) => {
      const index = prevList.findIndex((image) => image.name === imageName);
      if (index !== -1) {
        const newList = [...prevList];
        newList.splice(index, 1);
        return newList;
      }
      return prevList;
    });
  }

  return (
    <Box>
      <Box>
        <Heading>가게 정보</Heading>
      </Box>
      <Box>
        <FormControl>
          {/* todo : 이미지 등록 수정 */}
          <Box border="1px solid gray" display="flex" justifyContent="center">
            {imageList.map((image, index) => (
              <Box key={index}>
                <Box>
                  <Box
                    h={"10%"}
                    position={"absolute"}
                    color={"red"}
                    onClick={() => handleRemoveImage(image.name)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </Box>
                  <Image w={"100%"} h={"100%"} src={image.src} />
                </Box>
              </Box>
            ))}
          </Box>
          <FormLabel>이미지 등록</FormLabel>
          <Input
            multiple
            type="file"
            accept="image/*"
            onChange={(e) => setAddImages(e.target.files)}
          />
          {fileNameList.length > 0 && (
            <Box>
              <Card>
                <CardHeader>
                  <Heading size="md">추가 선택된 이미지 목록</Heading>
                </CardHeader>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing={4}>
                    {fileNameList}
                  </Stack>
                </CardBody>
              </Card>
            </Box>
          )}
        </FormControl>
        <FormControl>
          <FormLabel>가게 이름</FormLabel>
          <Input
            defaultValue={store.name}
            onChange={handleInputChange("name")}
          />
          <FormHelperText>{errors.name}</FormHelperText>
          <FormLabel>전화 번호</FormLabel>
          <Input
            defaultValue={store.phone}
            onChange={handleInputChange("phone")}
          />
          <FormHelperText>{errors.phone}</FormHelperText>
          <FormLabel>가게 카테고리</FormLabel>
          <Select
            defaultValue={store.categoryName}
            onChange={handleInputChange("categoryId")}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <FormHelperText>{errors.categoryId}</FormHelperText>
          <FormLabel>본문</FormLabel>
          <Textarea
            defaultValue={store.content}
            onChange={handleInputChange("content")}
          />
          <FormHelperText>{errors.content}</FormHelperText>
          <FormLabel>가게 주소</FormLabel>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <DaumPostcodeEmbed onComplete={onCompletePost} />
            </ModalContent>
          </Modal>
          <Flex>
            <Input defaultValue={store.address} readOnly />
            <Button onClick={onOpen}>우편번호 검색</Button>
            <FormHelperText>{errors.address}</FormHelperText>
          </Flex>
          <Input
            defaultValue={store.detailAddress}
            onChange={handleInputChange("detailAddress")}
          />
          <FormHelperText>{errors.detailAddress}</FormHelperText>
          <KakaoMap2 address={store.address} />

          <Button colorScheme={"blue"} onClick={handleClickSave}>
            저장
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
}
