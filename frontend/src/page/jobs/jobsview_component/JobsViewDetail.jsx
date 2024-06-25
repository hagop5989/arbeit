import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  ListItem,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

const styles = {
  menu: {
    fontSize: "25px",
    fontWeight: "800",
    borderBottom: "3px solid gray",
    mb: "10px",
  },

  list: {
    mb: "5px",
    fontWeight: "600",
  },
};

export function JobsViewDetails({ job, jobsCond, images, src, storeMap }) {
  const navigate = useNavigate();
  return (
    <Box
      id={"상세요강"}
      w={"full"}
      maxW={"800px"}
      p={8}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      bg="white"
    >
      <Text fontWeight="bold" fontSize="2xl" my={2}>
        상세요강
      </Text>
      <Divider my={5} />
      {images.length === 0 && (
        <Box>
          <Center
            borderY={"3px solid gray"}
            w={"400px"}
            h={"160px"}
            margin={"auto"}
          >
            <Box textAlign={"center"}>
              <Box w={"150px"} h={"60px"}>
                <Image
                  w={"100%"}
                  h={"100%"}
                  border={"1px solid lightgray"}
                  borderRadius={"8px"}
                  src={src}
                  objectFit="contain"
                />
              </Box>
              <Text fontWeight={"700"} fontSize={"20px"}>
                {storeMap.store.name}
              </Text>
              <Text fontWeight={"700"} fontSize={"25px"} mt={"20px"}>
                {job.title}
              </Text>
            </Box>
          </Center>
          <Box my={"70px"} w={"600px"} mx={"60px"}>
            <Flex {...styles.menu}>
              <Text>
                <FontAwesomeIcon icon={faBolt} />
              </Text>
              <Text ml={"5px"}>모집조건</Text>
            </Flex>
            <Table mb={"40px"}>
              <Thead bg={"gray"}>
                <Tr>
                  <Th
                    borderRight={"1px solid white"}
                    fontSize={"15px"}
                    textAlign={"center"}
                    w={"200px"}
                    color={"white"}
                  >
                    모집 분야
                  </Th>
                  <Th fontSize={"15px"} textAlign={"center"} color={"white"}>
                    우대사항
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td
                    border={"1px solid gray"}
                    fontSize={"20px"}
                    fontWeight={"800"}
                    textAlign={"center"}
                  >
                    {job.categoryName}
                  </Td>
                  <Td
                    border={"1px solid gray"}
                    fontSize={"17px"}
                    fontWeight={"800"}
                    textAlign={"center"}
                  >
                    {jobsCond.preferred}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          <Box w={"600px"} mx={"60px"}>
            <Flex {...styles.menu}>
              <Text>
                <FontAwesomeIcon icon={faBolt} />
              </Text>
              <Text ml={"5px"}>근무조건</Text>
            </Flex>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={"10px"}
              my={"20px"}
            >
              <UnorderedList ml={"50px"} fontSize={"20px"}>
                <ListItem {...styles.list}>
                  근무 기간: {jobsCond.workPeriod}
                </ListItem>
                <ListItem {...styles.list}>
                  근무 요일: {jobsCond.workWeek}
                </ListItem>
                <ListItem {...styles.list}>
                  근무 시간: {jobsCond.workTime}
                </ListItem>
              </UnorderedList>
            </Box>
            <Flex {...styles.menu} mt={"50px"}>
              <Text>
                <FontAwesomeIcon icon={faBolt} />
              </Text>
              <Text ml={"5px"}>지원조건</Text>
            </Flex>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={"10px"}
              my={"20px"}
            >
              <UnorderedList ml={"50px"} fontSize={"20px"}>
                <ListItem {...styles.list}>
                  학력: {jobsCond.education} ({jobsCond.educationDetail})
                </ListItem>
                <ListItem {...styles.list}>
                  연령: {jobsCond.age == "0" ? "무관" : jobsCond.age}
                </ListItem>
              </UnorderedList>
            </Box>
            <Flex {...styles.menu} mt={"50px"} mb={"25px"}>
              <Text>
                <FontAwesomeIcon icon={faBolt} />
              </Text>
              <Text ml={"5px"}>추가사항</Text>
            </Flex>
            <Box
              textIndent={"30px"}
              mb={"50px"}
              fontWeight={"600"}
              fontSize={"20px"}
            >
              {job.content}
            </Box>
          </Box>
        </Box>
      )}
      {images &&
        images.map((image, index) => (
          <Image w={"100%"} key={index} src={image.src} alt={image.name} />
        ))}
      <Button
        onClick={() => navigate(`/jobs/${job.id}/apply`)}
        bgColor={"#FF7F3E"}
        color={"white"}
        mt={5}
        w="full"
      >
        지원하기
      </Button>
    </Box>
  );
}
