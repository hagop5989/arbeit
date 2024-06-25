import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Divider, Flex, Image, Text, VStack } from "@chakra-ui/react";

export function CompanyInfo({ job, jobsCond, storeMap, boss }) {
  const [src, setSrc] = useState("/public/alba_connector_store_logo.png");

  useEffect(() => {
    if (storeMap && Array.isArray(storeMap.images)) {
      // images 배열의 각 항목을 순회하며 src 값을 출력
      storeMap.images.forEach((image) => {
        setSrc(image.src);
      });
    }
  }, [storeMap]);

  const navigate = useNavigate();
  return (
    <Box
      id={"기업정보"}
      w={"full"}
      maxW={"800px"}
      p={10}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      bg="white"
    >
      <Flex justifyContent="space-between" alignItems="center" fontSize="2xl">
        <Text fontWeight="bold" fontSize="2xl" mb={2}>
          기업정보
        </Text>
        <Box
          onClick={() => navigate(`/store/${storeMap.store.id}`)}
          color="red.500"
          cursor={"pointer"}
          fontSize="sm"
        >
          상세보기
        </Box>
      </Flex>
      <Divider mb={5} />
      <VStack align="start" spacing={4}>
        <Flex justifyContent="space-between" alignItems="center" w="full">
          <Box w={"250px"} h={"100px"}>
            <Image
              w={"100%"}
              h={"100%"}
              border={"1px solid lightgray"}
              borderRadius={"8px"}
              src={src}
              objectFit="contain"
            />
          </Box>
          <Box flex="1" ml={5}>
            <Text fontSize="xl" fontWeight="bold">
              {job.storeName}
            </Text>
            <Text fontSize="sm" color="gray.500">
              대표: {boss.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              회사주소: {job.address}
            </Text>
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
}
