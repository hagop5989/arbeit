import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  HStack,
  Image,
  Link,
  Stack,
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

export function JobDetail({ job }) {
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
          src={job.logo}
          alt={job.title}
          objectFit="cover"
        />
      </Flex>
      <Text fontSize="sm" color="gray.500" mb={2}>
        {job.hashtags}
      </Text>
      <Text fontSize="md" mb={5}>
        {job.description}
      </Text>

      <Grid templateColumns="repeat(4, 1fr)" gap={6} textAlign="center">
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {job.salary}
          </Text>
          <Text fontSize="sm" color="gray.500">
            월급
          </Text>
        </Box>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {job.duration}
          </Text>
          <Text fontSize="sm" color="gray.500">
            기간
          </Text>
        </Box>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {job.schedule}
          </Text>
          <Text fontSize="sm" color="gray.500">
            요일
          </Text>
        </Box>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {job.time}
          </Text>
          <Text fontSize="sm" color="gray.500">
            시간
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}

export function JobConditions({ job }) {
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
        <Text>기간: {job.duration}</Text>
        <Text>요일: {job.schedule}</Text>
        <Text>시간: {job.time}</Text>
      </VStack>
      <Button colorScheme="red" w="full">
        지원하기
      </Button>
    </Box>
  );
}

export function JobLocation({ job }) {
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
      <Text mb={3}>{job.location}</Text>
      <Image
        src={job.mapImage}
        alt="Map"
        w="full"
        h="200px"
        objectFit="cover"
      />
    </Box>
  );
}

export function JobDetails({ job }) {
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
      <Image
        src={
          "https://file.albamon.com/albamon/admin/GuinHtmlUpload/ImageView?fn=2024/05/img/poykrz30155038.gif"
        }
      ></Image>
      <Text>{job.details}</Text>
      <Button colorScheme="orange" mt={5} w="full">
        초간단 즉시 지원하기
      </Button>
    </Box>
  );
}

export function JobContact({ job }) {
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
            <Td>{job.contactName}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">전화</Td>
            <Td>{job.contactPhone}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">이메일</Td>
            <Td>{job.contactEmail}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">홈페이지</Td>
            <Td>
              <Link color="red.500" href={job.contactWebsite} isExternal>
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

// Example usage
export function JobsList() {
  const job = {
    contactName: "홍길동",
    contactPhone: "010-1234-5678",
    contactEmail: "example@company.com",
    contactWebsite: "https://example.com",
  };

  return (
    <Center flexDirection="column" p={5} bg="#f7f9fc">
      <Stack spacing={6}>
        <JobContact job={job} />
      </Stack>
    </Center>
  );
}

export function JobRequirements({ job }) {
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
              <Text>{job.recruitmentDeadline}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">모집인원</Text>
              <Text>{job.recruitmentNumber}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">성별</Text>
              <Text>{job.gender}</Text>
            </HStack>
          </VStack>
          <VStack align="start" spacing={3} w="60%">
            <HStack>
              <Text fontWeight="bold">학력</Text>
              <Text>{job.education}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">연령</Text>
              <Text>{job.age}</Text>
            </HStack>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">우대사항</Text>
              <Text>{job.preferredConditions}</Text>
            </VStack>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
}

export function CompanyInfo({ job }) {
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
            src={job.companyLogo}
            alt={job.companyName}
            boxSize="80px"
            objectFit="contain"
          />
          <Box flex="1" ml={5}>
            <Text fontSize="xl" fontWeight="bold">
              {job.companyName}
            </Text>
            <Text fontSize="sm" color="gray.500">
              대표: {job.representative}
            </Text>
            <Text fontSize="sm" color="gray.500">
              회사주소: {job.companyAddress}
            </Text>
          </Box>
          <Box textAlign="right">
            <Flex alignItems="center">
              {/*<Icon as={FaHeart} color="red.500" mr={2} />*/}
              <Text fontSize="sm" color="gray.500">
                관심기업 {job.favorites}명
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
      </VStack>
    </Box>
  );
}

// Example usage
export function JobsList2() {
  const job = {
    title:
      "[월최대410만가능]쿠팡CLS헬퍼리더채용(현장운영인력관리/물류관리자성장)",
    logo: "https://img11.albamon.kr/trans/150x60/2020-08-21/e31du74k1jai3zj.gif",
    hashtags: "#초간단즉시지원 #정규직전환가능 #셔틀제공",
    description:
      "4대보험 | 설립6년차 | 19년1월부터이용중 | 기업인증 | 채용1,532회",
    salary: "4,100,000원",
    duration: "1년이상",
    schedule: "요일협의",
    time: "시간협의",
    location: "경기도 김포시 양촌읍 양촌역2로 149번길 57",
    mapImage:
      "https://maps.googleapis.com/maps/api/staticmap?center=37.524879,126.792352&zoom=15&size=600x300",
    details: "상세한 직무 내용 및 요구사항.",
    contactName: "홍길동",
    contactPhone: "010-1234-5678",
    contactEmail: "example@company.com",
    companyName: "쿠팡로지스틱스서비스(유)",
    companyAddress: "서울 강남구 테헤란로 332 (역삼동, HJ타워) 9층",
    companyWebsite: "https://coupangls.modoo.at/",
    companyLogo:
      "https://img11.albamon.kr/trans/150x60/2020-08-21/e31du74k1jai3zj.gif",
    representative: "이선승, 홍용준, 강현오",
    favorites: 3439,
    jobType: "입출고·창고관리, 주차유도·안내, 포장·품질검사",
    brand: "쿠팡",
    employmentType: "계약직",
    benefits:
      "각종 경조금, 경조휴가제, 국민연금, 고용보험, 산재보험, 건강보험, 연차, 퇴직금",
    recruitmentDeadline: "상시모집",
    recruitmentNumber: "00명",
    gender: "성별무관",
    education: "학력무관",
    age: "18세 ~ 60세",
    preferredConditions:
      "운전 가능, 유사업무 경험 우대, 인근 거주 우대, 대학 재학생 우대, 대학 휴학생 우대",
  };

  return (
    <Center flexDirection="column" p={5} bg="#f7f9fc">
      <Stack spacing={6}>
        <JobDetail job={job} />
        <Divider />
        <JobConditions job={job} />
        <Divider />
        <JobLocation job={job} />
        <Divider />
        <JobRequirements job={job} />
        <Divider />
        <JobDetails job={job} />
        <Divider />
        <JobContact job={job} />
        <Divider />
        <CompanyInfo job={job} />
      </Stack>
    </Center>
  );
}
