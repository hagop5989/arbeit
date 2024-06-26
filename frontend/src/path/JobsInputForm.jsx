import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Center,
  Input,
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
import html2canvas from "html2canvas";

const styles = {
  title: {
    fontSize: "25px",
    fontWeight: "800",
    borderBottom: "3px solid gray",
  },
  td: {
    fontSize: "20px",
    fontWeight: "800",
    textAlign: "center",
    color: "black",
    border: "1px solid gray",
  },
};

export function JobsInputForm({
  showCaptureButton = true,
  setImages,
  ...props
}) {
  const printRef = useRef();
  const [captureImg, setCaptureImg] = useState(null);

  const handleCaptureClick = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current);
      const imgData = canvas.toDataURL("image/png");

      // 캡처된 이미지를 Blob으로 변환하여 File 객체 생성
      const response = await fetch(imgData);
      const blob = await response.blob();
      const file = new File([blob], "capture.png", { type: "image/png" });

      // 파일을 setImages 함수로 추가
      setImages([file]);
      setCaptureImg(imgData); // 캡처된 이미지를 상태로 저장
    }
  };

  const MyInput = ({ text, size, weight }) => {
    return (
      <Input
        w={"100%"}
        boxSizing={"border-box"}
        border={"none"}
        borderRadius={0}
        placeholder={text}
        fontSize={size}
        fontWeight={weight}
        opacity={"0.9"}
      />
    );
  };

  const Title = ({ text }) => {
    return (
      <Input
        textAlign={"center"}
        border={"none"}
        borderRadius={0}
        placeholder={text}
        fontSize={"30px"}
        fontWeight={"800"}
        color={"white"}
        opacity={"0.9"}
        h={"50px"}
      />
    );
  };

  return (
    <Box>
      <Box
        ref={printRef}
        p={10}
        w={"700px"}
        h={"100%"}
        className="App"
        border={"1px solid lightgray"}
        borderRadius={"8px"}
      >
        <Box>
          <Center
            h={"70px"}
            mb={"70px"}
            bg={"#FF7F3E"}
            color={"white"}
            borderRadius={"10px"}
          >
            <Title text={"ex) 편의점 직원을 모집합니다."} />
          </Center>
          <Box {...styles.title}>모집부문</Box>
          <Box my={4}>
            <Table>
              <Thead>
                <Tr>
                  <Th {...styles.td} w="200px">
                    모집 분야
                  </Th>
                  <Th {...styles.td} colSpan={"2"}>
                    담당 및 업무 자격 조건
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td rowSpan={"2"} border={"1px solid gray"} w={"200px"}>
                    <MyInput text={"편의점 관리"} size={"xl"} weight={"bold"} />
                  </Td>
                  <Td {...styles.td}>담당업무</Td>
                  <Td border={"1px solid gray"}>
                    <MyInput
                      text={"OO 업무 및 OO 관리"}
                      size={"medium"}
                      weight={"bold"}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td {...styles.td}>자격요건</Td>
                  <Td border={"1px solid gray"}>
                    <MyInput
                      text={"OO 사용 가능한 분 우대합니다."}
                      size={"medium"}
                      weight={"bold"}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          <Box my={8}>
            <Box {...styles.title}>근무조건</Box>
            <Box
              textIndent={"20px"}
              display={"flex"}
              flexDirection={"column"}
              gap={"10px"}
              my={"20px"}
            >
              <UnorderedList ml={"50px"} textIndent={"-10px"}>
                <ListItem>
                  <MyInput
                    text={"근무기간: 1년이상"}
                    size={"xl"}
                    weight={"bold"}
                  />
                </ListItem>
                <ListItem>
                  <MyInput
                    text={"근무요일: 주6일"}
                    size={"xl"}
                    weight={"bold"}
                  />
                </ListItem>
                <ListItem>
                  <MyInput
                    text={"근무시간: 10:00~22:00/휴게시간 120분"}
                    size={"xl"}
                    weight={"bold"}
                  />
                </ListItem>
                <ListItem>
                  <MyInput
                    text={
                      "복리후생: 국민연금, 고용보험, 산재보험, 건강보험, 퇴직금"
                    }
                    size={"xl"}
                    weight={"bold"}
                  />
                </ListItem>
              </UnorderedList>
            </Box>
          </Box>
          <Box {...styles.title}>지원조건</Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={"10px"}
            my={"20px"}
          >
            <UnorderedList ml={"50px"} textIndent={"-10px"}>
              <ListItem>
                <MyInput text={"성별: 성별무관"} size={"xl"} weight={"bold"} />
              </ListItem>
              <ListItem>
                <MyInput text={"연령: 연령무관"} size={"xl"} weight={"bold"} />
              </ListItem>
              <ListItem>
                <MyInput text={"학력: 학력무관"} size={"xl"} weight={"bold"} />
              </ListItem>

              <ListItem>
                <MyInput
                  text={"우대조건: 유사경험 우대"}
                  size={"xl"}
                  weight={"bold"}
                />
              </ListItem>
            </UnorderedList>
          </Box>
          <Box {...styles.title}>접수방법</Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={"10px"}
            my={"20px"}
          >
            <UnorderedList ml={"50px"} textIndent={"-10px"}>
              <ListItem>
                <MyInput
                  text={"접수방법: 간편문자지원, 이메일 지원, 전화연락"}
                  size={"xl"}
                  weight={"bold"}
                />
              </ListItem>
            </UnorderedList>
          </Box>
          <Text
            textIndent={"10px"}
            fontSize={"medium"}
            fontWeight={"bold"}
            color={"gray.600"}
          >
            전화 문의시 알바커넥터 에서 채용정보 보고 전화 드렸습니다 라고
            하시면 빠른 문의가 가능합니다.
          </Text>
        </Box>
      </Box>
      {showCaptureButton && (
        <Button
          bgColor={"#ef9a00"}
          color={"white"}
          w={"220px"}
          mt={5}
          onClick={handleCaptureClick}
        >
          작성내역 첨부하기(이미지)
        </Button>
      )}
      {/*{captureImg && (*/}
      {/*  <Box mt={5}>*/}
      {/*    <Heading size="md">미리보기</Heading>*/}
      {/*    <Image src={captureImg} alt="캡처된 이미지 미리보기" />*/}
      {/*  </Box>*/}
      {/*)}*/}
    </Box>
  );
}
