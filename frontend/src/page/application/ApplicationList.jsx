import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = {
  th: {
    fontSize: "sm",
    borderBottom: "2px solid #E0E0E0",
  },
  td: {
    borderBottom: "1px solid #E0E0E0",
  },
};

export function ApplicationList() {
  const account = useContext(LoginContext);
  const [applicationList, setApplicationList] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [name, setName] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [isCancel, setIsCancel] = useState(false);
  const [selectedType, setSelectedType] = useState("전체");
  const [pageInfo, setPageInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const pageNums = [];

  // Read (jobs 리스트 받기)
  useEffect(() => {
    axios
      .get(`/api/apply/list`, {
        params: { currentPage: currentPage, selectedType },
      })
      .then((res) => {
        setApplicationList(res.data.applicationList);
        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
  }, [account.id, isCancel, currentPage, selectedType]);

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

  function handleCancelBtn(jobsId) {
    const confirm = window.confirm("정말 취소하시겠습니까?");
    if (confirm) {
      console.log(jobsId);
      axios
        .delete(`/api/apply/${jobsId}`)
        .then(() => {
          alert("취소되었습니다.");
          setIsCancel(!isCancel);
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            alert(err.response.data);
          } else {
            alert("내부 오류 발생");
          }
        });
    }
  }

  function handleOpenApplication(application) {
    setSelectedApplication(application);
    onOpen();
    if (application.resumeId) {
      const param = new URLSearchParams();
      param.append("resumeId", application.resumeId);
      axios.post(`/api/resume/application-view`, param).then((res) => {
        setName(res.data.name);
        setResumeTitle(res.data.title);
      });
    }
  }

  // 페이징, 검색 관련
  if (pageInfo) {
    for (let i = pageInfo.leftPage; i <= pageInfo.rightPage; i++) {
      pageNums.push(i);
    }
  }

  function handlePageButtonClick(currentPage) {
    setCurrentPage(currentPage);
    console.log(currentPage);
  }

  const btnStyles = (color) => ({
    bgColor: "white",
    color: color,
    border: `2px solid ${color}`,
    _hover: { bgColor: color, color: "white" },
  });

  const handleListSelect = (event) => {
    setSelectedType(event.target.value);
  };

  if (applicationList === null) {
    return <Spinner />;
  }

  return (
    <Box w={"100%"} minH={"600px"}>
      <Box>
        <Heading p={1} fontFamily={"SBAggroB"}>
          나의 지원 내역
        </Heading>
        <Flex>
          <Box my={"20px"} h={"50px"} lineHeight={"50px"}>
            * 이미 처리된 지원 내역은 취소할 수 없습니다.
          </Box>
        </Flex>
        <Select size={"sm"} w={"100px"} mb={"10px"} onChange={handleListSelect}>
          <option value="전체">전체</option>
          <option value="합격">합격</option>
          <option value="불합격">불합격</option>
          <option value="미정">미정</option>
        </Select>
        <Box>
          <Table borderRadius="lg" w="1050px">
            <Thead bg="gray.100" borderTop={"1px solid gray"}>
              <Tr>
                <Th w={"120px"} {...styles.th}>
                  지원일자
                </Th>
                <Th w={"350px"} {...styles.th}>
                  지원 공고
                </Th>
                <Th w={"100px"} {...styles.th}>
                  지원서
                </Th>
                <Th w={"50px"} {...styles.th}>
                  상태
                </Th>
                <Th w={"100px"} {...styles.th}>
                  지원 취소
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {applicationList &&
                applicationList.map((application, index) => (
                  <Tr key={index}>
                    <Td {...styles.td}>{application.inserted}</Td>
                    <Td {...styles.td}>
                      <Link
                        href={`/jobs/${application.jobsId}`}
                        fontWeight={"800"}
                        w={"350px"}
                        isTruncated
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {application.jobsTitle}
                      </Link>
                    </Td>
                    <Td {...styles.td}>
                      <Box
                        color={"#FF982A"}
                        onClick={() => handleOpenApplication(application)}
                        fontWeight={"700"}
                        cursor={"pointer"}
                        _hover={{ textDecoration: "underline" }}
                      >
                        확인하기
                      </Box>
                    </Td>
                    <Td
                      {...styles.td}
                      minW={"90px"}
                      fontWeight={"bold"}
                      color={
                        application.isPassed !== null
                          ? application.isPassed
                            ? "blue.600"
                            : "red.500"
                          : "gray.600"
                      }
                    >
                      {isPassedToString(application.isPassed)}
                    </Td>
                    <Td {...styles.td}>
                      {application.isPassed === null ? (
                        <Button
                          {...btnStyles("orangered")}
                          size={"sm"}
                          onClick={() => handleCancelBtn(application.jobsId)}
                        >
                          취소
                        </Button>
                      ) : (
                        <Box fontWeight={"bold"}>처리 완료</Box>
                      )}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
          {applicationList.length < 1 && (
            <Box m={"30px"}>
              <Heading size={"md"}>지원 내역이 없습니다.</Heading>
            </Box>
          )}
        </Box>
        <Box my={6}>{Paging()}</Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Box
              h={"40px"}
              bg={"#FF7F3E"}
              color={"white"}
              borderRadius={"10px"}
            >
              <Heading size={"md"} textAlign={"center"} lineHeight={"40px"}>
                {name} 님의 지원서
              </Heading>
            </Box>
          </ModalHeader>
          <ModalBody>
            {selectedApplication && (
              <>
                <Box fontWeight={"600"} mb={"10px"}>
                  <Flex>
                    <Box mr={"10px"} w="100px">
                      지원 공고:
                    </Box>
                    <Link
                      href={`/jobs/${selectedApplication.jobsId}`}
                      isTruncated
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      w={"280px"}
                    >
                      {selectedApplication.jobsTitle}
                    </Link>
                  </Flex>
                </Box>
                <Box fontWeight={"600"} mb={"10px"}>
                  <Flex>
                    <Box mr={"20px"}>첨부된 이력서: </Box>
                    <Link
                      color={"orange"}
                      href={`/resume/${selectedApplication.resumeId}`}
                    >
                      {resumeTitle}
                    </Link>
                  </Flex>
                </Box>
                <Box bg={"#E0E0E0"} h={"2px"} mb={"20px"} />
                <Box fontWeight={"600"} mb={"10px"}>
                  <Box mb={"10px"}>지원메시지</Box>
                  <Box fontWeight={"500"} whiteSpace="pre-wrap">
                    {selectedApplication.comment}
                  </Box>
                </Box>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              {...btnStyles("black")}
              opacity={"0.6"}
              mr={3}
              onClick={onClose}
            >
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
