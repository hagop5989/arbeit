import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

export function ManagementList() {
  const account = useContext(LoginContext);
  const [managementList, setManagementList] = useState([]);
  const [selectedManagement, setSelectedManagement] = useState(null);
  const [contract, setContract] = useState({});
  const pageNums = [];
  const [pageInfo, setPageInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();
  const navigate = useNavigate();
  const [checkChange, setCheckChange] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedManagement(null);
    setContract({});
  };

  const params = {
    page: currentPage,
  };

  // Read (jobs 리스트 받기)

  useEffect(() => {
    axios
      .get("/api/only-login")
      .then(() => {
        axios
          .get("/api/jobs/management/list", { params })
          .then((res) => {
            setManagementList(res.data.managementList);
            setPageInfo(res.data.pageInfo);
          })
          .catch((err) => {
            if (err.response.status === 403) {
              navigate("/");
              myToast("접근 권한이 없습니다.", "error");
            }
          });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [account.id, checkChange, currentPage]);

  // 합격 로직
  function handleDecision(e, management) {
    console.log("handleDecision start");
    const decision = e.target.innerText;
    let isPassed = null;

    if (decision === "합 격") {
      if (management.isPassed == 1) {
        /* 이미 합격된 사람인데 합격버튼 누를 때 */
        myToast("이미 합격된 지원자 입니다.", "error");
        return null;
      }
      isPassed = 1;
      /* 합격이면 contract 값 세팅 */
      setContract({
        jobsId: management.jobsId,
        albaId: management.appliedMemberId,
        storeId: management.storeId,
        startDate: "",
        endDate: "",
      });
      setSelectedManagement({ ...management, isPassed });
      handleOpenModal();
    } else if (decision === "불합격") {
      isPassed = 0;
      const updatedManagement = {
        ...management,
        isPassed: isPassed,
      };
      handleSubmit(updatedManagement, null);
    }
  }

  const handleContractChange = (field, value) => {
    setContract((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 합격 여부 문자열 변환 함수
  const isPassedToString = (decision) => {
    switch (decision) {
      case 1:
        return "합격";
      case 0:
        return "불합격";
      default:
        return "미정";
    }
  };

  async function handleSubmit(updatedManagement, contract) {
    try {
      /* 합격 여부 전송 */
      await axios.put(`/api/jobs/management/decision`, {
        ...updatedManagement,
      });

      /* 합격일 때 contract 정보 전송 */

      if (updatedManagement && updatedManagement.isPassed === 1 && contract) {
        await axios.post("/api/contract", { ...contract });
      }

      // 위의 로직 모두 정상 처리 시
      myToast("처리 되었습니다.", "success");
      setManagementList((prevList) =>
        prevList.map((item) =>
          item.id === updatedManagement.id ? updatedManagement : item,
        ),
      );
      setCheckChange(!checkChange);
      handleCloseModal(); // 모달 닫기
    } catch (error) {
      console.log(error);
      myToast("오류 발생", "error");
    }
  }

  // 페이징, 검색 관련
  for (let i = pageInfo.leftPage; i <= pageInfo.rightPage; i++) {
    pageNums.push(i);
  }

  function handlePageButtonClick(currentPage) {
    setCurrentPage(currentPage);
    console.log(currentPage);
  }

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
    <Box h={"700px"} mb={"150px"}>
      {account.isAlba() && (
        <Heading m={"auto"} color={"white"} bgColor={"orange"} p={5}>
          사장만 접근 가능한 페이지 입니다.
        </Heading>
      )}
      {account.isBoss() && (
        <Box h={"600px"}>
          <Box>
            <Heading mb={"10px"} p={1}>
              지원내역(사장)
            </Heading>
            <Divider mb={"40px"} borderWidth={"2px"} />
          </Box>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" w="1050px">
            <Flex
              bg="gray.100"
              p={2}
              textIndent={13}
              fontWeight="bold"
              borderBottom="1px"
              borderColor="gray.200"
            >
              <Box flex="1" fontSize="medium">
                #
              </Box>
              <Box flex="2" fontSize="medium">
                지원일
              </Box>
              <Box flex="4" fontSize="medium">
                진행공고명
              </Box>
              <Box flex="4" fontSize="medium">
                지원서 제목
              </Box>
              <Box flex="2" fontSize="medium">
                상태
              </Box>
              <Box flex="3" fontSize="medium">
                관리
              </Box>
            </Flex>
            {managementList.map((management, index) => (
              <Flex
                key={index}
                p={2}
                fontSize="15px"
                borderBottom="1px"
                borderColor="gray.200"
                _hover={{ bgColor: "orange.50" }}
                alignItems="center"
              >
                <Box flex="1" minW="80px">
                  {index + 1}
                </Box>
                <Box flex="2" fontSize="sm" minW="130px">
                  {management.applicationInserted}
                </Box>
                <Box
                  mr={7}
                  flex="4"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  cursor="pointer"
                  onClick={() => navigate(`/jobs/${management.jobsId}`)}
                >
                  {management.jobsTitle}
                </Box>
                <Box
                  flex="4"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  cursor="pointer"
                  onClick={() =>
                    navigate(`/jobs/${management.resumeId}/management/select`, {
                      state: { jobsId: management.jobsId },
                    })
                  }
                >
                  {management.applicationTitle}
                </Box>
                <Box flex="2" minW="90px">
                  {management.isPassed == null ? (
                    <Text color="gray.500" fontWeight="bold">
                      미정
                    </Text>
                  ) : (
                    <Text
                      fontWeight="bold"
                      fontSize="16px"
                      color={management.isPassed ? "teal" : "red"}
                    >
                      {isPassedToString(management.isPassed)}
                    </Text>
                  )}
                </Box>
                <Flex flex="3" gap="5px">
                  <Button
                    onClick={(e) => handleDecision(e, management)}
                    w="75px"
                    fontWeight="bold"
                    variant="outline"
                    colorScheme="teal"
                    _hover={{ bg: "teal", color: "white" }}
                    borderWidth="2px"
                  >
                    합 격
                  </Button>
                  <Button
                    onClick={(e) => handleDecision(e, management)}
                    fontWeight="bold"
                    variant="outline"
                    colorScheme="red"
                    _hover={{ bg: "#E74133", color: "white" }}
                    borderWidth="2px"
                  >
                    불합격
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Box>
        </Box>
      )}
      <Box my={6}>{Paging()}</Box>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        trapFocus={true}
      >
        <ModalOverlay />
        <ModalContent
          maxW="600px"
          h="530px"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalBody onClick={(e) => e.stopPropagation()}>
            <Heading
              fontSize="3xl"
              my={8}
              letterSpacing="1px"
              textAlign="center"
            >
              지원자 확정
            </Heading>
            <Divider mt="10px" borderWidth="1px" />
            <Box>
              <Flex alignItems={"center"}>
                <Heading w="80px" fontSize="xl" my="20px">
                  공고제목
                </Heading>
                <Text
                  ml={3}
                  fontSize="20px"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {selectedManagement ? selectedManagement.jobsTitle : ""}
                </Text>
              </Flex>
              <Flex lineHeight={"45px"}>
                <Heading w="80px" fontSize="xl" my="10px">
                  지원자
                </Heading>
                <Text ml={3} fontSize="xl">
                  {selectedManagement ? selectedManagement.albaName : ""} 님
                </Text>
              </Flex>
            </Box>
            <Box lineHeight="40px">
              <Heading w="80px" fontSize="xl" my="40px" fontWeight="bold">
                계약기간
              </Heading>
              <Flex gap="20px">
                <Flex>
                  <Text w="100px" fontSize="lg" fontWeight="bold">
                    시작일
                  </Text>
                  <Input
                    type="date"
                    value={contract.startDate || ""}
                    onChange={(e) =>
                      handleContractChange("startDate", e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </Flex>
                <Flex>
                  <Text w="100px" fontSize="lg" fontWeight="bold">
                    종료일
                  </Text>
                  <Input
                    type="date"
                    value={contract.endDate || ""}
                    onChange={(e) =>
                      handleContractChange("endDate", e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </Flex>
              </Flex>
            </Box>
          </ModalBody>
          <ModalFooter onClick={(e) => e.stopPropagation()} gap="10px">
            <Button
              onClick={() => {
                if (
                  selectedManagement &&
                  contract.startDate &&
                  contract.endDate &&
                  contract.storeId
                ) {
                  handleSubmit(selectedManagement, contract);
                } else {
                  myToast("계약 기간을 입력해 주세요.", "warning");
                }
              }}
              colorScheme="blue"
            >
              합격
            </Button>
            <Button onClick={handleCloseModal} colorScheme="teal">
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );

  /* 페이징 */
  function Paging() {
    return (
      <Center gap={3} mt={2}>
        <Flex gap={2}>
          {pageInfo.prevPage && (
            <>
              <Button onClick={() => handlePageButtonClick(1)}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </Button>
              <Button onClick={() => handlePageButtonClick(pageInfo.prevPage)}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
            </>
          )}

          {pageNums.map((pageNum) => (
            <Button
              onClick={() => handlePageButtonClick(pageNum)}
              key={pageNum}
              colorScheme={pageNum === pageInfo.currentPage ? "blue" : "gray"}
            >
              {pageNum}
            </Button>
          ))}
          {pageInfo.nextPage && (
            <>
              <Button onClick={() => handlePageButtonClick(pageInfo.nextPage)}>
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
              <Button onClick={() => handlePageButtonClick(pageInfo.lastPage)}>
                <FontAwesomeIcon icon={faAnglesRight} />
              </Button>
            </>
          )}
        </Flex>
      </Center>
    );
  }
}
