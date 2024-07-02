import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const styles = {
  th: {
    fontSize: "sm",
    borderBottom: "2px solid #E0E0E0",
  },
  td: {
    borderBottom: "1px solid #E0E0E0",
  },
};

export function AlbaList() {
  const [albaList, setAlbaList] = useState([]);
  const [albaScore, setAlbaScore] = useState(5);
  const [selectedAlba, setSelectedAlba] = useState({});

  const navigate = useNavigate();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get("/api/alba-list")
      .then((res) => {
        setAlbaList(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
  }, [account.id, selectedAlba]);

  function handleAlbaScoreBtn() {
    const confirm = window.confirm(
      "점수를 주시겠습니까? 점수를 준 이후엔 직원 목록에서 해당 직원이 삭제됩니다.",
    );
    if (confirm) {
      axios
        .post("/api/review/alba", {
          ...selectedAlba,
          albaScore,
        })
        .then(() => setSelectedAlba(null));
      onClose();
    }
  }

  function handleOpenModal(alba) {
    onOpen();
    setSelectedAlba({
      ...selectedAlba,
      albaId: alba.albaId,
      jobsId: alba.jobsId,
    });
  }

  //  핸드폰 번호 - 붙여서 보여주기 (실제론 아님)
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  return (
    <Box minH={"500px"} mb={"150px"}>
      <Box>
        <Heading p={1} fontFamily={"SBAggroB"}>
          직원 관리
        </Heading>
        <Flex>
          <Box my={"20px"} h={"50px"} lineHeight={"50px"}>
            <Box h={"25px"} lineHeight={"25px"}>
              * 직원의 근무 기간이 끝나면 알바 점수를 부여해주세요!
            </Box>
            <Box h={"25px"} lineHeight={"25px"}>
              * 높은 알바 점수는 이후 알바생이 알바를 구할 때 도움이 됩니다.
            </Box>
          </Box>
        </Flex>
      </Box>
      <Table borderRadius="lg" w="1050px">
        <Thead
          bg="gray.100"
          p={2}
          borderTop={"1px solid gray"}
          borderBottom={"2px solid #E9E9E9"}
        >
          <Tr>
            <Th w={"5%"} {...styles.th}>
              #
            </Th>
            <Th w={"15%"} {...styles.th}>
              직원명
            </Th>
            <Th w={"20%"} {...styles.th}>
              연락처
            </Th>
            <Th w={"15%"} {...styles.th}>
              일하는 지점
            </Th>
            <Th w={"12%"} {...styles.th}>
              계약시작
            </Th>
            <Th w={"12%"} {...styles.th}>
              계약종료
            </Th>
            <Th w={"13%"} {...styles.th}>
              알바점수 주기
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {albaList.map((alba, index) => (
            <Tr key={index}>
              <Td {...styles.td}>{index + 1}</Td>
              <Td fontWeight={"800"} {...styles.td}>
                {alba.albaName}
              </Td>
              <Td fontWeight={"800"} {...styles.td}>
                {formatPhoneNumber(alba.albaPhone)}
              </Td>
              <Td {...styles.td}>{alba.storeName}</Td>
              <Td fontSize={"sm"} {...styles.td}>
                {alba.startDate}
              </Td>
              <Td fontSize={"sm"} {...styles.td}>
                {alba.endDate}
              </Td>
              <Td {...styles.td} w={"100px"}>
                {alba.albaReview === undefined && (
                  <Button
                    size={"sm"}
                    colorScheme={"orange"}
                    onClick={() => handleOpenModal(alba)}
                  >
                    점수 주기
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center
              bg={"orange"}
              h={"40px"}
              borderRadius={"10px"}
              color={"white"}
            >
              알바점수 주기
            </Center>
          </ModalHeader>
          <ModalBody>
            <Box mb={"5px"}>* 알바점수는 1~10점 까지 줄 수 있습니다.</Box>
            <Box mb={"20px"}>
              * 점수를 준 이후엔 해당 직원은 목록에서 삭제됩니다.
            </Box>
            <Box p={4} pt={6}>
              <Slider
                defaultValue={albaScore}
                min={0}
                max={10}
                step={1}
                onChange={(val) => setAlbaScore(val)}
              >
                <SliderMark value={0} mt="3" ml="-2.5" fontSize="sm">
                  0 점
                </SliderMark>
                <SliderMark value={5} mt="3" ml="-2.5" fontSize="sm">
                  5 점
                </SliderMark>
                <SliderMark value={10} mt="3" ml="-2.5" fontSize="sm" w="50px">
                  10 점
                </SliderMark>
                <SliderMark
                  value={albaScore}
                  textAlign="center"
                  borderRadius="10px"
                  bg="orange"
                  color="white"
                  mt="-10"
                  ml="-3"
                  w="6"
                >
                  {albaScore}
                </SliderMark>
                <SliderTrack>
                  <SliderFilledTrack bg="orange" />
                </SliderTrack>
                <SliderThumb>
                  <Box>
                    <FontAwesomeIcon
                      icon={faStar}
                      color={"#F5C903"}
                      size={"lg"}
                    />
                  </Box>
                </SliderThumb>
              </Slider>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              취소
            </Button>
            <Button
              colorScheme={"orange"}
              variant={"outline"}
              onClick={handleAlbaScoreBtn}
            >
              점수 주기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
