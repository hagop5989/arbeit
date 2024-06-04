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

export function AlbaEdit() {
  const { id } = useParams();
  const [alba, setAlba] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/alba/${id}`)
      .then((res) => setAlba(res.data))
      .catch()
      .finally();
  }, []);

  const handleInputChange = (prop) => (e) => {
    setAlba({ ...alba, [prop]: e.target.value });
  };

  function handleSaveBtn() {
    axios.put(`/api/alba/edit`, alba).then().catch().finally();
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
              <Input
                defaultValue={alba.email}
                onChange={handleInputChange("email")}
              />
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
                defaultValue={alba.name}
                onChange={handleInputChange("name")}
              />
              <FormLabel>주소</FormLabel>
              <Input
                defaultValue={alba.address}
                onChange={handleInputChange("address")}
              />
              <FormLabel>전화번호</FormLabel>
              <Input
                defaultValue={alba.phone}
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
