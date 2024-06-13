import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  faBriefcase,
  faEllipsisH,
  faIndustry,
  faScissors,
  faTruck,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import KakaoMap2 from "../posts/KakaoMap2.jsx";

export function StoreView() {
  const { id } = useParams();
  const [store, setStore] = useState({});
  const [imageList, setImageList] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/store/${id}`).then((res) => {
      setStore(res.data.store);
      setImageList(res.data.images);
    });
  }, [account.id]);

  if (store === null) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const iconMapping = {
    utensils: faUtensils,
    scissors: faScissors,
    truck: faTruck,
    briefcase: faBriefcase,
    industry: faIndustry,
    ellipsis: faEllipsisH,
  };

  return (
    <Box>
      <Box>
        <Heading>가게 정보</Heading>
      </Box>
      <Box>
        <Box
          flex="1"
          width="500px"
          height="250px"
          border="1px solid gray"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="gray.400"
        >
          {imageList.map((image) => (
            <Box key={image.name}>
              <Image w={"100%"} h={"100%"} src={image.src} />
            </Box>
          ))}
        </Box>
        <FormControl mt={5}>
          <FormLabel>가게 이름</FormLabel>
          <Input defaultValue={store.name} readOnly />
          <FormLabel>전화 번호</FormLabel>
          <Input defaultValue={store.phone} readOnly />
          <FormLabel>가게 카테고리</FormLabel>
          <Input defaultValue={store.categoryName} readOnly />
          <FormLabel>가게 내용</FormLabel>
          <Textarea defaultValue={store.content} readOnly />
          <FormLabel>가게 별점</FormLabel>
          <Input defaultValue={"아직 작업 안했음"} readOnly />
          <FormLabel>가게 주소</FormLabel>
          <Input defaultValue={store.address} readOnly />
          <Input defaultValue={store.detailAddress} readOnly />
          <Box>
            <KakaoMap2 address={store.address} />
          </Box>
          <Flex>
            <Button
              colorScheme="purple"
              onClick={() => navigate(`/store/edit/${store.id}`)}
            >
              수정
            </Button>
            <Button colorScheme="red">삭제</Button>
          </Flex>
        </FormControl>
      </Box>
    </Box>
  );
}
