import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function MemberInfo() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => setMember(res.data))
      .catch(() => {
        toast({
          status: "warning",
          description: "접근 권한이 없습니다.",
          position: "top",
        });
        navigate("/member/list");
      })
      .finally();
  }, []);

  function handleRemoveBtn() {
    axios
      .delete(`/api/member/${id}`)
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

  if (member === null) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
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
              <FormLabel>이름</FormLabel>
              <Input value={member.name} isReadOnly />
              <FormLabel>성별</FormLabel>
              <Input value={member.gender} isReadOnly />
              <FormLabel>생년월일</FormLabel>
              <Input value={member.birthDate} isReadOnly />
              <FormLabel>주소</FormLabel>
              <Input value={member.address} isReadOnly />
              <FormLabel>전화번호</FormLabel>
              <Input value={member.phone} isReadOnly />
              <Flex>
                <Button onClick={() => navigate(`/member/${id}/edit`)}>
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
