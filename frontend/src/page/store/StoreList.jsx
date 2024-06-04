import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function StoreList() {
  const [storeList, setStoreList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/store/list").then((res) => setStoreList(res.data));
  }, []);

  return (
    <Box>
      <Box>
        <Box>가게 목록</Box>
        <Table>
          <Thead>
            <Tr>
              <Th>사진</Th>
              <Th>가게명</Th>
              <Th>주소</Th>
              <Th>업종</Th>
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
                height="4cm" // 각 행의 높이 조절
                overflow="hidden" // 내용이 넘칠 경우 숨김 처리
              >
                <Td>{store.id}</Td>
                <Td>{store.name}</Td>
                <Td>{store.address}</Td>
                <Td>{store.category}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
