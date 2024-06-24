import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BossReviewList(props) {
  const [review, setReview] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [contractList, setContractList] = useState([]);
  const [selectedContract, setSelectedContract] = useState({});
  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [checkChange, setCheckChange] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onOpen: () => {
      if (contractList.length > 0) {
        const contract = contractList[0];
        setSelectedContract(contract);
        setReview({
          memberId: account.id,
          jobsId: contract.jobsId,
          jobsTitle: contract.jobsTitle,
          content: contract.content,
          rating: 0,
        });
      }
    },
    onClose: () => {
      setSelectedContract(null);
      setReview({});
    },
  });

  // Read (리스트 받기)
  useEffect(() => {
    if (account.id) {
      axios
        .get("/api/review/list")
        .then((res) => {
          const validContracts = res.data.contractList.filter(
            (contract) => contract.endDate <= today,
          );
          setReviewList(res.data.reviewList);
          setContractList(validContracts); // 필터링된 contractList 설정
        })
        .catch((err) => myToast("로드 오류발생", "error"))
        .finally();
    }
  }, [account.id, checkChange]);

  // Create
  function handleSubmit() {
    setReview((prev) => ({
      ...prev,
      memberId: account.id,
      jobsId: selectedContract.jobsId,
      jobsTitle: selectedContract.jobsTitle,
    }));
    axios
      .post("/api/review", review)
      .then((res) => {
        myToast("작성이 완료되었습니다.", "success");
        onClose();
        setCheckChange(!checkChange);
      })
      .catch(() => {
        myToast(
          `작성 불가. \n 빈칸이나, 이미 작성하신 내역이 있는지 확인해주세요.`,
          "error",
        );
      })
      .finally();
  }

  const handleContractChange = (e) => {
    const contractId = e.target.value;
    const contract = contractList.find((contract) => contract.id == contractId);
    setSelectedContract(contract);
    setReview((prev) => ({
      ...prev,
      jobsTitle: contract.jobsTitle,
      jobsId: contract.jobsId,
    }));
  };

  const handleInputChange = (field) => (e) => {
    setReview((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  useEffect(() => {
    if (contractList > 0) {
      selectedContract(contractList[0]);
    }
  }, [contractList]);

  // Delete
  function handleDelete(review) {
    axios
      .delete(`/api/review/${review.jobsId}`)
      .then((res) => {
        myToast("삭제 되었습니다.", "success");
        setCheckChange(!checkChange);
      })
      .catch(() => {
        myToast("에러발생", "error");
      })
      .finally();
  }

  const handleRatingChange = (newRating) => {
    setReview((prev) => ({
      ...prev,
      rating: newRating,
    }));
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Box
          as="span"
          key={i}
          onClick={() => handleRatingChange(i)}
          color={review.rating >= i ? "gold" : "gray.300"}
          cursor="pointer"
          fontSize="2xl"
        >
          ★
        </Box>,
      );
    }
    return stars;
  };

  // toast 커스텀
  function myToast(text, status) {
    toast({
      description: <Box whiteSpace="pre-line">{text}</Box>,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  return (
    <Box w={"full"}>
      <Box
        w={"full"}
        h={"30vh"}
        // border={"1px solid blue"}
      >
        <Box
          h={"30vh"}
          // border={"1px solid red"}
        >
          <Box display="flex" justifyContent="space-between">
            <Heading mb={"10px"} p={1}>
              직원 평가
            </Heading>
            {account.isBoss() && (
              <Button onClick={onOpen} w={"70px"} colorScheme={"blue"}>
                입력
              </Button>
            )}
          </Box>

          {/* 모달 */}

          <Modal isOpen={isOpen} onClose={onClose} w={"800px"}>
            <ModalOverlay />
            <ModalContent maxW="600px" h={"500px"}>
              <ModalBody lineHeight={"30px"}>
                <Heading textAlign={"center"}>직원평가</Heading>
                <Divider mt={"10px"} borderWidth={"1px"} />

                <Select
                  value={selectedContract ? selectedContract.id : ""}
                  onChange={handleContractChange}
                >
                  <option value={""} disabled>
                    계약기간 종료된 것만 선택가능 합니다.
                  </option>
                  {contractList.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.jobsTitle}
                    </option>
                  ))}
                </Select>
                <Text fontSize={"sm"}> 항목을 선택해주세요.</Text>
                {selectedContract && (
                  <Box
                    ml={4}
                    my={4}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={"20px"}
                  >
                    <Box display={"flex"}>
                      <Heading w={"90px"} fontSize={"2xl"}>
                        알바기간
                      </Heading>
                      <Text
                        ml={10}
                        fontSize="lg"
                        fontWeight={"bold"}
                        lineHeight={"35px"}
                      >
                        {selectedContract.startDate} ~{" "}
                        {selectedContract.endDate}
                      </Text>
                    </Box>
                    <Box display={"flex"}>
                      <Heading w={"90px"} fontSize={"2xl"}>
                        직원명
                      </Heading>
                      <Text
                        ml={10}
                        letterSpacing={"1px"}
                        fontSize="xl"
                        fontWeight={"bold"}
                        lineHeight={"35px"}
                      >
                        {selectedContract.albaName}
                      </Text>
                    </Box>

                    <Box mt={6}>
                      <Heading fontSize={"2xl"}>한 줄 리뷰</Heading>
                      <Input
                        w={"500px"}
                        mt={2}
                        onChange={handleInputChange("content")}
                        placeholder={"리뷰를 입력해주세요."}
                      />
                    </Box>
                    <Box>
                      <Flex>
                        <Heading fontSize={"2xl"}>평점</Heading>
                        <Heading fontSize={"2xl"} ml={3}>
                          {review.rating}
                        </Heading>
                      </Flex>
                      <Flex mt={2}>{renderStars()}</Flex>
                    </Box>
                  </Box>
                )}
              </ModalBody>
              <ModalFooter gap={"10px"} mt={"-40px"}>
                <Button onClick={handleSubmit} colorScheme={"blue"}>
                  저장
                </Button>
                <Button onClick={onClose} colorScheme={"teal"}>
                  취소
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* 모달 */}

          <Divider mb={"40px"} borderWidth={"2px"} />
          <Table>
            <Thead>
              <Tr>
                <Th fontSize={"medium"}>#</Th>
                <Th fontSize={"medium"}>날짜</Th>
                {/*<Th fontSize={"medium"}>사업장명</Th>*/}
                <Th fontSize={"medium"}>공고명</Th>
                <Th fontSize={"medium"}>리뷰평</Th>
                <Th fontSize={"medium"}>평점</Th>
                <Th fontSize={"medium"}>관리</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reviewList.map((review, index) => (
                <Tr
                  key={review.id}
                  fontSize={"15px"}
                  _hover={{ bgColor: "orange.50" }}
                >
                  <Td minW={"80px"}>{index + 1}</Td>
                  {/* 날짜 */}
                  <Td fontSize={"sm"} minW={"130px"}>
                    {review.inserted}
                  </Td>
                  {/* 공고명 */}
                  <Td
                    whiteSpace="nowrap" // 줄 바꿈을 막음
                    overflow="hidden" // 넘친 내용을 숨김
                    textOverflow="ellipsis" // 넘친 내용을 "..."으로 표시
                    cursor={"pointer"}
                    onClick={() => navigate(`/jobs/${review.jobsId}`)}
                  >
                    {review.jobsTitle}
                  </Td>
                  {/* 리뷰평 */}
                  <Td
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    cursor={"pointer"}
                    // onClick={() =>
                    //   navigate(`/jobs/${review.resumeId}/review/select`, {
                    //     state: { jobsId: review.jobsId },
                    //   })
                    // }
                  >
                    {review.content}
                  </Td>
                  {/*평점*/}
                  <Td
                    minW={"90px"}
                    fontSize={"2xl"}
                    fontWeight={"bold"}
                    color={"teal"}
                  >
                    {review.rating}
                  </Td>

                  {/* 관리 버튼*/}
                  <Td>
                    <Flex gap={"5px"}>
                      <Button
                        fontWeight={"500"}
                        bgColor={"#FF7F3E"}
                        color={"white"}
                      >
                        수정
                      </Button>
                      <Button
                        onClick={() => handleDelete(review)}
                        fontWeight={"500"}
                        bgColor={"red.500"}
                        color={"white"}
                      >
                        삭제
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      {/* 내 사업장 리뷰 */}
      <Box
        h={"30vh"}
        // border={"1px solid red"}
        mt={"100px"}
      >
        <Box display="flex" justifyContent="space-between">
          <Heading mb={"10px"} p={1}>
            내 사업장 리뷰
          </Heading>
        </Box>

        <Divider mb={"40px"} borderWidth={"2px"} />
        <Table>
          <Thead>
            <Tr>
              <Th fontSize={"medium"}>#</Th>
              <Th fontSize={"medium"}>날짜</Th>
              {/*<Th fontSize={"medium"}>사업장명</Th>*/}
              <Th fontSize={"medium"}>공고명</Th>
              <Th fontSize={"medium"}>리뷰평</Th>
              <Th fontSize={"medium"}>평점</Th>
              {/*<Th fontSize={"medium"}>관리</Th>*/}
            </Tr>
          </Thead>
          <Tbody>
            {reviewList.map((review, index) => (
              <Tr
                key={review.id}
                fontSize={"15px"}
                _hover={{ bgColor: "orange.50" }}
              >
                <Td minW={"80px"}>{index + 1}</Td>
                {/* 날짜 */}
                <Td fontSize={"sm"} minW={"130px"}>
                  {review.inserted}
                </Td>
                {/* 공고명 */}
                <Td
                  whiteSpace="nowrap" // 줄 바꿈을 막음
                  overflow="hidden" // 넘친 내용을 숨김
                  textOverflow="ellipsis" // 넘친 내용을 "..."으로 표시
                  cursor={"pointer"}
                  onClick={() => navigate(`/jobs/${review.jobsId}`)}
                >
                  {review.jobsTitle}
                </Td>
                {/* 리뷰평 */}
                <Td
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  cursor={"pointer"}
                  // onClick={() =>
                  //   navigate(`/jobs/${review.resumeId}/review/select`, {
                  //     state: { jobsId: review.jobsId },
                  //   })
                  // }
                >
                  {review.content}
                </Td>
                {/*평점*/}
                <Td
                  minW={"90px"}
                  fontSize={"2xl"}
                  fontWeight={"bold"}
                  color={"teal"}
                >
                  {review.rating}
                </Td>

                {/* 관리 버튼*/}
                {/*<Td></Td>*/}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default BossReviewList;
