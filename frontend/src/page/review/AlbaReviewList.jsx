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

function AlbaReviewList(props) {
  const [review, setReview] = useState({
    memberId: "",
    jobsId: "",
    jobsTitle: "",
    content: "",
    rating: 0,
  });
  const [reviewList, setReviewList] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [contractList, setContractList] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [checkChange, setCheckChange] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onOpen: () => {
      // if (selectedContract) {
      //   selectedReview((prev) => ({
      //     ...prev,
      //     storeName: selectedContract.storeName,
      //   }));
      // }
      if (selectedReview) {
        const contract = contractList.find(
          (contract) =>
            contract.jobsId === selectedReview.jobsId &&
            contract.albaId === selectedReview.memberId,
        );
        setReview({
          ...selectedReview,
          startDate: contract ? contract.startDate : "",
          endDate: contract ? contract.endDate : "",
          storeName: contract ? contract.storeName : "",
        });
        setSelectedContract(contract || null);
      } else if (contractList.length > 0) {
        const contract = contractList[0];
        setSelectedContract(contract);
        setReview({
          memberId: account.id,
          jobsId: contract.jobsId,
          jobsTitle: contract.jobsTitle,
          content: "",
          rating: 0,
          startDate: contract.startDate,
          endDate: contract.endDate,
          storeName: contract.storeName,
        });
      }
    },
    onClose: () => {
      setSelectedContract(null);
      setReview({
        memberId: "",
        jobsId: "",
        jobsTitle: "",
        content: "",
        rating: 0,
        startDate: "",
        endDate: "",
        storeName: "",
      });
      setSelectedReview(null); // 추가: selectedReview 초기화
    },
  });

  // Read (리스트 받기)
  useEffect(() => {
    if (account.id) {
      axios
        .get("/api/review/list")
        .then((res) => {
          const validContracts = res.data.contractList.filter(
            // 계약 종료일이 오늘보다 적은 경우의 리스트 추출
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
    const jobsId = parseInt(e.target.value);
    const contract = contractList.find(
      (contract) => contract.jobsId == jobsId && contract.albaId == account.id,
    );
    if (contract) {
      setSelectedContract(contract);
      setReview((prev) => ({
        ...prev,
        jobsTitle: contract.jobsTitle,
        jobsId: contract.jobsId,
      }));
    }
  };

  // 모달 관련

  useEffect(() => {
    if (isOpen) {
      if (selectedReview) {
        setReview({
          memberId: selectedReview.memberId,
          jobsId: selectedReview.jobsId,
          jobsTitle: selectedReview.jobsTitle,
          content: selectedReview.content,
          rating: selectedReview.rating,
        });
        setSelectedContract(null);
      } else if (contractList.length > 0) {
        const contract = contractList[0];
        setSelectedContract(contract);
        setReview({
          memberId: account.id,
          jobsId: contract.jobsId,
          jobsTitle: contract.jobsTitle,
          content: "",
          rating: 0,
        });
      }
    }
  }, [isOpen, selectedReview, contractList, account.id]);

  const handleReviewClick = (review) => {
    const contract = contractList.find(
      (contract) =>
        contract.jobsId === review.jobsId &&
        contract.albaId === review.memberId,
    );
    setSelectedReview(review);
    setSelectedContract(contract);
    setReview({
      memberId: review.memberId,
      jobsId: review.jobsId,
      jobsTitle: review.jobsTitle,
      content: review.content,
      rating: review.rating,
      startDate: contract ? contract.startDate : "",
      endDate: contract ? contract.endDate : "",
      storeName: contract ? contract.storeName : "",
    });
    onOpen();
  };

  const handleInputChange = (field) => (e) => {
    setReview((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  useEffect(() => {
    if (contractList.length > 0 && !selectedContract) {
      setSelectedContract(contractList[0]);
      setReview((prev) => ({
        ...prev,
        jobsTitle: contractList[0].jobsTitle,
        jobsId: contractList[0].jobsId,
      }));
    }
  }, [contractList]);

  // Delete
  function handleDelete(review) {
    axios
      .delete(`/api/review/${review.jobsId}`)
      .then((res) => {
        myToast("삭제 되었습니다.", "success");
        fetchReviewList();
      })
      .catch(() => {
        myToast("에러발생", "error");
      })
      .finally();
  }

  const fetchReviewList = () => {
    if (account.id) {
      axios
        .get("/api/review/list")
        .then((res) => {
          const validContracts = res.data.contractList.filter(
            (contract) => contract.endDate <= today,
          );
          setReviewList(res.data.reviewList);
          setContractList(validContracts);
        })
        .catch((err) => myToast("로드 오류발생", "error"))
        .finally();
    }
  };

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

  const selectedValue = selectedReview
    ? selectedReview.jobsId
    : selectedContract
      ? selectedContract.jobsId
      : "";

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
    <Box w={"full"} h={"80vh"}>
      <Box display="flex" justifyContent="space-between">
        <Heading mb={"10px"} p={1}>
          리뷰관리(알바)
        </Heading>
        {account.isAlba() && (
          <Button onClick={onOpen} w={"70px"} colorScheme={"blue"}>
            입력
          </Button>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} w={"800px"}>
        <ModalOverlay />
        <ModalContent maxW="600px" h={"500px"}>
          <ModalBody>
            <Heading textAlign={"center"}>리뷰작성</Heading>
            <Divider mt={"10px"} borderWidth={"1px"} />

            <Select
              value={selectedContract ? selectedContract.jobsId : ""}
              onChange={handleContractChange}
              // isDisabled={!!selectedReview}
            >
              <option value={""} disabled>
                계약기간 종료된 것만 선택가능 합니다.
              </option>
              {contractList.map((contract) => (
                <option key={contract.jobsId} value={contract.jobsId}>
                  {contract.jobsTitle}
                </option>
              ))}
            </Select>
            <Text fontSize={"sm"}> 항목을 선택해주세요.</Text>

            {selectedReview && (
              <Box
                ml={4}
                my={4}
                display={"flex"}
                flexDirection={"column"}
                gap={"20px"}
              >
                <Box display={"flex"}>
                  <Heading fontSize={"2xl"}>알바기간</Heading>
                  <Text
                    ml={10}
                    fontSize="lg"
                    fontWeight={"bold"}
                    lineHeight={"35px"}
                  >
                    {selectedReview.startDate} ~ {selectedReview.endDate}
                  </Text>
                </Box>
                <Box display={"flex"}>
                  <Heading fontSize={"2xl"}>사업장명</Heading>
                  <Text
                    ml={10}
                    letterSpacing={"1px"}
                    fontSize="xl"
                    fontWeight={"bold"}
                    lineHeight={"35px"}
                  >
                    {selectedReview.storeName}
                  </Text>
                </Box>

                <Box mt={6}>
                  <Heading fontSize={"2xl"}>한 줄 리뷰</Heading>
                  <Input
                    w={"500px"}
                    mt={2}
                    value={review.content}
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

            {!selectedReview && selectedContract && (
              <Box
                ml={4}
                my={4}
                display={"flex"}
                flexDirection={"column"}
                gap={"20px"}
              >
                <Box display={"flex"}>
                  <Heading fontSize={"2xl"}>알바기간</Heading>
                  <Text
                    ml={10}
                    fontSize="lg"
                    fontWeight={"bold"}
                    lineHeight={"35px"}
                  >
                    {selectedContract.startDate} ~ {selectedContract.endDate}
                  </Text>
                </Box>
                <Box display={"flex"}>
                  <Heading fontSize={"2xl"}>사업장명</Heading>
                  <Text
                    ml={10}
                    letterSpacing={"1px"}
                    fontSize="xl"
                    fontWeight={"bold"}
                    lineHeight={"35px"}
                  >
                    {selectedContract.storeName}
                  </Text>
                </Box>

                <Box mt={6}>
                  <Heading fontSize={"2xl"}>한 줄 리뷰</Heading>
                  <Input
                    w={"500px"}
                    mt={2}
                    value={review.content}
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

      <Divider mb={"40px"} borderWidth={"2px"} />
      <Table>
        <Thead>
          <Tr>
            <Th fontSize={"medium"}>#</Th>
            <Th fontSize={"medium"}>날짜</Th>
            <Th fontSize={"medium"}>공고명</Th>
            <Th fontSize={"medium"}>리뷰평</Th>
            <Th fontSize={"medium"}>평점</Th>
            <Th fontSize={"medium"}>관리</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reviewList.map((review, index) => (
            <Tr key={index} fontSize={"15px"} _hover={{ bgColor: "orange.50" }}>
              <Td minW={"80px"}>{index + 1}</Td>
              <Td fontSize={"sm"} minW={"130px"}>
                {review.inserted}
              </Td>
              <Td
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                cursor={"pointer"}
                onClick={() => navigate(`/jobs/${review.jobsId}`)}
              >
                {review.jobsTitle}
              </Td>
              <Td
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                cursor={"pointer"}
                onClick={() => handleReviewClick(review)}
              >
                {review.content}
              </Td>
              <Td
                minW={"90px"}
                fontSize={"2xl"}
                fontWeight={"bold"}
                color={"teal"}
              >
                {review.rating}
              </Td>
              <Td>
                <Flex gap={"5px"}>
                  <Button
                    fontWeight={"500"}
                    bgColor={"#FF7F3E"}
                    color={"white"}
                    onClick={() => handleReviewClick(review)}
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
  );
}

export default AlbaReviewList;
