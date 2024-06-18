import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Image,
  Link,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";

export function JobDetail({ job, jobsCond }) {
  if (!job || !jobsCond) {
    return null;
  }
  console.log(job);
  console.log(jobsCond);

  return (
    <Box
      w={"full"}
      maxW={"800px"}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      m="2"
      bg="white"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Text fontSize="2xl" fontWeight="bold">
          {job.title}
        </Text>
        <Image
          w={"150px"}
          h={"60px"}
          // src={job.logo}
          alt={job.title}
          borderRadius={"4px"}
          objectFit="cover"
        />
      </Flex>
      <Text fontSize="sm" color="gray.500" mb={2}>
        {"job.hashtags"}
      </Text>
      <Text fontSize="md" mb={5}>
        {job.content}
      </Text>

      <Grid templateColumns="repeat(4, 1fr)" gap={6} textAlign="center">
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {job.salary} 원
          </Text>
          <Text fontSize="sm" color="gray.500">
            시급
          </Text>
        </Box>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {jobsCond.workPeriod}
          </Text>
          <Text fontSize="sm" color="gray.500">
            기간
          </Text>
        </Box>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {jobsCond.workWeek}
          </Text>
          <Text fontSize="sm" color="gray.500">
            요일
          </Text>
        </Box>
        <Box mt={"-20px"}>
          <Text fontSize="medium" fontWeight="bold">
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
  return (
    <Box
      w={"full"}
      maxW={"800px"}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      m="2"
      bg="white"
    >
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        모집조건
      </Text>
      <VStack align="start" spacing={2} mb={5}>
        <Text>급여: {job.salary}</Text>
        <Text>기간: {jobsCond.workPeriod}</Text>
        <Text>요일: {jobsCond.workWeek}</Text>
        <Text>시간: {jobsCond.workTime}</Text>
      </VStack>
      <Button colorScheme="red" w="full">
        지원하기
      </Button>
    </Box>
  );
}

export function JobLocation({ job, jobsCond }) {
  return (
    <Box
      w={"full"}
      maxW={"800px"}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      m="2"
      bg="white"
    >
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        근무지역
      </Text>
      <Text mb={3}>{"job.location"}</Text>
      <Image
        // src={job.mapImage}
        alt="Map"
        w="full"
        h="200px"
        objectFit="cover"
      />
    </Box>
  );
}

export function JobDetails({ job, jobsCond }) {
  return (
    <Box
      w={"full"}
      maxW={"800px"}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      m="2"
      bg="white"
    >
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        상세요강
      </Text>
      <Image src={""}></Image>
      <Text>{job.content}</Text>
      <Button colorScheme="orange" mt={5} w="full">
        지원하기
      </Button>
    </Box>
  );
}

export function JobContact({ job, jobsCond }) {
  return (
    <Box
      w={"full"}
      maxW={"800px"}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      m="2"
      bg="white"
    >
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        채용담당자 연락처
      </Text>
      <Table variant="simple">
        <Tbody>
          <Tr>
            <Td fontWeight="bold">담당자</Td>
            <Td>{"job.contactName"}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">전화</Td>
            <Td>{"job.contactPhone"}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">이메일</Td>
            <Td>{"job.contactEmail"}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">홈페이지</Td>
            <Td>
              <Link color="red.500" href={"job.contactWebsite"} isExternal>
                홈페이지방문
              </Link>
            </Td>
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

export function JobRequirements({ job, jobsCond }) {
  return (
    <Box
      w={"full"}
      maxW={"800px"}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      m="2"
      bg="white"
    >
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        모집조건
      </Text>
      <Divider mb={4} />
      <Box mx={3}>
        <HStack spacing={10} w="full" alignItems="start">
          <VStack align="start" spacing={3} w="40%">
            <HStack>
              <Text fontWeight="bold">모집마감</Text>
              <Text>{job.deadLine}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">모집인원</Text>
              <Text>{job.recruitmentNumber}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">성별</Text>
              <Text>{"job.gender"}</Text>
            </HStack>
          </VStack>
          <VStack align="start" spacing={3} w="60%">
            <HStack>
              <Text fontWeight="bold">학력</Text>
              <Text>{jobsCond.education}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">연령</Text>
              <Text>{jobsCond.age}</Text>
            </HStack>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">우대사항</Text>
              <Text>{jobsCond.preferred}</Text>
            </VStack>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
}

export function CompanyInfo({ job, jobsCond }) {
  return (
    <Box
      w={"full"}
      maxW={"800px"}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      m="2"
      bg="white"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Text fontSize="2xl" fontWeight="bold">
          기업정보
        </Text>
        <Link color="gray.500" href="#" fontSize="sm">
          상세보기
        </Link>
      </Flex>
      <Divider mb={5} />
      <VStack align="start" spacing={4}>
        <Flex justifyContent="space-between" alignItems="center" w="full">
          <Image
            // src={job.companyLogo}
            alt={job.storeName}
            boxSize="80px"
            objectFit="contain"
          />
          <Box flex="1" ml={5}>
            <Text fontSize="xl" fontWeight="bold">
              {job.storeName}
            </Text>
            <Text fontSize="sm" color="gray.500">
              대표: {"대표명"}
            </Text>
            <Text fontSize="sm" color="gray.500">
              회사주소: {job.address}
            </Text>
          </Box>
          <Box textAlign="right">
            <Flex alignItems="center">
              {/*<Icon as={FaHeart} color="red.500" mr={2} />*/}
              <Text fontSize="sm" color="gray.500">
                관심기업 {"000"}명
              </Text>
            </Flex>
          </Box>
        </Flex>
        <Divider />
        <HStack spacing={1} w="full">
          <Box w={"20%"} fontWeight={"600"} borderRight={"3px solid lightgray"}>
            안심할 수 있는 기업이에요
          </Box>
          <VStack align="start" spacing={2} mx={3} w="40%">
            <HStack>
              <FontAwesomeIcon icon={faBuilding} color={"teal"} />
              <Text fontSize="sm">4대 사회보험 가입 완료</Text>
            </HStack>
            <HStack>
              <FontAwesomeIcon icon={faBuilding} />
              <Text fontSize="sm">2019년 1월부터 알바몬 이용 중</Text>
            </HStack>
            <HStack>
              <FontAwesomeIcon icon={faBuilding} color={"teal"} />
              <Text fontSize="sm">설립 6년! 안정적 기업</Text>
            </HStack>
            <HStack>
              <FontAwesomeIcon icon={faBuilding} />
              <Text fontSize="sm">알바몬 기업인증 완료(23.05.23)</Text>
            </HStack>
            <HStack>
              <FontAwesomeIcon icon={faBuilding} color={"teal"} />
              <Text fontSize="sm">알바몬 근로계약서 작성 약속</Text>
            </HStack>
          </VStack>
          <VStack align="start" spacing={1} w="60%" h="full">
            <Flex>
              <Box
                w={"35%"}
                fontWeight={"600"}
                mr={3}
                borderRight={"3px solid lightgray"}
              >
                <Text mr={2}>구인이 활발한 기업이에요</Text>
              </Box>
              <Box mt={-10}>
                <Text fontSize="sm" ml={2}>
                  <FontAwesomeIcon icon={faBuilding} color={"teal"} />
                  {"  "}
                  최근 1년간 채용 1,532회 진행
                </Text>
              </Box>
            </Flex>
          </VStack>
        </HStack>
        <Divider />
      </VStack>
    </Box>
  );
}

export function JobReview({ job, jobsCond }) {
  return (
    <Box
      w={"full"}
      maxW={"800px"}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      border={"1px solid lightgray"}
      m="2"
      bg="white"
    >
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        기업리뷰
      </Text>
      <Divider mb={4} />
      <Box mx={3}>
        <HStack spacing={10} w="full" alignItems="start" alignItems="center">
          <VStack align="start" spacing={3} w="50%">
            <HStack>
              <Text fontWeight="bold">기업평점</Text>
              <Text>{"7 / 10"}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">기업경쟁률</Text>
              <Text>{" 33 : 1"}</Text>
            </HStack>
          </VStack>
          <VStack align="start" spacing={3} w="40%">
            <HStack>
              <Text fontWeight="bold">최근 리뷰 목록</Text>
            </HStack>
            <VStack align="start" spacing={1}>
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
