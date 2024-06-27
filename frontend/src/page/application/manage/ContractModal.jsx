import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ContractModal({
  isOpen,
  onClose,
  application,
  reload,
  setReload,
}) {
  const [contract, setContract] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 1);

    setStartDate(formatDate(now));
    setEndDate(formatDate(nextMonth));
  }, []);

  useEffect(() => {
    setContract({ ...contract, startDate, endDate });
  }, [startDate, endDate]);

  useEffect(() => {
    if (application) {
      setContract({
        ...contract,
        albaId: application.albaId,
        jobsId: application.jobsId,
      });
    }
  }, [application]);

  function handleChecked() {
    setChecked(!checked);
    if (!checked) {
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(now.getMonth() + 1);

      setStartDate(formatDate(now));
      setEndDate(formatDate(nextMonth));
    }
  }

  function handlePassBtn() {
    const confirm = window.confirm("합격 시키시겠습니까?");
    if (confirm) {
      if (startDate >= endDate) {
        alert("시작 시간을 종료 시간보다 낮게 설정해주세요.");
      } else {
        axios
          .post(
            `/api/jobsId/${application.jobsId}/application-manage/pass`,
            contract,
          )
          .then(() => alert("합격 처리되었습니다."))
          .catch((err) => {
            alert(err.response.data);
          })
          .finally(() => setReload(!reload));
        onClose();
      }
    }
  }

  return (
    <>
      {application && (
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
                  <Center>
                    <Box mr={"10px"} color={"black"} fontWeight={"800"}>
                      {application.albaName} 알바생
                    </Box>
                    의 근무 기간을 정해주세요.
                  </Center>
                </Heading>
              </Box>
            </ModalHeader>
            <ModalBody>
              {checked || (
                <Flex gap={2} mb={"20px"}>
                  <InputGroup>
                    <Input
                      type={"date"}
                      defaultValue={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <InputRightElement fontWeight={"800"}>
                      부터
                    </InputRightElement>
                  </InputGroup>
                  <InputGroup>
                    <Input
                      type={"date"}
                      defaultValue={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <InputRightElement fontWeight={"800"}>
                      까지
                    </InputRightElement>
                  </InputGroup>
                </Flex>
              )}
              <Center
                border={"1px solid #E0E0E0"}
                w={"300px"}
                h={"40px"}
                borderRadius={"10px"}
              >
                <Checkbox colorScheme={"orange"} onChange={handleChecked}>
                  알바생과 직접 만나서 기간 정하기
                </Checkbox>
              </Center>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                취소
              </Button>
              <Button
                colorScheme={"blue"}
                variant="outline"
                onClick={handlePassBtn}
              >
                합격
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
