import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Img,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function ApplicationWriteModal({ id, src, isOpen, onOpen, onClose }) {
  const [application, setApplication] = useState({});
  const [resumeList, setResumeList] = useState([]);
  const [errors, setErrors] = useState({});

  const toast = useToast();
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/only-alba`)
      .then(() => {
        axios.get(`/api/jobs/${id}/apply`).then((res) => {
          setApplication({ ...application, title: res.data.jobsTitle });
          setResumeList(res.data.resumes);
        });
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate(`/jobs/${id}`);
        }
        if (err.response.status === 401) {
          navigate("/login");
        }
      });
  }, [account.id]);

  // Create
  function handleSubmitApply() {
    const confirm = window.confirm(
      "신청하시겠습니까? 한 번 신청하면 수정할 수 없습니다.",
    );

    if (confirm) {
      axios
        .get(`/api/${id}/apply-validate`)
        .then(() => {
          axios
            .post(`/api/jobs/${id}/apply`, application)
            .then(() => {
              toast({
                status: "success",
                description: "신청되었습니다.",
                position: "top",
              });
              onClose();
            })
            .catch((err) => {
              setErrors(err.response.data);
            });
        })
        .catch((err) => {
          const errorCode = err.response.status;
          if (errorCode === 401) {
            navigate("/login");
          }
          if (errorCode === 403) {
            onClose();
            alert("접근 권한이 없습니다.");
          }
          if (errorCode === 400) {
            onClose();
            alert(err.response.data);
          }
        });
    }
  }

  const isError = (prop) => prop !== undefined;

  const handleInputChange = (field) => (e) => {
    setApplication((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} w={"500px"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Box h={"40px"} bg={"#FF7F3E"} color={"white"} borderRadius={"10px"}>
            <Heading size={"md"} textAlign={"center"} lineHeight={"40px"}>
              알바 지원하기
            </Heading>
          </Box>
        </ModalHeader>
        <ModalBody>
          <Box>
            <Flex>
              <Center h={"50px"} mx={"15px"}>
                <Img
                  src={"/public/alba_connector_store_logo.png"}
                  w={"100px"}
                  h={"33px"}
                  borderRadius={"10px"}
                />
              </Center>
              <Center
                h={"50px"}
                fontWeight={"800"}
                fontSize={"17px"}
                ml={"10px"}
              >
                {application.title}
              </Center>
            </Flex>
            <Box w={"100%"} bg={"#E0E0E0"} h={"3px"} my={"20px"} />
            <FormControl isInvalid={isError(errors.resumeId)} mb={"15px"}>
              <FormLabel>이력서 첨부</FormLabel>
              <Select
                placeholder={"이력서를 선택해주세요."}
                onChange={handleInputChange("resumeId")}
              >
                {resumeList.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.title}
                  </option>
                ))}
              </Select>
              {errors.resumeId && (
                <FormErrorMessage>{errors.resumeId}</FormErrorMessage>
              )}
            </FormControl>
            <Divider my={2} />
            <FormControl isInvalid={isError(errors.comment)} mb={"30px"}>
              <FormLabel>지원메세지</FormLabel>
              <Textarea h={"300px"} onChange={handleInputChange("comment")} />
              {errors.comment && (
                <FormErrorMessage>{errors.comment}</FormErrorMessage>
              )}
            </FormControl>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="gray"
            variant={"outline"}
            mr={3}
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            colorScheme={"orange"}
            variant={"outline"}
            onClick={handleSubmitApply}
          >
            지원하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
