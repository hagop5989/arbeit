import { useNavigate } from "react-router-dom";
import { Box, Divider, Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import React from "react";

export function JobContact({ boss, storeMap }) {
  const navigate = useNavigate();
  return (
    <Box
      w={"full"}
      maxW={"800px"}
      p={10}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      bg="white"
    >
      <Text fontWeight="bold" fontSize="2xl">
        채용담당자 연락처
      </Text>
      <Divider />
      <Table variant="simple">
        <Tbody>
          <Tr>
            <Td fontWeight="bold">담당자</Td>
            <Td>{boss.name}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">전화</Td>
            <Td>{boss.phoneNumber}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">이메일</Td>
            <Td>{boss.email}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Text fontSize="sm" color="gray.500" mt={3}>
        구직이 아닌 광고 등의 목적으로 연락처를 이용할 경우 법적 처벌을 받을 수
        있습니다.
      </Text>
    </Box>
  );
}
