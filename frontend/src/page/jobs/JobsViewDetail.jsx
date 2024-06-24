import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  HStack,
  Image,
  ListItem,
  Tab,
  Table,
  TabList,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import LocationMap from "../../component/LocationMap.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

export function JobDetail({ job, jobsCond, storeMap }) {
  if (!job || !jobsCond) {
    return null;
  }

  return (
    <Box
      w={"full"}
      maxW={"800px"}
      p={10}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      mb="2"
      bg="white"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Text fontSize="3xl" fontWeight="bold" letterSpacing={"1px"}>
          {job.title}
        </Text>
        <Box w={"200px"} h={"150px"}>
          <Image
            w={"100%"}
            h={"100%"}
            p={"10px"}
            border={"1px solid lightgray"}
            borderRadius={"8px"}
            src={"/public/alba_connector_store_logo.png"}
            objectFit="contain"
          />
        </Box>
      </Flex>
      <Text fontSize="sm" color="gray.500" mb={2}>
        {"#초보가능, #간편지원, #4대보험"}
      </Text>
      <Text fontSize="md" mb={5}>
        {/*{job.content}*/}
      </Text>

      <Grid
        templateColumns="repeat(4, 1fr)"
        gap={6}
        textAlign="center"
        mt={"40px"}
      >
        <Box>
          <Text fontSize="xl" fontWeight="bold">
            {parseInt(job.salary).toLocaleString()} 원
          </Text>
          <Text fontSize="sm" color="gray.500">
            시급
          </Text>
        </Box>
        <Box>
          <Text fontSize="xl" fontWeight="bold">
            {jobsCond.workPeriod}
          </Text>
          <Text fontSize="sm" color="gray.500">
            기간
          </Text>
        </Box>
        <Box>
          <Text fontSize="xl" fontWeight="bold">
            {jobsCond.workWeek}
          </Text>
          <Text fontSize="sm" color="gray.500">
            요일
          </Text>
        </Box>
        <Box maxH={"70px"}>
          <Text fontSize="lg" fontWeight="bold">
            {jobsCond.workTime}
          </Text>
          <Text fontSize="sm" color="gray.500">
            시간
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}

export function JobConditions({ job, jobsCond }) {
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
      <Text fontWeight="bold" fontSize="2xl" my={2}>
        근무조건
      </Text>
      <Divider />
      <Flex justifyContent="space-between" p={2} fontSize={"17px"}>
        <Box w={"440px"} mx={"10px"}>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              급여
            </Text>
            <Text ml={"0px"}> {parseInt(job.salary).toLocaleString()}원</Text>
          </Box>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              기간
            </Text>
            <Text ml={"0px"}> {jobsCond.workPeriod}</Text>
          </Box>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              요일
            </Text>
            <Text ml={"0px"}> {jobsCond.workWeek}</Text>
          </Box>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              시간
            </Text>
            <Text w={"160px"} ml={"0px"}>
              {jobsCond.workTime}
            </Text>
          </Box>
        </Box>
        <Box w={"440px"} mx={"10px"}>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              업직종
            </Text>
            <Text ml={"10px"}>{job.categoryName}</Text>
          </Box>
          <Box my={2} display={"flex"}>
            <Text w={"95px"} fontWeight="bold">
              고용형태
            </Text>
            <Text ml={"10px"}>{"알바"}</Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

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

export function JobDetails({ job, jobsCond, images }) {
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
      <Box>
        <Center
          h={"70px"}
          mb={"30px"}
          bg={"#FF7F3E"}
          color={"white"}
          borderRadius={"10px"}
          fontSize={"30px"}
          fontWeight={"800"}
        >
          <Text>{job.title}</Text>
        </Center>
        <Box mb={"70px"}>
          <Box {...styles.menu}>모집부문</Box>
          <Table mb={"40px"}>
            <Thead>
              <Tr>
                <Th
                  border={"1px solid gray"}
                  fontSize={"20px"}
                  textAlign={"center"}
                  w={"200px"}
                >
                  모집 분야
                </Th>
                <Th
                  border={"1px solid gray"}
                  fontSize={"20px"}
                  textAlign={"center"}
                >
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
        <Box>
          <Box {...styles.menu}>근무 조건</Box>
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
          <Box {...styles.menu} mt={"50px"}>
            지원 조건
          </Box>
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
          <Box {...styles.menu} mt={"50px"} mb={"30px"}>
            추가 사항
          </Box>
          <Box textIndent={"30px"} mb={"50px"} fontWeight={"600"}>
            {job.content}
          </Box>
        </Box>
      </Box>
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
            <Td>{boss.phone}</Td>
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

export function JobRequirements({ job, jobsCond, id }) {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // 연도와 날짜만 추출
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString(undefined, options);
  };

  function handleApplyBtn() {
    const jobsId = new URLSearchParams();
    jobsId.append("jobsId", id);
    axios
      .post("/api/apply-validate", jobsId)
      .then(() => navigate(`/jobs/${id}/apply`))
      .catch((err) => alert(err.response.data));
  }

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Tabs
        variant="unstyled"
        mb={"-30px"}
        defaultIndex={0}
        sx={{
          borderBottom: "1px solid lightgray",
          "& .chakra-tabs__tab": {
            color: "gray",
            bg: "#f7f7f7",
            border: "1px solid lightgray",
            borderBottom: "none",
            _selected: {
              fontSize: "18px",
              color: "red.500",
              fontWeight: "bold",
              bg: "white",
              borderColor: "lightgray",
              borderBottom: "none",
            },
            _focus: {
              boxShadow: "none",
            },
          },
          "& .chakra-tabs__tab-list": {
            borderBottom: "none",
          },
        }}
      >
        <TabList h={"50px"}>
          <Tab onClick={() => scrollToSection("모집조건")} w={"33.3%"}>
            모집조건
          </Tab>
          <Tab onClick={() => scrollToSection("상세요강")} w={"33.3%"}>
            상세요강
          </Tab>
          <Tab onClick={() => scrollToSection("기업정보")} w={"34%"}>
            기업정보
          </Tab>
        </TabList>
      </Tabs>
      <Box
        id={"모집조건"}
        w={"full"}
        maxW={"800px"}
        p={10}
        borderWidth="1px"
        borderRadius="lg"
        border={"1px solid lightgray"}
        bg="white"
      >
        <Text fontSize="2xl" my={2} fontWeight="bold">
          모집조건
        </Text>
        <Divider mb={4} />
        <Box mx={3}>
          <HStack spacing={10} w="full" alignItems="start">
            <VStack align="start" spacing={3} w="440px">
              <Box my={2} display={"flex"}>
                <Text w={"95px"} fontSize={"lg"} fontWeight="bold">
                  모집마감
                </Text>
                <Text ml={"0px"}>{formatDate(job.deadline)}</Text>
              </Box>
              <Box my={2} display={"flex"}>
                <Text w={"95px"} fontSize={"lg"} fontWeight="bold">
                  모집인원
                </Text>
                <Text ml={"0px"}>{job.recruitmentNumber} 명</Text>
              </Box>
              <Box my={2} display={"flex"}>
                <Text w={"95px"} fontSize={"lg"} fontWeight="bold">
                  성별
                </Text>
                <Text ml={"0px"}>{"성별 무관"} </Text>
              </Box>
            </VStack>
            <VStack align="start" spacing={3} w="440px" ml={"40px"}>
              <Box my={2} display={"flex"}>
                <Text w={"95px"} fontSize={"lg"} fontWeight="bold">
                  학력
                </Text>
                <Text ml={"0px"}>
                  {jobsCond.education} {jobsCond.educationDetail}
                </Text>
              </Box>
              <Box my={2} display={"flex"}>
                <Text w={"95px"} fontSize={"lg"} fontWeight="bold">
                  연령
                </Text>
                {jobsCond.age > 0 && (
                  <Text ml={"0px"}>{jobsCond.age} 세 이상</Text>
                )}
                {jobsCond.age == 0 && <Text ml={"0px"}>연령 무관</Text>}
              </Box>

              <Box my={2} display={"flex"}>
                <Text w={"95px"} fontSize={"lg"} fontWeight="bold">
                  우대사항
                </Text>
                <Text ml={"0px"}>{jobsCond.preferred}</Text>
              </Box>
            </VStack>
          </HStack>
          <Button
            onClick={handleApplyBtn}
            colorScheme="red"
            w="full"
            my={"10px"}
          >
            지원하기
          </Button>
        </Box>
      </Box>
    </>
  );
}

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
              // m={"-10px"}
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

export function JobReview({ job, jobsCond }) {
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
