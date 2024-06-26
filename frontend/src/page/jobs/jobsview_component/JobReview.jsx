import { Box, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";

/**
 * 기업 리뷰
 */
export function JobReview() {
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
        기업 리뷰
      </Text>
      <Divider mb={4} />
      <Box mx={3}>
        <HStack spacing={10} w="full" alignItems="start">
          <VStack align="start" spacing={3} w="65%">
            <HStack mt={5}>
              <Text w="100px" fontSize="xl" fontWeight="bold" my={1}>
                기업평점
              </Text>
              <Text>{parseInt(Math.random() * 10) + " / 10"}</Text>
            </HStack>
            <HStack>
              <Text w="100px" fontSize="xl" fontWeight="bold" my={1}>
                기업경쟁률
              </Text>
              <Text>{parseInt(Math.random() * 50) + " : 1"}</Text>
            </HStack>
          </VStack>
          <VStack align="start" spacing={3} w="40%">
            <HStack>
              <Text fontWeight="bold" fontSize={"xl"}>
                최근 리뷰 목록
              </Text>
            </HStack>
            <VStack align="start" spacing={1} cursor={"pointer"}>
              <ul>
                <li>1 번 리뷰 제목입니다.</li>
                <li>2 번 리뷰 제목입니다.</li>
                <li>3 번 리뷰 제목입니다.</li>
                <li>4 번 리뷰 제목입니다.</li>
              </ul>
            </VStack>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
}
