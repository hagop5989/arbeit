import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import axios from "axios";
import LocationMap from "../../component/LocationMap.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Helmet } from "react-helmet";

const styles = {
  menu: {
    h: "33.33%",
    textIndent: "20px",
    lineHeight: "40px",
    ml: "20px",
    pt: "8px",
  },
  text: {
    fontSize: "17px",
    borderRight: "3px solid orange",
    w: "100px",
    h: "40px",
  },
  info: {
    w: "300px",
    h: "40px",
    fontWeight: "700",
  },
  title: {
    h: "40px",
    fontSize: "1.5rem",
    fontWeight: "800",
    borderBottom: "2px solid gray",
    mb: "10px",
  },
};

export function StoreView() {
  const { id } = useParams();
  const [store, setStore] = useState({});
  const [image, setImage] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/store/${id}`)
      .then((res) => {
        setStore(res.data.store);
        setImage(res.data.images);
      })
      .catch(() => navigate("/store/list"));
  }, [account.id]);

  function handleRemoveBtn() {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (confirm) {
      axios.delete(`/api/store/${id}`).then(() => {
        navigate("/store/list");
      });
    }
  }

  return (
    <Box w={"70%"}>
      <Helmet>
        <title>사업장 정보 - 알바커넥터</title>
      </Helmet>
      <Box
        h={"70px"}
        mb={"70px"}
        bg={"#FF7F3E"}
        color={"white"}
        borderRadius={"10px"}
      >
        <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
          사업장 정보
        </Heading>
      </Box>
      <Box>
        <Flex mb={"70px"}>
          <Box>
            <Box
              w={"260px"}
              h={"110px"}
              border={"2px solid #E0E0E0"}
              borderRadius={"10px"}
            >
              <Image
                src={
                  image.length === 0
                    ? "/public/alba_connector_store_logo.png"
                    : image[0].src
                }
                w={"250px"}
                h={"100px"}
                objectFit="contain"
              />
            </Box>
            <Center w="260px" h="70px" size={"lg"}>
              <Box textAlign={"center"}>
                <Box mb={"2px"}>사업장명</Box>
                <Heading size={"md"}>{store.name}</Heading>
              </Box>
            </Center>
          </Box>
          <Box w={"100%"} fontSize={"20px"}>
            <Flex {...styles.menu}>
              <Box {...styles.text}>연락처</Box>
              <Box {...styles.info}>{store.phoneNumber}</Box>
            </Flex>
            <Flex {...styles.menu}>
              <Box {...styles.text}>카테고리</Box>
              <Box {...styles.info}>{store.categoryName}</Box>
            </Flex>
            <Flex {...styles.menu}>
              <Box {...styles.text}>평점</Box>
              <Box {...styles.info}>준비중</Box>
            </Flex>
          </Box>
        </Flex>
        <Box {...styles.title}>사업장 소개</Box>
        <Box
          h={"300px"}
          border={"2px solid #E0E0E0"}
          borderRadius={"10px"}
          p={"10px"}
          fontSize={"20px"}
          mb={"70px"}
        >
          {store.content}
        </Box>
        <Box {...styles.title}>주소</Box>
        <Flex h={"200px"} mb={"70px"}>
          <Box w={"600px"} mt={"10px"}>
            <Box mt={"50px"}>
              <Box fontSize={"20px"} textAlign={"center"}>
                {store.address}
              </Box>
              <Box fontSize={"20px"} textAlign={"center"}>
                {store.detailAddress}
              </Box>
            </Box>
          </Box>
          <LocationMap address={store.address} height={"200px"} />
        </Flex>
        {account.hasAccess(store.memberId) && (
          <Flex mt={"50px"} borderTop={"2px solid #E0E0E0"} pt={"10px"}>
            <Button
              colorScheme="blue"
              variant={"outline"}
              onClick={() => navigate(`/store/edit/${store.id}`)}
            >
              수정
            </Button>
            <Button
              colorScheme="red"
              variant={"outline"}
              onClick={handleRemoveBtn}
              ml="5px"
            >
              삭제
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
