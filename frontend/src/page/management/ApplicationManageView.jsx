import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { ContractModal } from "./ContractModal.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";

const styles = {
  text: {
    borderBottom: "1px solid #B0B5BD",
    fontSize: "18px",
    fontWeight: "800",
    lineHeight: "40px",
    h: "40px",
    px: "10px",
  },
  info: {
    fontSize: "15px",
    fontWeight: "800",
    lineHeight: "30px",
    h: "30px",
    px: "10px",
  },
};

export function ApplicationManageView() {
  const { jobsId, albaId } = useParams();
  const [application, setApplication] = useState({});

  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios
      .get("/api/only-boss")
      .then(() => {
        axios
          .get(`/api/jobsId/${jobsId}/application-manage/detail/${albaId}`)
          .then((res) => {
            setApplication(res.data);
          });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
  }, [jobsId]);

  return (
    <>
      {account.isBoss() && (
        <Box w="500px" height={"700px"}>
          <Box
            h={"70px"}
            mb={"30px"}
            bg={"#FF7F3E"}
            color={"white"}
            borderRadius={"10px"}
          >
            <Heading size={"lg"} textAlign={"center"} lineHeight={"70px"}>
              {application.name} 님의 지원서
            </Heading>
          </Box>
          <Box
            p={"20px"}
            borderBottom={"3px solid gray"}
            borderRight={"2px solid gray"}
            borderTop={"1px solid #E0E0E0"}
            borderLeft={"1px solid #E0E0E0"}
            borderRadius={"10px"}
          >
            <Flex {...styles.text}>
              <Box mr={"20px"} color={"#505050"}>
                지원 공고
              </Box>
              <Link href={`/jobs/${jobsId}`}>{application.jobsTitle}</Link>
            </Flex>
            <Box borderBottom={"1px solid #B0B5BD"} p={"10px"}>
              <Box {...styles.info} fontSize={"15px"}>
                이름 : {application.name}
              </Box>
              <Box {...styles.info}>연락처 : {application.phone}</Box>
              <Flex>
                <Box {...styles.info}>이메일 : {application.email}</Box>
                <Spacer />
                <Button
                  size={"sm"}
                  colorScheme={"orange"}
                  variant={"outline"}
                  onClick={() =>
                    window.open(`/resume/${application.resumeId}`, "_blank")
                  }
                >
                  이력서 확인
                </Button>
              </Flex>
            </Box>
            <Box
              mt={"20px"}
              border={"1px solid #E0E0E0"}
              borderRadius={"10px"}
              p={"10px"}
            >
              <Box
                {...styles.text}
                fontSize={"17px"}
                color={"#505050"}
                w={"100px"}
                border={"0px"}
              >
                지원메시지
              </Box>
              <Box {...styles.info} whiteSpace={"break-spaces"} h={"200px"}>
                {application.comment}
              </Box>
            </Box>
            <Flex my={"20px"} fontWeight={"700"}>
              <Spacer />
              <Box color={"#505050"}>처리상태</Box>
              <Box ml={"20px"}>
                {application.isPassed === undefined && "미정"}
                {application.isPassed !== undefined &&
                  (application.isPassed === 1 ? "합격" : "불합격")}
              </Box>
            </Flex>
            <Flex gap={1}>
              <Button
                colorScheme={"blue"}
                variant={"outline"}
                size={"sm"}
                onClick={() => navigate("/application-manage/list")}
              >
                목록으로
              </Button>
              <Spacer />
              <Button onClick={onOpen} colorScheme={"blue"} size={"sm"}>
                합격
              </Button>
              <Button colorScheme={"red"} size={"sm"}>
                불합격
              </Button>
            </Flex>
          </Box>
          <ContractModal isOpen={isOpen} onClose={onClose} />
        </Box>
      )}
    </>
  );
}
