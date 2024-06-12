import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

export function MemberInfo() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [profileSrc, setProfileSrc] = useState("");
  const fileInputRef = useRef({});
  const navigate = useNavigate();
  const toast = useToast();

  function getProfilePicture() {
    axios
      .get(`/api/profile/${id}`)
      .then((res) => {
        setProfileSrc(res.data);
      })
      .catch(() =>
        toast({
          status: "error",
          description: "내부 오류 발생",
          position: "top",
        }),
      )
      .finally();
  }

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
    getProfilePicture();
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

  function handleProfilePictureBtn() {
    fileInputRef.current.click();
  }

  const handleFileChange = (event) => {
    const files = event.target.files;
    axios.postForm("/api/profile/register", { files, id }).then(() => {
      getProfilePicture();
    });
  };

  return (
    <Center>
      <Box>
        <Box>
          <Heading>회원정보</Heading>
        </Box>
        <Box>
          <Box>
            {/* 프로필 사진 */}
            <FormControl>
              <FormLabel>사진</FormLabel>
              <Image
                w={"240px"}
                h={"240px"}
                border={"1px solid gray"}
                borderRadius={150}
                src={
                  profileSrc === ""
                    ? "https://contents.albamon.kr/monimg/msa/assets/images/icon_profile_male80.svg"
                    : profileSrc
                }
              />
              <Center
                boxSize={"50px"}
                bgColor="gray.100"
                borderRadius={100}
                mt={"-30px"}
                cursor="pointer"
                onClick={handleProfilePictureBtn}
              >
                <FontAwesomeIcon icon={faCamera} fontSize={"25px"} />
              </Center>
              <Input
                type={"file"}
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </FormControl>
            {/* 회원 정보 */}
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
