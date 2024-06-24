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
  const [contractList, setContractList] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [checkChange, setCheckChange] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onOpen: () => {
      console.log("onOpen");
      console.log(review);
      const contract = contractList.find(
        (contract) =>
          contract.jobsId === review.jobsId &&
          contract.albaId === review.memberId,
      );
      if (review.action) {
        setReview((prev) => ({
          ...prev,
          startDate: contract ? contract.startDate : "",
          endDate: contract ? contract.endDate : "",
          storeName: contract ? contract.storeName : "",
          action: review.action || "",
        }));
        setSelectedContract(contract || null);
      } else if (contractList.length > 0) {
        const contract = contractList[0];
        setSelectedContract(contract);
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
        action: "",
      });
    },
  });

  useEffect(() => {
    if (account.id) {
      axios
        .get("/api/review/list")
        .then((res) => {
          const validContracts = res.data.contractList.filter(
            (contract) => contract.endDate <= today,
          );

          const updatedReviewList = res.data.reviewList.map((review) => {
            const contract = validContracts.find(
              (contract) =>
                contract.jobsId === review.jobsId &&
                contract.albaId === review.memberId,
            );
            return {
              ...review,
              startDate: contract ? contract.startDate : "",
              endDate: contract ? contract.endDate : "",
              storeName: contract ? contract.storeName : "",
            };
          });

          setReviewList(updatedReviewList);
          setContractList(validContracts);
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

  const handleModalSelect = (e) => {
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
        startDate: contract.startDate, // 추가
        endDate: contract.endDate, // 추가
        storeName: contract.storeName, // 추가
      }));
    }
  };

  // 모달 관련

  useEffect(() => {
    if (isOpen && review) {
      if (review) {
        setReview({
          memberId: review.memberId,
          jobsId: review.jobsId,
          jobsTitle: review.jobsTitle,
          content: review.content,
          rating: review.rating,
          action: review.action || "",
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
          action: "",
        });
      }
    }
  }, [isOpen, contractList, account.id]);

  const handleReviewClick = (review, action) => {
    console.log("handleReviewClick start");
    console.log(review);
    // setAction(action);
    const contract = contractList.find(
      (contract) =>
        contract.jobsId === review.jobsId &&
        contract.albaId === review.memberId,
    );
    const updatedReview = {
      ...review,
      startDate: contract ? contract.startDate : "",
      endDate: contract ? contract.endDate : "",
      storeName: contract ? contract.storeName : "",
      action: action || "", // action 설정
    };

    setReview(updatedReview);
    console.log("updatedReview");
    console.log(updatedReview);
    // setSelectedReview(updatedReview);
    setSelectedContract(contract);
    setTimeout(() => onOpen(), 0); // setReview 후에 onOpen 호출
    console.log("setSelectedContract");
    console.log(selectedContract);
    console.log(review);
    console.log("contractList");
    console.log(contractList);
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

  // Update
  function handleUpdate(review) {
    axios
      .put("api/review", review)
      .then((res) => {
        myToast("수정 되었습니다.", "success");
        onClose();
        fetchReviewList();
      })
      .catch(() => {
        myToast("에러발생", "error");
      })
      .finally();
  }
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

  // 새로고침
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

  // 별점 매기기 1
  const handleRatingChange = (newRating) => {
    setReview((prev) => ({
      ...prev,
      rating: newRating,
    }));
  };
  // 별점 매기기 2
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
            {review && review.action === "선택" && (
              <Heading textAlign={"center"}>리뷰보기</Heading>
            )}
            {(review == null || review.action !== "선택") && (
              <Heading textAlign={"center"}>리뷰작성</Heading>
            )}
            <Divider mt={"10px"} borderWidth={"1px"} />
            <Text fontSize={"sm"}>공고명</Text>
            <Text fontSize={"3xl"} fontWeight={"bold"} mb={3}>
              {review.action && review.jobsTitle}
            </Text>
            {!review.action && (
              <Select
                value={selectedContract ? selectedContract.jobsId : ""}
                onChange={handleModalSelect}
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
            )}

            {review && (
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
                    {review.startDate} ~ {review.endDate}
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
                    {review.storeName}
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

            {!review && (
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
            {review.action === "수정" && (
              <Button onClick={() => handleUpdate(review)} color={"green"}>
                수정
              </Button>
            )}
            {review.action !== "선택" && review.action !== "수정" && (
              <Button onClick={handleSubmit} colorScheme={"blue"}>
                저장
              </Button>
            )}
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
                onClick={() => handleReviewClick(review, "선택")}
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
                    onClick={() => handleReviewClick(review, "수정")}
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
