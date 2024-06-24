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
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function ManagementList() {
  const account = useContext(LoginContext);
  const [managementList, setManagementList] = useState([]);
  const [selectedManagement, setSelectedManagement] = useState(null);
  const [contract, setContract] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const [checkChange, setCheckChange] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      setSelectedManagement(null);
      setContract({});
    },
  });

  // Read (jobs 리스트 받기)

  useEffect(() => {
    if (account.id) {
      axios.get("/api/jobs/management/list").then((res) => {
        setManagementList(res.data);
      });
    }
  }, [account.id, checkChange]);

  // 합격 로직
  function handleDecision(e, management) {
    const decision = e.target.innerText;
    let isPassed = null;

    if (decision === "합격") {
      if (management.isPassed == 1) {
        /* 이미 합격된 사람인데 합격버튼 누를 떄 */
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
      onOpen();
    } else if (decision === "불합격") {
      isPassed = 0;
      const updatedManagement = {
        ...management,
        isPassed: isPassed,
      };
      handleSubmit(updatedManagement, null);
    }
  }

  const handleContractChange = (field) => (e) => {
    setContract((prev) => ({
      ...prev,
      [field]: e.target.value,
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
      onClose(); // 모달 닫기
    } catch (error) {
      console.log(error);
      myToast("오류 발생", "error");
    }
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
    <Box h={"80vh"} mb={"50px"}>
      {account.isAlba() && (
        <Heading m={"auto"} color={"white"} bgColor={"orange"} p={5}>
          사장만 접근 가능한 페이지 입니다.
        </Heading>
      )}
      {account.isBoss() && (
        <Box>
          <Box>
            <Heading mb={"10px"} p={1}>
              지원내역(사장)
            </Heading>
            <Divider mb={"40px"} borderWidth={"2px"} />
          </Box>
          <Box>
            <Table w={"1050px"}>
              <Thead>
                <Tr>
                  <Th fontSize={"medium"}>#</Th>
                  <Th fontSize={"medium"}>지원일</Th>
                  <Th fontSize={"medium"}>진행공고명</Th>
                  <Th fontSize={"medium"}>지원서 제목</Th>
                  <Th fontSize={"medium"}>상태</Th>
                  <Th fontSize={"medium"}>관리</Th>
                </Tr>
              </Thead>
              <Tbody>
                {managementList.map((management, index) => (
                  <Tr
                    key={management.id}
                    fontSize={"15px"}
                    _hover={{ bgColor: "orange.50" }}
                  >
                    <Td minW={"80px"}>{index + 1}</Td>
                    {/* 지원일 */}
                    <Td fontSize={"sm"} minW={"130px"}>
                      {management.applicationInserted}
                    </Td>
                    {/* 공고 제목 */}
                    <Td
                      whiteSpace="nowrap" // 줄 바꿈을 막음
                      overflow="hidden" // 넘친 내용을 숨김
                      textOverflow="ellipsis" // 넘친 내용을 "..."으로 표시
                      cursor={"pointer"}
                      onClick={() => navigate(`/jobs/${management.jobsId}`)}
                    >
                      {management.jobsTitle}
                    </Td>
                    {/* 지원 제목 */}
                    <Td
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      cursor={"pointer"}
                      onClick={() =>
                        navigate(
                          `/jobs/${management.resumeId}/management/select`,
                          { state: { jobsId: management.jobsId } },
                        )
                      }
                    >
                      {management.applicationTitle}
                    </Td>
                    {/* 합격 여부 */}
                    {management.isPassed == null && (
                      <Td minW={"90px"}>
                        <Text color={"gray.500"} fontWeight={"bold"}>
                          미정
                        </Text>
                      </Td>
                    )}
                    {management.isPassed == null || (
                      <Td
                        minW={"90px"}
                        fontWeight={"bold"}
                        color={
                          management.isPassed != null && management.isPassed
                            ? "teal"
                            : "red"
                        }
                      >
                        {isPassedToString(management.isPassed)}
                      </Td>
                    )}

                    {/* 합격 결정 버튼 */}
                    <Td>
                      <Flex gap={"5px"}>
                        <Button
                          onClick={(e) => handleDecision(e, management)}
                          // onClick={onOpen}
                          fontWeight={"bold"}
                          variant={"outline"}
                          colorScheme={"teal"}
                          borderWidth={"2px"}
                        >
                          합격
                        </Button>
                        <Button
                          onClick={(e) => handleDecision(e, management)}
                          fontWeight={"bold"}
                          variant={"outline"}
                          colorScheme={"red"}
                          borderWidth={"2px"}
                        >
                          불합격
                        </Button>

                        {/* 합격 관련 모달 */}
                        <Modal
                          isOpen={isOpen}
                          onClose={onClose}
                          w={"800px"}
                          closeOnOverlayClick={false}
                        >
                          <ModalOverlay />
                          <ModalContent maxW="600px" h={"500px"}>
                            <ModalBody>
                              <Heading
                                fontSize={"3xl"}
                                my={8}
                                letterSpacing={"1px"}
                                textAlign={"center"}
                              >
                                지원자 확정
                              </Heading>
                              <Divider mt={"10px"} borderWidth={"1px"} />
                              <Box>
                                <Flex lineHeight={"80px"}>
                                  <Heading
                                    w={"130px"}
                                    fontSize={"3xl"}
                                    my={"20px"}
                                  >
                                    공고제목
                                  </Heading>
                                  <Text
                                    ml={2}
                                    fontSize={"20px"}
                                    fontWeight={"bold"}
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                  >
                                    {selectedManagement
                                      ? selectedManagement.jobsTitle
                                      : ""}
                                  </Text>
                                </Flex>
                                <Flex lineHeight={"75px"}>
                                  <Heading
                                    w={"130px"}
                                    fontSize={"3xl"}
                                    my={"20px"}
                                  >
                                    지원자
                                  </Heading>
                                  <Text
                                    ml={1}
                                    fontSize={"22px"}
                                    fontWeight={"bold"}
                                  >
                                    {selectedManagement
                                      ? selectedManagement.albaName
                                      : ""}{" "}
                                    님
                                  </Text>
                                </Flex>
                              </Box>

                              <Box lineHeight={"40px"}>
                                <Heading
                                  w={"130px"}
                                  fontSize={"3xl"}
                                  my={"30px"}
                                >
                                  계약기간
                                </Heading>
                                <Flex gap={"20px"}>
                                  <Flex>
                                    <Text
                                      w={"100px"}
                                      fontSize={"lg"}
                                      fontWeight={"bold"}
                                    >
                                      시작일
                                    </Text>
                                    <Input
                                      type={"date"}
                                      value={contract.startDate || ""}
                                      onChange={handleContractChange(
                                        "startDate",
                                      )}
                                    />
                                  </Flex>
                                  <Flex>
                                    <Text
                                      w={"100px"}
                                      fontSize={"lg"}
                                      fontWeight={"bold"}
                                    >
                                      종료일
                                    </Text>
                                    <Input
                                      type={"date"}
                                      value={contract.endDate || ""}
                                      onChange={handleContractChange("endDate")}
                                    />
                                  </Flex>
                                </Flex>
                              </Box>
                            </ModalBody>
                            <ModalFooter gap={"10px"}>
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
                                    myToast(
                                      "계약 기간을 입력해 주세요.",
                                      "warning",
                                    );
                                  }
                                }}
                                colorScheme={"blue"}
                              >
                                합격
                              </Button>
                              <Button onClick={onClose} colorScheme={"teal"}>
                                취소
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>

                        {/* 합격 관련 모달 */}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}
    </Box>
  );
}
