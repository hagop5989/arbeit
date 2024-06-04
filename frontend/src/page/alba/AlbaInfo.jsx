import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function AlbaInfo() {
  const { id } = useParams();
  const [alba, setAlba] = useState({});
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`/api/alba/${id}`)
      .then((res) => setAlba(res.data))
      .catch()
      .finally();
  }, []);

  function handleRemoveBtn() {
    axios
      .delete(`/api/alba/${id}`)
      .then(() => {
        toast({
          status: "success",
          description: "삭제되었습니다.",
          position: "top",
        });
      })
      .catch()
      .finally();
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
              <Input value={alba.email} isReadOnly />
              <FormLabel>이름</FormLabel>
              <Input value={alba.name} isReadOnly />
              <FormLabel>주소</FormLabel>
              <Input value={alba.address} isReadOnly />
              <FormLabel>전화번호</FormLabel>
              <Input value={alba.phone} isReadOnly />
              <Flex>
                <Button onClick={() => navigate(`/alba/edit/${id}`)}>
                  회원 수정
                </Button>
                <Button onClick={handleRemoveBtn}>회원 삭제</Button>
              </Flex>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Center>
  );
}
