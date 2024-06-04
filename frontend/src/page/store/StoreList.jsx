import {
  Box,
  Button,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function StoreList() {
  const [storeList, setStoreList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { onClose } = useDisclosure();

  useEffect(() => {
    axios.get("/api/store/list").then((res) => setStoreList(res.data));
  }, []);

  function handleClickRemove() {
    axios
      .delete(`/api/store/list/${id}`)
      .then(() => {
        toast({
          status: "success",
          description: `${id}번 가게등록이 해제되었습니다`,
          position: "top",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          status: "error",
          description: `${id}번 게시물 삭제 중 오류가 발생하였습니다.`,
          position: "top",
        });
      })
      .finally(() => {
        onClose();
      });
  }

  if (storeList === null) {
    return <Spinner />;
  }

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
              <Th>작업</Th>
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
                <Td>
                  <Button colorScheme={"red"} onClick={handleClickRemove}>
                    X
                  </Button>
                  <Button>수정</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
