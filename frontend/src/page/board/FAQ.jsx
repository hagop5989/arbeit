import React, { useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <title>FAQ - 알바커넥터</title>
      </Helmet>
      <Box>
        <Tabs variant="enclosed" mt={2} onChange={handleTabChange}>
          <TabList>
            <Tab w={"200px"} h={"50px"} fontWeight={"600"}>
              알바
            </Tab>
            <Tab w={"200px"} h={"50px"} fontWeight={"600"}>
              사장
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      <Center w={"100%"} h={"120px"} color={"#FF8708"}>
        <Box>
          <Center fontSize={"25px"} fontWeight={"600"}>
            F A Q
          </Center>
          <Flex fontSize={"15px"} gap={2}>
            <Box>
              <FontAwesomeIcon icon={faCircleInfo} />
            </Box>
            <Text>궁금한 점을 찾아보세요</Text>
          </Flex>
        </Box>
      </Center>
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
