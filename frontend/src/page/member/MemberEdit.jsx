import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Spinner,
} from "@chakra-ui/react";

export function MemberEdit() {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [member, setMember] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => setMember(res.data))
      .catch()
      .finally();
  }, []);

  function handleSaveBtn() {
    axios
      .put(`/api/member/${id}`, member)
      .then(() => {
        navigate(`/member/${member.id}`);
      })
      .catch((err) => {
        setErrors(err.response.data);
      })
      .finally();
  }

  const handleInputChange = (prop) => (e) => {
    setMember({ ...member, [prop]: e.target.value });
  };

  if (member === null) {
    return <Spinner />;
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
              {errors && (
                <FormHelperText>{errors.passwordCheck}</FormHelperText>
              )}

              <FormLabel>이름</FormLabel>
              <Input value={member.name} onChange={handleInputChange("name")} />
              {errors && <FormHelperText>{errors.name}</FormHelperText>}

              <FormLabel>주소</FormLabel>
              <Input
                value={member.address}
                onChange={handleInputChange("address")}
              />
              {errors && <FormHelperText>{errors.address}</FormHelperText>}

              <FormLabel>전화번호</FormLabel>
              <Input
                value={member.phone}
                onChange={handleInputChange("phone")}
              />
              {errors && <FormHelperText>{errors.phone}</FormHelperText>}

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
