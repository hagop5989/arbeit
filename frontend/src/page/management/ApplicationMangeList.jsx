import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link,
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
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { ContractModal } from "./ContractModal.jsx";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

const styles = {
  th: {
    fontSize: "sm",
  },
  td: {
    borderBottom: "1px solid #E0E0E0",
  },
};

export function ApplicationMangeList() {
  const [applicationList, setApplicationList] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const account = useContext(LoginContext);

  const pageNums = [];
  const [pageInfo, setPageInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get("/api/application-manage/list", {
        params: { currentPage: currentPage },
      })
      .then((res) => {
        setApplicationList(res.data);
        const updatedApplicationList = [...res.data]; // 배열을 복사하여 불변성 유지
        updatedApplicationList.splice(updatedApplicationList.length - 1, 1); // 마지막 요소 제거

        setApplicationList(updatedApplicationList);

        // 마지막 요소의 pageInfo 설정
        setPageInfo(res.data[res.data.length - 1]);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
  }, [account.id, reload, currentPage]);

  function handleRejectBtn(application) {
    const confirm = window.confirm("불합격 시키시겠습니까?");
    if (confirm) {
      axios
        .put(
          `/api/jobsId/${application.jobsId}/application-manage/reject/${application.albaId}`,
        )
        .then(() => {
          alert("불합격 처리되었습니다.");
          account.setPostCheck(!account.postCheck);
        })
        .catch((err) => {
          alert(err.response.data);
        })
        .finally(() => {
          setReload(!reload);
        });
    }
  }

  function handleAcceptBtn(application) {
    setSelectedApplication(application);
    onOpen();
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

  if (applicationList === null) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      {account.isBoss() && (
        <Box minH={"500px"} mb={"150px"}>
          <Box h={"600px"}>
            <Heading p={1} fontFamily={"SBAggroB"}>
              지원 내역
            </Heading>
            <Flex>
              <Box my={"20px"} h={"50px"} lineHeight={"50px"}>
                <Box h={"25px"} lineHeight={"25px"}>
                  * 지원서를 확인하여 합격, 불합격을 처리해주세요.
                </Box>
                <Box h={"25px"} lineHeight={"25px"}>
                  * 합격, 불합격이 처리되면 바꿀 수 없습니다.
                </Box>
              </Box>
            </Flex>
            <Table borderRadius="lg" w="1050px">
              <Thead
                bg="gray.100"
                borderTop={"1px solid gray"}
                borderBottom={"2px solid #E9E9E9"}
              >
                <Tr>
                  <Th w={"120px"} {...styles.th}>
                    지원 일자
                  </Th>
                  <Th {...styles.th}>지원 공고</Th>
                  <Th w={"150px"} {...styles.th}>
                    지원서
                  </Th>
                  <Th w={"100px"} {...styles.th}>
                    상태
                  </Th>
                  <Th w={"100px"} {...styles.th}>
                    처리
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {applicationList.map((application, index) => (
                  <Tr key={index}>
                    <Td {...styles.td}>{application.inserted}</Td>
                    <Td fontWeight={"800"} cursor="pointer" {...styles.td}>
                      <Link href={`/jobs/${application.jobsId}`}>
                        {application.jobsTitle}
                      </Link>
                    </Td>
                    <Td fontWeight={"800"} color={"#FF8400"} {...styles.td}>
                      <Link
                        href={`/jobs/${application.jobsId}/application-manage/detail/${application.albaId}`}
                      >
                        확인하기
                      </Link>
                    </Td>

                    <Td
                      fontWeight={"700"}
                      {...styles.td}
                      color={
                        application.isPassed !== undefined
                          ? application.isPassed
                            ? "blue.600"
                            : "red.500"
                          : "gray.600"
                      }
                    >
                      {application.isPassed !== undefined
                        ? application.isPassed
                          ? "합격"
                          : "불합격"
                        : "미정"}
                    </Td>
                    <Td {...styles.td}>
                      <Flex gap={1}>
                        <Button
                          {...btnStyles("royalblue")}
                          onClick={() => handleAcceptBtn(application)} // 변경된 부분
                          size={"sm"}
                        >
                          합격
                        </Button>
                        <Button
                          {...btnStyles("orangered")}
                          variant="outline"
                          colorScheme="red"
                          size={"sm"}
                          onClick={() => handleRejectBtn(application)}
                        >
                          불합격
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {applicationList.length < 1 && (
              <Box m={"30px"}>
                <Heading size={"md"}>아직 지원자가 없습니다.</Heading>
              </Box>
            )}
            <Box my={6}>{Paging()}</Box>
          </Box>
          <ContractModal
            isOpen={isOpen}
            onClose={onClose}
            application={selectedApplication}
            reload={reload}
            setReload={setReload}
          />
        </Box>
      )}
    </>
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
