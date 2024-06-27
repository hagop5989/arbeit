import {
  Box,
  Button,
  Checkbox,
  Divider,
  Heading,
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
    fontSize: "medium",
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

  return (
    <>
      {account.isAlba() && (
        <Box w={"100%"} h={"55vh"}>
          <Box>
            <Heading mb={"10px"} p={1}>
              나의 이력서
            </Heading>
            <Divider mb={"40px"} borderWidth={"2px"} />
            <Button
              onClick={() => navigate("/resume/register")}
              colorScheme={"green"}
              variant={"outline"}
              w={120}
              my={3}
            >
              이력서 등록
            </Button>
            <Box>
              <Table>
                <Thead>
                  <Tr borderTop={"1px solid gray"}>
                    <Th {...styles.th}>#</Th>
                    <Th {...styles.th}>선택</Th>
                    <Th {...styles.th}>제목</Th>
                    <Th {...styles.th}>작성일</Th>
                    <Th {...styles.th}>관리</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {resumeList.map((resume, index) => (
                    <Tr key={resume.id} _hover={{ bg: "gray.100" }}>
                      <Td>{index + 1}</Td>
                      <Td borderBottom={"1px solid #E0E0E0"} w={"130px"}>
                        <Checkbox
                          value={resume.id}
                          onChange={handleCheckBoxChange}
                        />
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
                        {resume.inserted}
                      </Td>
                      <Td borderBottom={"1px solid #E0E0E0"}>
                        <Button
                          onClick={() => navigate(`/resume/${resume.id}/edit`)}
                        >
                          수정
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button
                colorScheme={"red"}
                variant={"outline"}
                onClick={handleRemoveBtn}
                mt={3}
              >
                삭제
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
