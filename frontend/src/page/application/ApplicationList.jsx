import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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

const styles = {
  th: {
    borderBottom: "1px solid gray",
    fontSize: "medium",
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
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Read (jobs 리스트 받기)
  useEffect(() => {
    axios
      .get("/api/only-login")
      .then(() => {
        axios.get(`/api/apply/list`).then((res) => {
          setApplicationList(res.data);
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [account.id, isCancel]);

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

  if (account.id === "") {
    return <Spinner />;
  }

  return (
    <Box w={"100%"} h={"55vh"}>
      <Box>
        <Heading mb={"10px"} p={1}>
          나의 지원 내역
        </Heading>
        <Divider mb={"40px"} borderWidth={"2px"} />
        <Box>
          <Table>
            <Thead>
              <Tr borderTop={"1px solid gray"}>
                <Th {...styles.th} w={"150px"}>
                  지원 일자
                </Th>
                <Th {...styles.th} w={"32%"}>
                  지원 공고
                </Th>
                <Th {...styles.th} w={"32%"}>
                  지원서
                </Th>
                <Th {...styles.th} w={"40px"}>
                  상태
                </Th>
                <Th {...styles.th} w={"120px"}>
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
                        지원서 보기
                      </Box>
                    </Td>
                    <Td {...styles.td} minW={"90px"} fontWeight={"bold"}>
                      {isPassedToString(application.isPassed)}
                    </Td>
                    <Td {...styles.td}>
                      <Button
                        colorScheme="red"
                        variant="outline"
                        _hover={{ bg: "#E74133", color: "white" }}
                        size={"sm"}
                        onClick={() => handleCancelBtn(application.jobsId)}
                      >
                        취소
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
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
                    <Box mr={"20px"}>지원 공고</Box>
                    <Link href={`/jobs/${selectedApplication.jobsId}`}>
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
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
