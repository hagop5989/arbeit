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
  const account = useContext(LoginContext);
  const [review, setReview] = useState({
    bossId: account.id,
    albaId: "",
    jobsId: "",
    jobsTitle: "",
    content: "",
    rating: 0,
  });
  const [reviewList, setReviewList] = useState([]);
  const [contractList, setContractList] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [checkChange, setCheckChange] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onOpen: () => {
      const contract = contractList.find(
        (contract) =>
          contract.bossId === review.bossId &&
          contract.albaId === review.albaId,
      );
      if (review.action) {
        setReview((prev) => ({
          ...prev,
          startDate: contract ? contract.startDate : "",
          endDate: contract ? contract.endDate : "",
          storeName: contract ? contract.storeName : "",
          jobsTitle: contract ? contract.jobsTitle : "",
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
      initializeReview();
    },
  });
  /**/
  // 상태 초기화 함수
  const initializeReview = () => {
    setReview({
      bossId: 0,
      albaId: "",
      jobsId: "",
      jobsTitle: "",
      content: "",
      rating: 0,
      startDate: "",
      endDate: "",
      storeName: "",
      action: "",
    });
  };

  // 계약 선택 함수
  const selectContract = (contract) => {
    setSelectedContract(contract);
    setReview((prev) => ({
      ...prev,
      jobsTitle: contract.jobsTitle,
      jobsId: contract.jobsId,
      albaId: contract.albaId,
      bossId: parseInt(account.id),
      startDate: contract.startDate,
      endDate: contract.endDate,
      storeName: contract.storeName,
      albaName: contract.albaName,
    }));
  };

  /**/
  // Read (리스트 받기)
  useEffect(() => {
    if (account.id) {
      axios
        .get("/api/review/alba/list")
        .then((res) => {
          const validContracts = res.data.contractList.filter(
            (contract) => contract.endDate <= today,
          );

          const contractsWithBossId = validContracts.map((contract) => ({
            ...contract,
            bossId: parseInt(account.id),
          }));
          setContractList(contractsWithBossId);
          const updatedReviewList = res.data.reviewList.map((review) => {
            const contract = contractsWithBossId.find(
              (contract) =>
                contract.albaId === review.albaId &&
                contract.bossId === review.bossId,
            );

            return {
              ...review,
              startDate: contract ? contract.startDate : "",
              endDate: contract ? contract.endDate : "",
              storeName: contract ? contract.storeName : "",
              albaName: contract ? contract.albaName : "",
              jobsTitle: contract ? contract.jobsTitle : "", // jobsTitle 추가
            };
          });

          setReviewList(updatedReviewList);
        })
        .catch((err) => myToast("로드 오류발생", "error"));
    }
  }, [account.id, checkChange]);

  // Create
  function handleSubmit() {
    // setReview가 완료된 후에 axios.post를 호출하도록 함
    setReview((prev) => ({
      ...prev,
      bossId: account.id,
    }));

    setTimeout(() => {
      axios
        .post("/api/review/alba", { ...review, bossId: account.id })
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
        });
    }, 0);
  }

  const handleModalSelect = (e) => {
    const jobsId = parseInt(e.target.value);
    const contract = contractList.find(
      (contract) => contract.jobsId == jobsId && contract.bossId == account.id,
    );
    if (contract) {
      selectContract(contract);
    }
  };

  // 모달 관련
  useEffect(() => {
    if (isOpen) {
      const contract = contractList.find(
        (contract) =>
          contract.albaId === review.albaId &&
          contract.bossId === review.bossId,
      );
      if (contract) {
        setSelectedContract(contract);
        setReview((prev) => ({
          ...prev,
          startDate: contract.startDate,
          endDate: contract.endDate,
          storeName: contract.storeName,
          action: review.action || "",
        }));
      } else if (contractList.length > 0) {
        selectContract(contractList[0]);
      }
    }
  }, [isOpen, contractList, account.id]);

  const handleReviewClick = (review, action) => {
    const contract = contractList.find(
      (contract) =>
        contract.albaId === review.albaId && contract.bossId === review.bossId,
    );
    setReview({
      ...review,
      startDate: contract ? contract.startDate : "",
      endDate: contract ? contract.endDate : "",
      storeName: contract ? contract.storeName : "",
      action: action || "",
    });
    setSelectedContract(contract);
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
      .put("api/review/alba", review)
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
      .delete(`/api/review/alba/${review.albaId}`)
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
        .get("/api/review/alba/list")
        .then((res) => {
          const validContracts = res.data.contractList.filter(
            (contract) => contract.endDate <= today,
          );
          setReviewList(res.data.reviewList);
          setContractList(validContracts);
          setCheckChange(!checkChange);
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
          zIndex={"2"}
          as="span"
          key={i}
          onClick={() => handleRatingChange(i)}
          color={review.rating >= i ? "gold" : "gray.300"}
          cursor="pointer"
          fontSize="3xl"
        >
          ★
        </Box>,
      );
    }
    return stars;
  };

  /* 내 평판 리뷰(사장) */

  const [reviewToStoreList, setReviewToStoreList] = useState([]);
  useEffect(() => {
    axios
      .get("api/review/alba/to-store")
      .then((res) => {
        setReviewToStoreList(res.data);
      })
      .catch()
      .finally();
  }, []);

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
          리뷰관리(사장)
        </Heading>

        <Button onClick={onOpen} w={"70px"} colorScheme={"blue"}>
          입력
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} w={"800px"}>
        <ModalOverlay />
        <ModalContent maxW="600px" h={"530px"} p={5}>
          <ModalBody lineHeight={"60px"}>
            {review && review.action === "선택" && (
              <Heading textAlign={"center"}>리뷰보기</Heading>
            )}
            {(review == null || review.action !== "선택") && (
              <Heading textAlign={"center"}>리뷰작성</Heading>
            )}
            <Divider my={"10px"} borderWidth={"1px"} />
            <Flex>
              <Text fontSize={"xl"} w={"80px"} ml={4} fontWeight={"bold"}>
                공고명
              </Text>
              <Text fontSize={"xl"} ml={7}>
                {review.action && review.jobsTitle}
              </Text>

              {!review.action && (
                <Select
                  lineHeight={"25px"}
                  ml={4}
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
            </Flex>
            {review && (
              <Box
                ml={4}
                mb={4}
                display={"flex"}
                flexDirection={"column"}
                gap={"20px"}
              >
                <Box display={"flex"}>
                  <Heading fontSize={"xl"}>알바기간</Heading>
                  <Text ml={10} fontSize="lg" lineHeight={"25px"}>
                    {review.startDate} ~ {review.endDate}
                  </Text>
                </Box>
                <Box display={"flex"}>
                  <Heading fontSize={"xl"}>직원이름</Heading>
                  <Text
                    ml={10}
                    letterSpacing={"1px"}
                    fontSize="xl"
                    lineHeight={"25px"}
                  >
                    {review.albaName}
                  </Text>
                </Box>

                <Box mt={5}>
                  <Heading fontSize={"xl"}>한 줄 리뷰</Heading>
                  {review.action === "선택" || (
                    <Input
                      fontWeight={"bold"}
                      value={review.content}
                      onChange={handleInputChange("content")}
                      placeholder={"리뷰를 입력해주세요."}
                    />
                  )}
                  {review.action === "선택" && (
                    <Text fontSize={"lg"} ml={3}>
                      {review.content}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Flex mt={4}>
                    <Heading fontSize={"xl"}>평점</Heading>
                    <Heading fontSize={"2xl"} ml={3}>
                      {review.rating}
                    </Heading>
                  </Flex>
                  <Flex>{renderStars()}</Flex>
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
          <ModalFooter gap={"10px"} mt={"-80px"}>
            <Button onClick={onClose} variant={"outline"} colorScheme={"teal"}>
              닫기
            </Button>
            {review.action !== "선택" && review.action !== "수정" && (
              <Button onClick={handleSubmit} colorScheme={"teal"}>
                저장
              </Button>
            )}
            {review.action === "수정" && (
              <Button onClick={() => handleUpdate(review)} colorScheme={"teal"}>
                수정
              </Button>
            )}
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
                <Box
                  as="span"
                  mr={2}
                  color={"gold"}
                  fontSize="2xl"
                  cursor="pointer"
                >
                  ★
                </Box>
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
      <Box>
        {/* 내 사업장 리뷰 */}
        <Box
          h={"30vh"}
          // border={"1px solid red"}
          mt={"100px"}
        >
          <Box display="flex" justifyContent="space-between">
            <Heading mb={"10px"} p={1}>
              내 평판 리뷰
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
              {reviewToStoreList.map((review, index) => (
                <Tr
                  key={review.jobsId}
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
                    onClick={() => handleReviewClick(review, "선택")}
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
                    <Box
                      as="span"
                      mr={2}
                      color={"gold"}
                      fontSize="2xl"
                      cursor="pointer"
                    >
                      ★
                    </Box>
                    {review.rating}
                  </Td>

                  {/* 관리 버튼*/}
                  {/*<Td></Td>*/}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        {/* 내 사업장 리뷰 */}
      </Box>
    </Box>
  );
}

export default BossReviewList;
