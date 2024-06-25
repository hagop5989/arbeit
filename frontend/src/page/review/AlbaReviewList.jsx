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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AlbaReviewList(props) {
  const [review, setReview] = useState({
    albaId: "",
    jobsId: "",
    storeId: "",
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
      const contract = contractList.find(
        (contract) =>
          contract.storeId === review.storeId &&
          contract.albaId === review.albaId,
      );
      if (review.action) {
        setReview((prev) => ({
          ...prev,
          startDate: contract ? contract.startDate : "",
          endDate: contract ? contract.endDate : "",
          storeName: contract ? contract.storeName : "",
          storeId: contract ? contract.storeId : "",
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
      albaId: "",
      jobsId: "",
      storeId: "",
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
      storeId: contract.storeId,
      startDate: contract.startDate,
      endDate: contract.endDate,
      storeName: contract.storeName,
    }));
  };

  /**/
  // Read (리스트 받기)
  useEffect(() => {
    axios
      .get("/api/only-login")
      .then(() => {
        axios
          .get("/api/review/store/list")
          .then((res) => {
            const validContracts = res.data.contractList.filter(
              (contract) => contract.endDate <= today,
            );
            const updatedReviewList = res.data.reviewList.map((review) => {
              const contract = validContracts.find(
                (contract) =>
                  contract.storeId === review.storeId &&
                  contract.albaId === review.albaId,
              );
              return {
                ...review,
                startDate: contract ? contract.startDate : "",
                endDate: contract ? contract.endDate : "",
                storeName: contract ? contract.storeName : "",
                storeId: contract ? contract.storeId : "",
                jobsId: contract ? contract.jobsId : "",
              };
            });

            setReviewList(updatedReviewList);
            setContractList(validContracts);
          })
          .catch((err) => {
            if (err.response.status === 403) {
              myToast("접근 권한이 없습니다.", "error");
              navigate("/");
            } else {
              myToast("로드 오류발생", "error");
            }
          });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [account.id, checkChange]);

  // Create
  function handleSubmit() {
    // setReview가 완료된 후에 axios.post를 호출하도록 함
    setReview((prev) => ({
      ...prev,
      albaId: account.id,
    }));

    setTimeout(() => {
      axios
        .post("/api/review/store", { ...review, albaId: account.id })
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
      (contract) => contract.jobsId == jobsId && contract.albaId == account.id,
    );
    if (contract) selectContract(contract);
  };

  // 모달 관련
  useEffect(() => {
    if (isOpen) {
      const contract = contractList.find(
        (contract) =>
          contract.storeId === review.storeId &&
          contract.albaId === review.albaId,
      );
      if (contract) {
        setSelectedContract(contract);
        setReview((prev) => ({
          ...prev,
          startDate: contract.startDate,
          endDate: contract.endDate,
          storeName: contract.storeName,
          action: review.action || "",
          jobsId: contract.jobsId,
        }));
      } else if (contractList.length > 0) {
        selectContract(contractList[0]);
      }
    }
  }, [isOpen, contractList, account.id]);

  const handleReviewClick = (review, action) => {
    const contract = contractList.find(
      (contract) =>
        contract.storeId === review.storeId &&
        contract.albaId === review.albaId,
    );
    setReview({
      ...review,
      startDate: contract ? contract.startDate : "",
      endDate: contract ? contract.endDate : "",
      storeName: contract ? contract.storeName : "",
      storeId: contract ? contract.storeId : "",
      jobsId: review.jobsId || (contract ? contract.jobsId : ""),
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
      .put("api/review/store", review)
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
    if (review.storeId) {
      axios
        .delete(`/api/review/store/${review.storeId}`)
        .then((res) => {
          myToast("삭제 되었습니다.", "success");
          fetchReviewList();
        })

        .catch(() => {
          myToast("에러발생", "error");
        })
        .finally();
    } else {
      console.log(review);
      myToast("storeId가 없습니다.", "error"); // 추가된 부분
    }
  }

  // 새로고침
  const fetchReviewList = () => {
    if (account.id) {
      axios
        .get("/api/review/store/list")
        .then((res) => {
          const validContracts = res.data.contractList.filter(
            (contract) => contract.endDate <= today,
          );
          const updatedReviewList = res.data.reviewList.map((review) => {
            const contract = validContracts.find(
              (contract) =>
                contract.storeId === review.storeId &&
                contract.albaId === review.albaId,
            );
            return {
              ...review,
              jobsId: review.jobsId || (contract ? contract.jobsId : ""), // 추가된 부분
              startDate: contract ? contract.startDate : "",
              endDate: contract ? contract.endDate : "",
              storeName: contract ? contract.storeName : "",
              storeId: contract ? contract.storeId : "",
            };
          });
          setReviewList(updatedReviewList);
          setContractList(validContracts);
        })
        .catch((err) => myToast("로드 오류발생", "error"));
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
      .get("/api/only-login")
      .then(() => {
        axios
          .get("api/review/store/to-alba")
          .then((res) => {
            setReviewToStoreList(res.data);
          })
          .catch()
          .finally();
      })
      .catch(() => {
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
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

  const TableHeader = () => (
    <Flex
      bg="gray.100"
      p={2}
      fontWeight="bold"
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Box flex="1" fontSize="medium">
        #
      </Box>
      <Box flex="2" fontSize="medium">
        날짜
      </Box>
      <Box flex="4" fontSize="medium">
        공고명
      </Box>
      <Box flex="4" fontSize="medium">
        리뷰평
      </Box>
      <Box flex="2" fontSize="medium">
        평점
      </Box>
      <Box flex="3" fontSize="medium">
        관리
      </Box>
    </Flex>
  );

  return (
    <Box w={"full"} h={"80vh"}>
      <Box display="flex" justifyContent="space-between">
        <Heading mb={"10px"} p={1}>
          리뷰관리(알바)
        </Heading>

        <Button onClick={onOpen} w={"70px"} colorScheme={"blue"}>
          입력
        </Button>
      </Box>

      {/* 입력,수정,선택 모달 */}
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
                  <Heading fontSize={"xl"}>사업장명</Heading>
                  <Text
                    ml={10}
                    letterSpacing={"1px"}
                    fontSize="xl"
                    lineHeight={"25px"}
                  >
                    {review.storeName}
                  </Text>
                </Box>

                <Box mt={6}>
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
      {/* 입력,수정,선택 모달 끝 */}

      <Divider mb={"40px"} borderWidth={"2px"} />
      {/* 리뷰관리(알바) */}
      <CustomTable
        reviewList={reviewList}
        onReviewClick={handleReviewClick}
        onDelete={handleDelete}
        navigate={navigate}
      />
      {/* 내 평판 리뷰 */}
      <Box>
        <Box h={"30vh"} mt={"100px"}>
          <Box display="flex" justifyContent="space-between">
            <Heading mb={"10px"} p={1}>
              내 평판 리뷰
            </Heading>
          </Box>

          <Divider mb={"40px"} borderWidth={"2px"} />
          <CustomTable
            reviewList={reviewToStoreList}
            onReviewClick={handleReviewClick}
            // onDelete={handleDelete}
            navigate={navigate}
          />
        </Box>
        {/* 내 평판 리뷰 */}
      </Box>
    </Box>
  );
}

/* 커스텀 테이블 */
const TableHeader = ({ action }) => (
  <Flex
    bg="gray.100"
    p={2}
    fontWeight="bold"
    borderBottom="1px"
    borderColor="gray.200"
    textIndent={"5px"}
  >
    <Box flex="1" fontSize="medium">
      #
    </Box>
    <Box flex="2" fontSize="medium">
      날짜
    </Box>
    <Box flex="4" fontSize="medium">
      공고명
    </Box>
    <Box flex="4" fontSize="medium">
      리뷰평
    </Box>
    <Box flex="2" fontSize="medium">
      평점
    </Box>
    {action === "작성용" && (
      <Box flex="3" fontSize="medium">
        관리
      </Box>
    )}
  </Flex>
);

const TableRow = ({
  review,
  index,
  onReviewClick,
  onDelete,
  navigate,
  action,
}) => (
  <Flex
    maxH={"45px"}
    p={2}
    fontSize="15px"
    borderBottom="1px"
    borderColor="gray.200"
    _hover={{ bgColor: "orange.50" }}
    alignItems="center"
    height="50px"
  >
    <Box flex="1" minW="80px">
      {index + 1}
    </Box>
    <Box flex="2" fontSize="sm" minW="130px">
      {review.inserted}
    </Box>
    <Box
      flex="4"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      cursor="pointer"
      onClick={() => navigate(`/jobs/${review.jobsId}`)}
    >
      {review.jobsTitle}
    </Box>
    <Box
      flex="4"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      cursor="pointer"
      onClick={() => onReviewClick(review, "선택")}
    >
      {review.content}
    </Box>
    <Flex flex="2" alignItems="center" minW="90px">
      <Text color="gold" fontSize="2xl" mr={2}>
        ★
      </Text>
      <Text fontSize="2xl" fontWeight="bold" color="teal">
        {review.rating}
      </Text>
    </Flex>
    {action === "작성용" && (
      <Flex flex="3" gap="5px">
        <Button
          fontWeight="500"
          bgColor="#FF7F3E"
          color="white"
          onClick={() => onReviewClick(review, "수정")}
        >
          수정
        </Button>
        <Button
          fontWeight="500"
          bgColor="red.500"
          color="white"
          onClick={() => onDelete(review)}
        >
          삭제
        </Button>
      </Flex>
    )}
  </Flex>
);

const CustomTable = ({
  reviewList,
  onReviewClick,
  onDelete,
  navigate,
  action,
}) => (
  <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
    <TableHeader action={action} />
    {reviewList.map((review, index) => (
      <TableRow
        key={index}
        review={review}
        index={index}
        onReviewClick={onReviewClick}
        onDelete={onDelete}
        navigate={navigate}
        action={action}
      />
    ))}
  </Box>
);
/* 커스텀 테이블 끝 */

export default AlbaReviewList;
