import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { LoginContext } from "../../../provider/LoginProvider.jsx";
import { ContractModal } from "./ContractModal.jsx";
import { useNavigate } from "react-router-dom";

const styles = {
  th: {
    borderBottom: "2px solid #E0E0E0",
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

  useEffect(() => {
    axios
      .get("/api/application-manage/list")
      .then((res) => {
        setApplicationList(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
  }, [account.id, reload]);

  function handleRejectBtn(application) {
    const confirm = window.confirm("불합격 시키시겠습니까?");
    if (confirm) {
      axios
        .put(
          `/api/jobsId/${application.jobsId}/application-manage/reject/${application.albaId}`,
        )
        .then(() => {
          alert("불합격 처리되었습니다.");
        })
        .catch((err) => {
          alert(err.response.data);
        })
        .finally(() => setReload(!reload));
    }
  }

  function handleAcceptBtn(application) {
    setSelectedApplication(application);
    onOpen();
  }

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
            <Box>
              <Heading mb={"10px"} p={1}>
                지원내역(사장)
              </Heading>
              <Divider mb={"40px"} borderWidth={"2px"} />
            </Box>
            <Table borderRadius="lg" w="1050px">
              <Thead bg="gray.100" p={2} fontWeight="bold">
                <Tr>
                  <Td w={"20px"} {...styles.th}>
                    #
                  </Td>
                  <Td {...styles.th}>지원 공고</Td>{" "}
                  <Td w={"150px"} {...styles.th}>
                    지원서
                  </Td>
                  <Td w={"150px"} {...styles.th}>
                    지원 일자
                  </Td>
                  <Td w={"100px"} {...styles.th}>
                    상태
                  </Td>
                  <Td w={"100px"} {...styles.th}>
                    처리
                  </Td>
                </Tr>
              </Thead>
              <Tbody>
                {applicationList.map((application, index) => (
                  <Tr key={index}>
                    <Td {...styles.td}>{index + 1}</Td>

                    <Td fontWeight={"800"} cursor="pointer" {...styles.td}>
                      <Link href={`/jobs/${application.jobsId}`}>
                        {application.jobsTitle}
                      </Link>
                    </Td>
                    <Td fontWeight={"800"} color={"#FF8400"} {...styles.td}>
                      <Link
                        href={`/jobs/${application.jobsId}/application-manage/detail/${application.albaId}`}
                      >
                        지원서 확인하기
                      </Link>
                    </Td>
                    <Td {...styles.td}>{application.inserted}</Td>
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
                          onClick={() => handleAcceptBtn(application)} // 변경된 부분
                          variant="outline"
                          colorScheme="blue"
                          size={"sm"}
                        >
                          합격
                        </Button>
                        <Button
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
}
