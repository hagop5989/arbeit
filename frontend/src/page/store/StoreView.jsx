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

  if (store === null) {
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

  return (
    <Box mx={{ base: "20px", xl: "200px" }} mt={"30px"}>
      <Box fontSize={"1.7rem"}>가게 정보</Box>
      <Divider borderWidth="1px" my={4} borderColor={"lightgray"} />
      <Box>
        <Heading>{store.name}</Heading>
        <FormControl>
          <Divider borderWidth="2px" my={6} borderColor={"lightgray"} />
          <Box
            flex="1"
            width="500px"
            height="350px"
            border="1px solid gray"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="gray.400"
          >
            {imageList.map((image) => (
              <Box key={image.name} w={"100%"} h={"100%"}>
                <Image
                  w={"100%"}
                  h={"100%"}
                  src={image.src}
                  objectFit="cover"
                />
              </Box>
            ))}
          </Box>
          <Divider borderWidth="1px" my={6} borderColor={"gray"} />
          <Flex
            justifyContent="space-between"
            direction={{ base: "column", md: "row" }}
            gap="5"
          >
            <FormLabel
              mt={{ base: "8px", md: "8px" }}
              mr={{ base: "0", md: "15px" }}
            >
              전화 번호
            </FormLabel>
            <Input
              w={{ base: "100%", md: "200px" }}
              defaultValue={store.phone}
              readOnly
            />
            <FormLabel
              mt={{ base: "8px", md: "8px" }}
              mr={{ base: "0", md: "15px" }}
            >
              가게 카테고리
            </FormLabel>
            <Input
              w={{ base: "100%", md: "300px" }}
              defaultValue={store.categoryName}
              readOnly
            />
            <FormLabel
              mt={{ base: "8px", md: "8px" }}
              mr={{ base: "0", md: "15px" }}
            >
              가게 별점
            </FormLabel>
            <Input
              w={{ base: "100%", md: "300px" }}
              defaultValue={"아직 작업 안했음"}
              readOnly
            />
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
