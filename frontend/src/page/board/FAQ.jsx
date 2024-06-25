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
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function FAQ() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [WQnA, setWQnA] = useState([]);
  const [BQnA, setBQnA] = useState([]);
  const account = useContext(LoginContext);
  const navigate = useNavigate();

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
              <Box>
                <Text as="span" fontSize="lg" color="red.500">
                  A.
                </Text>{" "}
                <Text whiteSpace="pre-line">{faq.answer}</Text>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <Box m={"30px"}>
        {account.isAdmin() && (
          <Button onClick={() => navigate("/faq/manage")}>FAQ 수정</Button>
        )}
      </Box>
    </Box>
  );
}

export default FAQ;
