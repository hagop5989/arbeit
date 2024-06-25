import { Box, Flex, Text } from "@chakra-ui/react";
import LocationMap from "../../../component/LocationMap.jsx";
import React from "react";

/**
 * 근무 지역
 */
export function JobLocation({ storeMap }) {
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
      <Text fontSize="2xl" fontWeight="bold" mb={"20px"}>
        근무지역
      </Text>
      <LocationMap
        height={"400px"}
        address={storeMap.store != null ? storeMap.store.address : ""}
      />
      <Flex fontSize={"xl"} fontWeight={"bold"} my={"10px"}>
        <Text>주소 :</Text>
        <Text ml={2}>
          {storeMap.store != null ? storeMap.store.address : ""}
        </Text>
      </Flex>
    </Box>
  );
}
