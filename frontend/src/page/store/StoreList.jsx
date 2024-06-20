import {
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import {
  faBriefcase,
  faEllipsisH,
  faIndustry,
  faScissors,
  faTruck,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

export function StoreList() {
  const [storeList, setStoreList] = useState([]);
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get("/api/store/list").then((res) => setStoreList(res.data));
  }, []);

  const iconMapping = {
    utensils: faUtensils,
    scissors: faScissors,
    truck: faTruck,
    briefcase: faBriefcase,
    industry: faIndustry,
    ellipsis: faEllipsisH,
  };

  return (
    <Box w={"100%"}>
      <Box>
        <Box
          h={"70px"}
          mb={"50px"}
          bg={"#FF7F3E"}
          color={"white"}
          borderRadius={"10px"}
        >
          <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
            가게 목록
          </Heading>
        </Box>
        <Box float={"right"} mb={"35px"}>
          <Button
            colorSzcheme="green"
            onClick={() => navigate("/store/register")}
          >
            가게 등록
          </Button>
        </Box>
        <Table>
          <Thead>
            <Tr bgColor="#ffa33f">
              <Th fontSize={"medium"}>id</Th>
              <Th fontSize={"medium"}>가게명</Th>
              <Th fontSize={"medium"}>주소</Th>
              <Th fontSize={"medium"}>등록일</Th>
              <Th fontSize={"medium"}>전화 번호</Th>
            </Tr>
          </Thead>
          <Tbody>
            {storeList.map((store) => (
              <Tr
                key={store.id}
                _hover={{
                  bgColor: "gray.200",
                }}
                cursor={"pointer"}
                onClick={() => navigate(`/store/${store.id}`)}
                height="4cm"
                overflow="hidden"
              >
                <Td>{store.id}</Td>
                <Td>{store.name}</Td>
                <Td>{store.address}</Td>
                <Td>{store.inserted}</Td>
                <Td>{store.phone}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
