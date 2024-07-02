import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";

const styles = {
  th: {
    borderBottom: "1px solid gray",
    fontSize: "sm",
  },
};
export function ResumeList() {
  const account = useContext(LoginContext);
  const [resumeList, setResumeList] = useState([]);
  const [check, setCheck] = useState([]);
  const [refresh, setRefresh] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/only-alba")
      .then(() => {
        if (account.id !== "") {
          axios.get(`/api/${account.id}/resume/list`).then((res) => {
            setResumeList(res.data);
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
        }
        if (err.response.status === 403) {
          navigate("/");
        }
      });
  }, [account.id, refresh]);

  const handleCheckBoxChange = (e) => {
    const value = e.target.value;

    if (e.target.checked) {
      setCheck([...check, value]);
    } else {
      setCheck(check.filter((item) => item !== value));
    }
  };

  function handleRemoveBtn() {
    if (check.length === 0) {
      alert("이력서를 선택해주세요.");
    } else {
      const confirm = window.confirm("삭제하시겠습니까?");
      if (confirm) {
        axios.post("/api/resume/delete", check).then(() => {
          setRefresh(check);
          setCheck([]);
        });
      }
    }
  }

  const btnStyles = (color) => ({
    bgColor: "white",
    color: color,
    border: `2px solid ${color}`,
    _hover: { bgColor: color, color: "white" },
  });

  return (
    <>
      {account.isAlba() && (
        <Box w={"100%"} h={"55vh"}>
          <Box>
            <Heading p={1} fontFamily={"SBAggroB"}>
              이력서 관리
            </Heading>
            <Flex>
              <Box my={"20px"} h={"50px"} lineHeight={"50px"}>
                * 이력서를 등록하면 알바 채용에 지원할 수 있습니다.
              </Box>

              <Spacer />
              <Button
                mt={"25px"}
                {...btnStyles("black")}
                opacity={"0.7"}
                size={"sm"}
                onClick={() => navigate("/resume/register")}
              >
                이력서 등록
              </Button>
            </Flex>

            <Box>
              <Table>
                <Thead
                  bg="gray.100"
                  borderTop={"1px solid gray"}
                  borderBottom={"2px solid #E9E9E9"}
                >
                  <Tr>
                    <Th {...styles.th}>선택</Th>
                    <Th {...styles.th}>작성일</Th>
                    <Th {...styles.th}>제목</Th>
                    <Th {...styles.th}>관리</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {resumeList.map((resume, index) => (
                    <Tr key={resume.id} _hover={{ bg: "gray.100" }}>
                      <Td borderBottom={"1px solid #E0E0E0"} w={"80px"}>
                        <Checkbox
                          value={resume.id}
                          onChange={handleCheckBoxChange}
                        />
                      </Td>
                      <Td borderBottom={"1px solid #E0E0E0"}>
                        {resume.inserted}
                      </Td>
                      <Td
                        w={"600px"}
                        borderBottom={"1px solid #E0E0E0"}
                        cursor={"pointer"}
                        onClick={() => navigate(`/resume/${resume.id}`)}
                      >
                        {resume.title}
                      </Td>
                      <Td borderBottom={"1px solid #E0E0E0"}>
                        <Button
                          colorScheme={"blue"}
                          variant={"outline"}
                          size={"sm"}
                          onClick={() => navigate(`/resume/${resume.id}/edit`)}
                        >
                          수정
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Box>
                <Button
                  {...btnStyles("orangered")}
                  size={"sm"}
                  onClick={handleRemoveBtn}
                  mt={3}
                >
                  삭제
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
