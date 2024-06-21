import React, { useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";

export function FAQ() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const workerFaqs = [
    {
      question: "이력서를 쓰고 싶어요.",
      answer:
        "오른쪽 위에 이력서 관리에 들어가면 이력서 목록이 나오고 이력서 생성 버튼을 누르면 이력서를 쓸 수 있습니다." +
        "\n   이 방법 말고도 왼쪽 사이드메뉴에 마우스를 대면 이력서 등록 페이지에 갈 수 있습니다.",
      open: false,
    },
    {
      question: "제가 봤었던 공고를 다시 보고 싶어요",
      answer:
        "오른쪽 사이드바에 최근 본 알바를 클릭하면 봤었던 알바 공고를 다시 확인 할수 있습니다.",
      open: false,
    },
    {
      question: "알바",
      answer: "알알알바바바",
      open: false,
    },
    {
      question: "회원 탈퇴를 하고 싶어요",
      answer:
        "오른쪽 위에 로그아웃 옆에 자신의 닉네임을 클릭하게 되면 자신의 회원정보가 나타나게 되는데 아래에 회원 탈퇴버튼이 있습니다.",
      open: false,
    },
    {
      question: "회원 정보 수정을 하고 싶어요",
      answer:
        "오른쪽 위에 로그아웃 옆에 자신의 닉네임을 클릭하게 되면 자신의 회원정보가 나타나게 되는데 아래에 회원 수정버튼이 있습니다.",
      open: false,
    },
  ];

  const ownerFaqs = [
    {
      question: "공고를 등록하려면 어떻게 해야하나요?",
      answer:
        "오른쪽 위에 공고 등록을 이용하면 됩니다. 그 옆에 있는 가게 등록을 먼저 하셔야 공고 등록에 필요한 정보를 다 입력할 수 있습니다.",
      open: false,
    },
    {
      question: "회원 탈퇴를 하고 싶어요",
      answer:
        "오른쪽 위에 로그아웃 옆에 자신의 닉네임을 클릭하게 되면 자신의 회원정보가 나타나게 되는데 아래에 회원 탈퇴버튼이 있습니다.",
      open: false,
    },
    {
      question: "회원 정보 수정을 하고 싶어요",
      answer:
        "오른쪽 위에 로그아웃 옆에 자신의 닉네임을 클릭하게 되면 자신의 회원정보가 나타나게 되는데 아래에 회원 수정버튼이 있습니다.",
      open: false,
    },
  ];

  const faqs = selectedTab === 0 ? workerFaqs : ownerFaqs;

  const handleTabChange = (index) => {
    setSelectedTab(index);
    setExpandedIndex(-1);
  };

  const handleAccordionChange = (index) => {
    setExpandedIndex(index === expandedIndex ? -1 : index);
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
        FAQ
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
              <Text>
                <Text as="span" fontSize="lg" color="red.500">
                  A.
                </Text>{" "}
                <Text whiteSpace="pre-line">{faq.answer}</Text>
              </Text>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}

export default FAQ;
