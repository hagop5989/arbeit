import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function ResumeWrite() {
  const [member, setMember] = useState(null);
  const [resume, setResume] = useState({});
  const [errors, setErrors] = useState({});
  const [isRookie, setIsRookie] = useState(true);
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (account.id !== "") {
      axios.get(`/api/member/${account.id}`).then((res) => setMember(res.data));
    }
  }, [account.id]);

  if (member == null) {
    return <Spinner />;
  }

  function handleRookieBtn(prop) {
    setIsRookie(prop);
    setResume({ ...resume, isRookie });
  }

  const handleInputChange = (prop) => (e) => {
    setResume({ ...resume, [prop]: e.target.value });
  };

  function handleWriteBtn() {
    axios
      .post("/api/resume/write", resume)
      .then(() => {
        toast({
          status: "success",
          description: "등록되었습니다.",
          position: "top",
        });
        navigate("/");
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  }

  return (
    <Box>
      <Heading>이력서 생성</Heading>
      <Box>
        <FormControl>
          <Box>
            {/* 회원 정보 */}
            <FormLabel>이름</FormLabel>
            <Input defaultValue={member.name} readOnly />
            <FormLabel>성별</FormLabel>
            <Input defaultValue={member.gender} readOnly />
            <FormLabel>생년월일</FormLabel>
            <Input defaultValue={member.birthDate} readOnly />
            <FormLabel>이메일</FormLabel>
            <Input defaultValue={member.email} readOnly />
            <FormLabel>전화번호</FormLabel>
            <Input defaultValue={member.phone} readOnly />
          </Box>
          <Box>
            {/* 이력서 정보 */}
            <FormLabel>제목</FormLabel>
            <Input onChange={handleInputChange("title")} />
            {errors && <FormHelperText>{errors.content}</FormHelperText>}
            <Flex>
              <Button onClick={() => handleRookieBtn(true)}>신입</Button>
              <Button onClick={() => handleRookieBtn(false)}>경력</Button>
            </Flex>
            <FormLabel>자기 소개</FormLabel>
            <Textarea
              placeholder={"자기소개를 써주세요."}
              onChange={handleInputChange("content")}
            />
            {errors && <FormHelperText>{errors.content}</FormHelperText>}
            <Button onClick={handleWriteBtn}>작성</Button>
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
}
