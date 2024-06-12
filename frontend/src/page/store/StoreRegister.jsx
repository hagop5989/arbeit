import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import DaumPostcode from "react-daum-postcode";
import { useNavigate } from "react-router-dom";

export function StoreRegister() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [cateName, setCateName] = useState("");
  const [inputAddress, setInputAddress] = useState();
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [files, setFiles] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/store/cate`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    if (inputAddress) {
      setAddress(inputAddress);
    }
  }, [inputAddress]);

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedCategory = categories.find(
      (cate) => cate.id.toString() === selectedId,
    );
    setCategoryId(selectedId);
    setCateName(selectedCategory ? selectedCategory.name : "");
  };

  function handleSaveClick() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("content", content);
    formData.append("address", address);
    formData.append("categoryId", categoryId);
    formData.append("phone", phone);
    formData.append("cateName", cateName);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    axios
      .post("/api/store/add", formData)
      .then((response) => {
        toast({
          title: "가게 등록 성공",
          description: "새 가게가 등록되었습니다.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/store/list");
      })
      .catch((error) => {
        console.error(
          "There was an error!",
          error.response ? error.response.data : error.message,
        );
        toast({
          title: "가게 등록 실패",
          description: error.response
            ? error.response.data
            : "등록 중 오류가 발생했습니다.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }

  let disableSaveButton = false;
  if (
    name.trim().length === 0 ||
    content.trim().length === 0 ||
    address.trim().length === 0
  ) {
    disableSaveButton = true;
  }

  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(<li key={i}>{files[i].name}</li>);
  }

  const onCompletePost = (data) => {
    setInputAddress(data.address);
    onClose();
  };

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <Box mb={4}>
        <FormControl>
          <FormLabel>가게 이름</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="가게 이름을 입력하세요."
          />
        </FormControl>
      </Box>
      <Box mb={4}>
        <FormControl>
          <FormLabel>가게 내용</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="가게 내용을 입력하세요."
          />
        </FormControl>
      </Box>
      <Box mb={4}>
        <FormControl>
          <FormLabel>가게 주소</FormLabel>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="가게 주소를 입력하세요."
          />
          <Button onClick={onOpen}>우편번호 검색</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              {/*<DaumPostcode onComplete={onCompletePost} height="100%" />*/}
            </ModalContent>
          </Modal>
        </FormControl>
      </Box>

      <Box mb={4}>
        <FormControl>
          <FormLabel>전화 번호</FormLabel>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화 번호를 입력하세요."
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>사진</FormLabel>
          <Input
            multiple
            type="file"
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />
        </FormControl>
      </Box>
      <Box>
        <ul>{fileNameList}</ul>
      </Box>
      <Box mb={4}>
        <FormControl>
          <FormLabel>가게 카테고리</FormLabel>
          <Select
            value={categoryId}
            onChange={handleCategoryChange}
            placeholder="카테고리 선택"
          >
            {categories.map((cate) => (
              <option key={cate.id} value={cate.id}>
                {cate.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Button
        isDisabled={disableSaveButton}
        colorScheme="blue"
        onClick={handleSaveClick}
      >
        저장
      </Button>
    </Box>
  );
}
