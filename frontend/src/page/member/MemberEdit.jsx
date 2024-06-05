import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";

export function MemberEdit() {
  const { id } = useParams();
  const [member, setMember] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => setMember(res.data))
      .catch()
      .finally();
  }, []);

  const handleInputChange = (prop) => (e) => {
    setMember({ ...member, [prop]: e.target.value });
  };

  function handleSaveBtn() {
    axios.put(`/api/member/${id}`, member).then().catch().finally();
  }

  return (
    <Center>
      <Box>
        <Box>
          <Heading>회원정보</Heading>
        </Box>
        <Box>
          <Box>
            <FormControl>
              <FormLabel>이메일</FormLabel>
              <Input value={member.email} isReadOnly />
              <FormLabel>패스워드</FormLabel>
              <Input
                defaultValue={""}
                onChange={handleInputChange("password")}
              />
              <FormLabel>패스워드 확인</FormLabel>
              <Input
                defaultValue={""}
                onChange={handleInputChange("passwordCheck")}
              />
              <FormLabel>이름</FormLabel>
              <Input
                defaultValue={member.name}
                onChange={handleInputChange("name")}
              />
              <FormLabel>주소</FormLabel>
              <Input
                defaultValue={member.address}
                onChange={handleInputChange("address")}
              />
              <FormLabel>전화번호</FormLabel>
              <Input
                defaultValue={member.phone}
                onChange={handleInputChange("phone")}
              />
              <Flex>
                <Button onClick={handleSaveBtn}>저장</Button>
                <Button>취소</Button>
              </Flex>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Center>
  );
}
