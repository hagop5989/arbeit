import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import KakaoMap2 from "../posts/KakaoMap2.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function StoreView() {
  const { id } = useParams();
  const [store, setStore] = useState({});
  const [imageList, setImageList] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/store/${id}`)
      .then((res) => {
        setStore(res.data.store);
        setImageList(res.data.images);
      })
      .catch(() => navigate("/store/list"));
  }, [account.id]);

  if (!store.name) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  function handleRemoveBtn() {
    axios.delete(`/api/store/${id}`).then(() => {
      navigate("/store/list");
    });
  }

  const sliderSettings = {
    dots: true, // 동그라미 네비게이션 활성화
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box w={"100%"}>
      <Box
        h={"70px"}
        mb={"70px"}
        bg={"#FF7F3E"}
        color={"white"}
        borderRadius={"10px"}
      >
        <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
          가게 관리
        </Heading>
      </Box>
      <Box>
        <Heading>{store.name}</Heading>
        <FormControl>
          <Divider borderWidth="2px" my={6} borderColor={"#ffa500"} />
          <Box
            position="relative"
            width="100%"
            maxWidth="500px"
            height="350px"
            border="1px solid gray"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            mx="auto"
          >
            <Slider
              {...sliderSettings}
              style={{ width: "100%", height: "100%" }}
            >
              {imageList.map((image) => (
                <Box
                  key={image.name}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  height="100%"
                >
                  <Image
                    src={image.src}
                    maxH="100%"
                    maxW="100%"
                    objectFit="contain"
                  />
                </Box>
              ))}
            </Slider>
          </Box>
          <Divider borderWidth="1px" my={6} borderColor={"#ededed"} />
          <Flex
            justifyContent="space-between"
            direction={{ base: "column", md: "row" }}
            gap="5"
          >
            <FormLabel mt={"8px"}>전화 번호</FormLabel>
            <Input w={"200px"} defaultValue={store.phone} readOnly />
            <FormLabel mt={"8px"}>가게 카테고리</FormLabel>
            <Input w={"120px"} defaultValue={store.categoryName} readOnly />
            <FormLabel mt={"8px"}>가게 별점</FormLabel>
            <Input w={"150px"} defaultValue={"아직 작업 안했음"} readOnly />
          </Flex>
          <Divider borderWidth="1px" my={6} borderColor={"#ededed"} />
          <FormLabel mt="50px" fontSize={"1.5rem"}>
            가게 내용
          </FormLabel>
          <Divider borderWidth="1px" my={2} borderColor={"#ededed"} />
          <Box
            ml={"10px"}
            h={"200px"}
            fontSize={"1.2rem"}
            whiteSpace="pre-wrap"
          >
            {store.content}
          </Box>
          <Divider borderWidth="1px" my={2} borderColor={"#ededed"} />
          <FormLabel mt="20px" fontSize={"1.5rem"}>
            가게 주소
          </FormLabel>
          <Divider borderWidth="1px" my={4} borderColor={"#ededed"} />
          <Box ml={"10px"} fontSize={"1.2rem"}>
            {store.address}{" "}
          </Box>
          <Box ml={"10px"} fontSize={"1.2rem"}>
            {store.detailAddress}{" "}
          </Box>
          <Box mt="20px">
            <KakaoMap2 address={store.address} />
          </Box>
          <Flex mt="20px">
            <Button
              colorScheme="purple"
              onClick={() => navigate(`/store/edit/${store.id}`)}
            >
              수정
            </Button>
            <Button colorScheme="red" onClick={handleRemoveBtn} ml="4">
              삭제
            </Button>
          </Flex>
        </FormControl>
      </Box>
    </Box>
  );
}
