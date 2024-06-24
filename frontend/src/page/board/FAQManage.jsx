import React, { useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function FAQManage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [WQnA, setWQnA] = useState([]);
  const [BQnA, setBQnA] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editId, setEditId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get("/api/faq/Wlist").then((res) => setWQnA(res.data));
  }, []);

  useEffect(() => {
    axios.get("/api/faq/Blist").then((res) => setBQnA(res.data));
  }, []);

  const faqs = selectedTab === 0 ? WQnA : BQnA;

  const handleTabChange = (index) => {
    setSelectedTab(index);
    setExpandedIndex(-1);
  };

  const handleAccordionChange = (index) => {
    setExpandedIndex(index === expandedIndex ? -1 : index);
  };

  const handleDelete = (id) => {
    const apiEndpoint =
      selectedTab === 0 ? `/api/faq/w/${id}` : `/api/faq/b/${id}`;
    axios.delete(apiEndpoint).then(() => {
      if (selectedTab === 0) {
        setWQnA((prev) => prev.filter((faq) => faq.id !== id));
      } else {
        setBQnA((prev) => prev.filter((faq) => faq.id !== id));
      }
    });
  };

  const handleAdd = () => {
    if (newQuestion && newAnswer) {
      const newFAQ = { question: newQuestion, answer: newAnswer };
      const apiEndpoint = selectedTab === 0 ? "/api/faq/wadd" : "/api/faq/badd";
      axios
        .post(apiEndpoint, newFAQ)
        .then((res) => {
          const addedFAQ = res.data;
          if (selectedTab === 0) {
            setWQnA((prev) => [addedFAQ, ...prev]);
          } else {
            setBQnA((prev) => [addedFAQ, ...prev]);
          }
          setNewQuestion("");
          setNewAnswer("");
        })
        .catch((error) => {
          console.error("Error adding FAQ:", error);
        });
    }
  };

  const handleEdit = (id) => {
    setEditId(id);
    const faq = faqs.find((faq) => faq.id === id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleSaveEdit = () => {
    const updatedFAQ = {
      id: editId,
      question: editQuestion,
      answer: editAnswer,
    };
    const apiEndpoint =
      selectedTab === 0 ? `/api/faq/w/${editId}` : `/api/faq/b/${editId}`;
    axios.put(apiEndpoint, updatedFAQ).then(() => {
      if (selectedTab === 0) {
        setWQnA((prev) =>
          prev.map((faq) => (faq.id === editId ? updatedFAQ : faq)),
        );
      } else {
        setBQnA((prev) =>
          prev.map((faq) => (faq.id === editId ? updatedFAQ : faq)),
        );
      }
      setEditId(null);
      setEditQuestion("");
      setEditAnswer("");
    });
  };

  return (
    <Box width="100%" mt="5" borderRadius="md">
      <Box>
        <Tabs variant="enclosed" mt={2} onChange={handleTabChange}>
          <TabList>
            <Tab w={"200px"} h={"50px"}>
              알바
            </Tab>
            <Tab w={"200px"} h={"50px"}>
              사장
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      <Heading
        as="h2"
        size="lg"
        margin="5"
        textAlign="center"
        color={"#df7d4a"}
      >
        FAQ 관리
      </Heading>
      <Accordion
        allowToggle
        index={expandedIndex}
        onChange={handleAccordionChange}
      >
        {faqs.map((faq, i) => (
          <AccordionItem key={i} sx={{ transition: "none" }}>
            <AccordionButton p={"30px"}>
              <Box flex="1" textAlign="left">
                <Text as="span" fontSize="lg" color="orange.500">
                  Q.
                </Text>{" "}
                {faq.question}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel
              bgColor={"gray.100"}
              pl={"40px"}
              pb={4}
              pt={4}
              sx={{ transition: "none" }}
            >
              <VStack align="start">
                <Box>
                  <Text as="span" fontSize="lg" color="red.500">
                    A.
                  </Text>{" "}
                  <Text whiteSpace="pre-line">{faq.answer}</Text>
                </Box>
                <HStack spacing={4}>
                  <Button colorScheme="blue" onClick={() => handleEdit(faq.id)}>
                    수정
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDelete(faq.id)}
                  >
                    삭제
                  </Button>
                </HStack>
                {editId === faq.id && (
                  <Box mt={4}>
                    <Input
                      placeholder="질문 수정"
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                      mb={2}
                    />
                    <Textarea
                      placeholder="답변 수정"
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      mb={2}
                    />
                    <Button colorScheme="green" onClick={handleSaveEdit}>
                      저장
                    </Button>
                    <Button
                      colorScheme="gray"
                      onClick={() => setEditId(null)}
                      ml={2}
                    >
                      취소
                    </Button>
                  </Box>
                )}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <Box mt={4}>
        {account.isAdmin() && (
          <VStack spacing={4} align="start">
            <Input
              placeholder="질문 추가"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <Textarea
              placeholder="답변 추가"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <Button colorScheme="teal" onClick={handleAdd}>
              FAQ 추가
            </Button>
          </VStack>
        )}
      </Box>
    </Box>
  );
}

export default FAQManage;
