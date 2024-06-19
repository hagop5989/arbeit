import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Divider,
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
    <Box w="full" maxW="70%" mx="auto" p={5}>
      <Box>
        <Heading mb={"10px"} p={1}>
          회원정보
        </Heading>
        <Divider mb={"40px"} borderWidth={"2px"} />
        <Box>
          <Box>
            <FormControl>
              <Box mb={4}>
                <FormLabel fontSize={"xl"}>이메일</FormLabel>
                <Input value={member.email} isReadOnly />
              </Box>

              <Box mb={4}>
                <FormLabel fontSize={"xl"}>패스워드</FormLabel>
                <Input
                  defaultValue={""}
                  onChange={handleInputChange("password")}
                />
              </Box>

              <Box mb={4}>
                <FormLabel fontSize={"xl"}>패스워드 확인</FormLabel>
                <Input
                  defaultValue={""}
                  onChange={handleInputChange("passwordCheck")}
                />
                {errors && (
                  <FormHelperText color="red.500">
                    {errors.passwordCheck}
                  </FormHelperText>
                )}
              </Box>

              <Flex gap={"10px"} mb={4}>
                <Box w={"50%"}>
                  <FormLabel fontSize={"xl"}>이름</FormLabel>
                  <Input
                    value={member.name}
                    onChange={handleInputChange("name")}
                  />
                  {errors && <FormHelperText>{errors.name}</FormHelperText>}
                </Box>

                <Box w={"50%"}>
                  <FormLabel fontSize={"xl"}>전화번호</FormLabel>
                  <Input
                    value={member.phone}
                    onChange={handleInputChange("phone")}
                  />
                  {errors && <FormHelperText>{errors.phone}</FormHelperText>}
                </Box>
              </Flex>

              <FormLabel fontSize={"xl"}>주소</FormLabel>
              <Input
                value={member.address}
                onChange={handleInputChange("address")}
              />
              {errors && <FormHelperText>{errors.address}</FormHelperText>}

              <Flex gap={"10px"} my={"20px"}>
                <Button
                  onClick={handleSaveBtn}
                  w={"50%"}
                  bgColor={"#FF7F3E"}
                  color={"white"}
                >
                  저장
                </Button>
                <Button
                  onClick={() => {
                    navigate(`/member/${id}`);
                  }}
                  w={"50%"}
                  bgColor={"gray.500"}
                  color={"white"}
                >
                  취소
                </Button>
              </Flex>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
