import React from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts"; // 주요 색상 정의

// 주요 색상 정의
const colors = {
  primary: "#FF6F61", // 팬톤 색상 기준 트랜디한 주황색
  white: "#FFFFFF",
  black: "#000000",
  grayBg: "#F2F2F2", // 연한 회색 배경
};

const data = [
  { name: "합격자 수", value: 20 },
  { name: "불합격 수", value: 60 },
];

const COLORS = ["teal", "#f46c6c"]; // 강조색과 보조색

const renderCustomizedLabel = ({ percent, name }) => {
  return `${(percent * 100).toFixed(0)}%`;
};

function Statistics(props) {
  const totalApplicants = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Box p={6} w={"1050px"} bg={colors.grayBg}>
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem colSpan={1}>
          <Box
            bg={colors.white}
            h={"215px"}
            p={4}
            borderRadius="md"
            boxShadow="lg" // 박스 그림자 효과 강화
            border={`1px solid ${colors.primary}`}
          >
            <Image src="mega-coffee-logo.png" alt="Mega Coffee Logo" mb={2} />
            <Text color={colors.black} fontWeight="medium">
              (주) 메가커피
            </Text>
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box
            bg={colors.white}
            p={4}
            borderRadius="md"
            boxShadow="lg" // 박스 그림자 효과 강화
            border={`1px solid ${colors.primary}`}
          >
            <Heading size="md" mb={3} color={colors.primary}>
              최근공고
            </Heading>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>날짜</Th>
                  <Th>제목</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr height="40px">
                  <Td>1</Td>
                  <Td>2024/01/20</Td>
                  <Td>OOO 알바생 모집합니다</Td>
                </Tr>
                <Tr height="40px">
                  <Td>2</Td>
                  <Td>2024/03/20</Td>
                  <Td>OOO 알바생 모집합니다</Td>
                </Tr>
                <Tr height="40px">
                  <Td>3</Td>
                  <Td>2024/05/20</Td>
                  <Td>OOO 알바생 모집합니다</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </GridItem>

        <GridItem colSpan={1}>
          <Box
            bg={colors.white}
            p={4}
            h={"130px"}
            borderRadius="md"
            boxShadow="lg" // 박스 그림자 효과 강화
            border={`1px solid ${colors.primary}`}
          >
            <Text color={colors.black}>평균 리뷰 점수</Text>
            <Heading mt={3} size="2xl" color={colors.primary}>
              😊 7 / 10
            </Heading>
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Box
            bg={colors.white}
            h={"130px"}
            p={4}
            borderRadius="md"
            boxShadow="lg" // 박스 그림자 효과 강화
            border={`1px solid ${colors.primary}`}
          >
            <Text fontWeight="bold" mb={2} color={colors.primary}>
              최근 리뷰
            </Text>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>내용</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr height="20px">
                  <Td>1</Td>
                  <Td>사장님이 친절해요</Td>
                </Tr>
                <Tr height="20px">
                  <Td>2</Td>
                  <Td>월급이 너무 짜요</Td>
                </Tr>
                <Tr height="20px">
                  <Td>3</Td>
                  <Td>너무 알바생 귀찮히는 듯</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Box
            bg={colors.white}
            h={"130px"}
            p={4}
            borderRadius="md"
            boxShadow="lg" // 박스 그림자 효과 강화
            border={`1px solid ${colors.primary}`}
          >
            <Text color={colors.black} fontSize="sm">
              이번 달 지출 알바비
            </Text>
            <Heading size="lg" color={colors.primary}>
              23,456,789 원
            </Heading>
            <Text fontSize="xs" color={colors.black}>
              (예정)
            </Text>
          </Box>
        </GridItem>

        <GridItem colSpan={1} rowSpan={2}>
          <Box
            bg={colors.white}
            p={4}
            h={"300px"}
            borderRadius="md"
            boxShadow="lg" // 박스 그림자 효과 강화
            border={`1px solid ${colors.primary}`}
          >
            <Text color={colors.black}>캘린더</Text>
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box
            bg={colors.white}
            p={4}
            borderRadius="md"
            boxShadow="lg" // 박스 그림자 효과 강화
            border={`1px solid ${colors.primary}`}
          >
            <Text fontWeight="bold" mb={2} color={colors.primary}>
              이달의 일정
            </Text>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>날짜</Th>
                  <Th>내용</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr height="40px">
                  <Td>1</Td>
                  <Td>06.27</Td>
                  <Td>OO가게 면접</Td>
                </Tr>
                <Tr height="40px">
                  <Td>2</Td>
                  <Td>06.30</Td>
                  <Td>OO가게 출근</Td>
                </Tr>
                <Tr height="40px">
                  <Td>3</Td>
                  <Td>06.31</Td>
                  <Td>OO가게 계약종료</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </GridItem>

        <GridItem colSpan={1} rowSpan={1}>
          <Box
            bg={colors.white}
            p={4}
            borderRadius="md"
            boxShadow="lg" // 박스 그림자 효과 강화
            border={`1px solid ${colors.primary}`}
          >
            <Text my={2} fontWeight="bold" color={colors.primary}>
              지원통계
            </Text>
            <VStack align="start" spacing={1} color={colors.black}>
              <Text>지원자 수: 80 명</Text>
              <Text>합격자 수: 20 명</Text>
              <Text>불합격 수: 60 명</Text>
            </VStack>
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Box
            bg={colors.white}
            p={4}
            borderRadius="md"
            boxShadow="lg" // 박스 그림자 효과 강화
            border={`1px solid ${colors.primary}`}
            height="300px"
            position="relative"
          >
            <Text fontWeight="bold" color={colors.primary}>
              지원자 통계도표
            </Text>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  innerRadius={60} // 도넛 형태로 만들기 위해 innerRadius 설정
                  label={renderCustomizedLabel}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value) => `${value} 명`}
                  wrapperStyle={{ zIndex: 1 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <Box
              mt={"20px"}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              textAlign="center"
            >
              <Text fontWeight="bold" fontSize="lg" color={"gray.600"}>
                총지원자
              </Text>
              <Text fontWeight="bold" color={"gray.600"} fontSize="2xl">
                {totalApplicants} 명
              </Text>
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Statistics;
