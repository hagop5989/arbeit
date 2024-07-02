import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Spinner,
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
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { Helmet } from "react-helmet";

export function StoreList() {
  const [storeList, setStoreList] = useState([]);
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get("/api/only-boss")
      .then(() => {
        axios.get("/api/store/list").then((res) => setStoreList(res.data));
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

  if (account.id === "") {
    return <Spinner />;
  }

  return (
    <>
      {account.isBoss() && (
        <Box w={"100%"} minHeight={"500px"}>
          <Helmet>
            <title>사업장 관리 - 알바커넥터</title>
          </Helmet>
          <Box>
            <Heading p={1} fontFamily={"SBAggroB"}>
              나의 사업장
            </Heading>
            <Flex>
              <Box my={"20px"} h={"50px"} lineHeight={"50px"}>
                * 사업장을 등록해야 공고를 등록할 수 있습니다.
              </Box>
              <Spacer />
              <Button
                mt={"25px"}
                bgColor={"white"}
                color={"orange"}
                border={"2px solid orange"}
                size={"sm"}
                _hover={{ bgColor: "orange", color: "white" }}
                onClick={() => navigate("/store/register")}
              >
                사업장 등록
              </Button>
            </Flex>
            <Table>
              <Thead
                bg="gray.100"
                borderTop={"1px solid gray"}
                borderBottom={"2px solid #E9E9E9"}
              >
                <Tr>
                  <Th fontSize={"sm"}>사업장 등록일</Th>
                  <Th fontSize={"sm"}>사업장명</Th>
                  <Th fontSize={"sm"}>주소</Th>
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
                    height="60px"
                    overflow="hidden"
                    borderBottom={"2px solid #E9E9E9"}
                  >
                    <Td w={"150px"}>{store.inserted}</Td>
                    <Td>{store.name}</Td>
                    <Td>{store.address}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Box mb={"20px"}></Box>
        </Box>
      )}
    </>
  );
}
