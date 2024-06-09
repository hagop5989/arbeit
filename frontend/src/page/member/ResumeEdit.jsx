import {
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Radio,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons/faCamera";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";

export function ResumeEdit() {
  const [resume, setResume] = useState({
    nickName: "",
    password: "",
    email: "",
  });
  const toast = useToast();
  const navigate = useNavigate();

  function mytoast(text, status) {
    toast({
      description: text,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  //
  return (
    <Box ml={"50px"}>
      {/*<Image src="/rightNav.JPG" position={"fixed"} top={"0%"} right={"25%"} />*/}
      <Box my={20} w={"1030px"}>
        <Heading>이력서 수정</Heading>
        <Box
          mt={6}
          border={"1px solid lightgray"}
          borderRadius={"8px"}
          w={"1030px"}
          h={"260px"}
          px={"40px"}
          py={"48px"}
        >
          <Box w={"930px"} h={"180px"}>
            <Flex>
              <Image
                w={"130px"}
                h={"130px"}
                src={
                  "https://contents.albamon.kr/monimg/msa/assets/images/icon_profile_male80.svg"
                }
              />
              <Center
                border={"0px solid lightgray"}
                mt={90}
                ml={-8}
                borderRadius={100}
                boxSize={"24px"}
                p={5}
                bgColor="#c0c0c0"
              >
                <FontAwesomeIcon
                  icon={faCamera}
                  fontSize={"20px"}
                  cursor="pointer"
                />
              </Center>

              <Box w={"760px"} h={"180px"} ml={"50px"}>
                <Box h={"35px"}>
                  <Flex justifyContent={"space-between"}>
                    <Flex>
                      <Text fontWeight={600} fontSize={"1.25rem"}>
                        장대성
                      </Text>

                      <Text
                        lineHeight={"27px"}
                        color={"#9e9e9e"}
                        fontSize={"sm"}
                        ml={3}
                      >
                        남자 00세 / 1990년생
                      </Text>
                    </Flex>
                    <FontAwesomeIcon
                      icon={faGear}
                      fontSize={"25px"}
                      cursor="pointer"
                    />
                  </Flex>
                </Box>
                <Flex fontSize={"sm"} mt={6}>
                  <Box>
                    <Flex w={"350px"}>
                      <Text>주소지</Text>
                      <Text ml={10}>서울 노원구 월계동</Text>
                    </Flex>
                    <Flex w={"350px"} mt={4}>
                      <Text>휴대폰</Text>
                      <Text ml={10}>010-2037-5989</Text>
                    </Flex>
                  </Box>
                  <Flex w={"350px"}>
                    <Text>이메일</Text>
                    <Text ml={10}>zang5989@naver.com</Text>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Box>
        <Box my={20}>
          <Heading>이력서 제목</Heading>
          <Divider borderWidth="1px" my={6} borderColor={"gray"} />
          <Input
            border={"1px solid lightgray"}
            borderRadius={"8px"}
            w={"900px"}
            h={"50px"}
            placeholder={"제목을 입력해주세요."}
          ></Input>
        </Box>
        <Box my={20}>
          <Flex justifyContent={"space-between"}>
            <Heading>경력사항</Heading>
            <Select
              w={150}
              fontSize={"sm"}
              color={"gray"}
              placeholder={"경력불러오기"}
            >
              <option>경력1</option>
              <option>경력2</option>
            </Select>
          </Flex>
          <Divider borderWidth="1px" my={6} borderColor={"gray"} />

          <Tabs variant="enclosed" mt={2}>
            <TabList>
              <Tab w={"160px"} h={"50px"}>
                신입
              </Tab>
              <Tab w={"160px"} h={"50px"}>
                경력
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text></Text>
              </TabPanel>
              <TabPanel>
                <Box>
                  <Flex my={"40px"}>
                    <Text w={"160px"}>나의 경력</Text>
                    <Text fontSize={"sm"}> 0 일</Text>
                  </Flex>
                  <Flex my={"40px"} h={"45px"}>
                    <Text w={"160px"}>회사명</Text>
                    <Input
                      w={"760px"}
                      fontSize={"sm"}
                      placeholder={"회사명을 입력해주세요."}
                    ></Input>
                  </Flex>
                  <Box h={"60px"}>
                    <Flex gap={3}>
                      <Text w={"160px"}>근무기간</Text>
                      <Flex gap={10} fontSize={"sm"}>
                        <Radio w={"150px"}>1개월 이상 근무</Radio>
                        <Input w={"160px"} type={"date"} />
                        <Text mt={2} fontSize={"xl"}>
                          ~
                        </Text>
                        <Input w={"160px"} type={"date"} />
                      </Flex>
                    </Flex>
                  </Box>
                  <Flex gap={3}>
                    <Text w={"160px"}></Text>
                    <Flex gap={10} fontSize={"sm"}>
                      <Radio w={"150px"}>1개월 이상 근무</Radio>
                      <Input w={"160px"} type={"date"} />
                      <Text mt={2} fontSize={"xl"}>
                        ~
                      </Text>
                      <Input w={"160px"} type={"date"} />
                    </Flex>
                  </Flex>
                </Box>
                <Box py={"25px"}>
                  <Flex>
                    <Text w={"160px"}>담당업무</Text>
                    <Textarea
                      w={"790px"}
                      h={"180px"}
                      resize={"none"}
                      placeholder={"담당업무를 입력해주세요."}
                    />
                  </Flex>
                </Box>
                <Center py={30}>
                  <Button
                    bgColor={"black"}
                    color={"white"}
                    fontSize={"sm"}
                    fontWeight={"sm"}
                  >
                    경력사항 추가
                  </Button>
                </Center>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <Box my={20}>
          <Heading>희망근무조건</Heading>
          <Divider borderWidth="1px" my={6} borderColor={"gray"} />
          <Box>
            <Flex justifyContent={"space-between"}>
              <Box w={"160px"}>근무지</Box>
              <Select w={"340px"}>
                <option>전국</option>
                <option>서울특별시</option>
                <option>경기도</option>
              </Select>
              <Select w={"340px"}>
                <option disabled>시/군/구</option>
                <option>전체</option>
                <option>강남구</option>
              </Select>
              <Button
                w={"80px"}
                px={30}
                mr={5}
                bgColor={"black"}
                color={"white"}
                fontSize={"sm"}
                fontWeight={"sm"}
              >
                추가
              </Button>
            </Flex>
          </Box>
          <Divider my={5} />
          <Box h={"50px"} lineHeight={"50px"}>
            <Flex gap={5}>
              <Text w={"160px"} mr={"10px"}>
                업직종
              </Text>
              <Badge
                mt={2}
                w={"120px"}
                h={"30px"}
                textAlign={"center"}
                lineHeight={"30px"}
                borderRadius={"5px"}
                px={3}
              >
                프로그래머 <FontAwesomeIcon icon={faXmark} cursor={"pointer"} />
              </Badge>
              <Badge
                mt={2}
                w={"120px"}
                h={"30px"}
                textAlign={"center"}
                lineHeight={"30px"}
                borderRadius={"5px"}
                px={3}
              >
                웹 콘텐츠기획{" "}
                <FontAwesomeIcon icon={faXmark} cursor={"pointer"} />
              </Badge>
              <Button
                mt={1}
                bgColor={"black"}
                color={"white"}
                fontSize={"sm"}
                fontWeight={"sm"}
              >
                업직종 선택
              </Button>
            </Flex>
          </Box>
          <Divider my={6} />
          <Box>
            <Flex>
              <Text w={"160px"} mr={"30px"} h={"50px"}>
                근무형태
              </Text>
              <Flex gap={5} fontSize={"sm"}>
                <Checkbox>알바</Checkbox>
                <Checkbox>정규직</Checkbox>
                <Checkbox>비정규직</Checkbox>
              </Flex>
            </Flex>
          </Box>
          <Divider my={6} />
          <Box>
            <Flex>
              <Text w={"160px"} mr={"30px"} h={"50px"}>
                근무일시
              </Text>
              <Flex gap={5} fontSize={"sm"}>
                <Select w={"300px"}>
                  <option disabled>무관</option>
                  <option>월-토</option>
                  <option>월-금</option>
                  <option>주말</option>
                </Select>
                <Select w={"300px"}>
                  <option disabled>무관</option>
                  <option>오후 파트타임(12:00 ~ 18:00)</option>
                  <option>저녁 파트타임(18:00 ~ 24:00)</option>
                  <option>새벽 파트타임(00:00 ~ 06:00)</option>
                </Select>
                <Button
                  w={"80px"}
                  px={30}
                  mr={5}
                  bgColor={"black"}
                  color={"white"}
                  fontSize={"sm"}
                  fontWeight={"sm"}
                >
                  추가
                </Button>
              </Flex>
            </Flex>
          </Box>
          <Divider my={6} />
          <Box>
            <Flex>
              <Text w={"160px"} mr={"30px"} h={"50px"}>
                급여
              </Text>
              <Tabs variant="enclosed-colored">
                <TabList>
                  <Tab w={"130px"} h={"50px"}>
                    시급
                  </Tab>
                  <Tab w={"130px"} h={"50px"}>
                    일급
                  </Tab>
                  <Tab w={"130px"} h={"50px"}>
                    일급
                  </Tab>
                </TabList>
                <TabPanels ml={"-15px"} mt={1}>
                  <TabPanel>
                    <Input
                      w={"300px"}
                      placeholder={"희망 급여를 입력해주세요."}
                    />{" "}
                    원
                  </TabPanel>
                  <TabPanel>
                    <Input
                      w={"300px"}
                      placeholder={"희망 급여를 입력해주세요."}
                    />{" "}
                    원
                  </TabPanel>
                  <TabPanel>
                    <Input
                      w={"300px"}
                      placeholder={"희망 급여를 입력해주세요."}
                    />{" "}
                    원
                  </TabPanel>
                </TabPanels>
              </Tabs>
              <Checkbox ml={7}>추후협의</Checkbox>
              <Flex gap={5} fontSize={"sm"}></Flex>
            </Flex>
          </Box>
        </Box>
        <Box my={20}>
          <Heading>자기소개·업무스킬</Heading>
          <Divider borderWidth="1px" my={6} borderColor={"gray"} />
          <Flex>
            <Text w={"160px"} mr={"35px"} h={"50px"}>
              나의 업무 스킬
            </Text>
            <Input
              border={"1px solid lightgray"}
              borderRadius={"8px"}
              w={"900px"}
              h={"50px"}
              placeholder={"스킬을 검색하여 등록해보세요."}
            />
          </Flex>
          <Box width="1030px">
            <Flex my="20px">
              <Text w={"11%"} mr="90px" h="50px"></Text>
              <Flex w={"1000px"} my={2} gap="10px" wrap="wrap">
                <Button>웹 개발</Button>
                <Button>앱 개발</Button>
                <Button>백엔드 개발</Button>
                <Button>백엔드 개발</Button>
                <Button>백엔드 개발</Button>
                <Button>백엔드 개발</Button>
                <Button>백엔드 개발</Button>
                <Button>백엔드 개발</Button>
                <Button>백엔드 개발</Button>
                <Button>프론트엔드 개발</Button>
                <Button>프론트엔드 개발</Button>
                <Button>프론트엔드 개발</Button>
                <Button>프론트엔드 개발</Button>
                <Button>프론트엔드 개발</Button>
                <Button>프론트엔드 개발</Button>
                <Button>프론트엔드 개발</Button>
              </Flex>
            </Flex>
          </Box>
          <Divider my={6} />
          <Flex>
            <Text w={"160px"} mr={"30px"}>
              내가 선택한 스킬
            </Text>
            <Box
              w={"880px"}
              h={"160px"}
              border={"1px solid lightgray"}
              borderRadius={"5px"}
              p={3}
            >
              <Grid
                templateColumns="repeat(auto-fill, minmax(150px, 1fr))"
                cursor={"pointer"}
                gap={4}
              >
                <GridItem bg="red.50" p={2} borderRadius="md" boxShadow="md">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize="sm">웹 개발</Text>
                    <Button size="xs" variant="ghost" colorScheme="red">
                      ✕
                    </Button>
                  </Flex>
                </GridItem>
                <GridItem bg="red.50" p={2} borderRadius="md" boxShadow="md">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize="sm">백엔드 개발 개발</Text>
                    <Button size="xs" variant="ghost" colorScheme="red">
                      ✕
                    </Button>
                  </Flex>
                </GridItem>
                <GridItem bg="red.50" p={2} borderRadius="md" boxShadow="md">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize="sm">앱 개발</Text>
                    <Button size="xs" variant="ghost" colorScheme="red">
                      ✕
                    </Button>
                  </Flex>
                </GridItem>
              </Grid>
            </Box>
          </Flex>
        </Box>
        <Divider my={6} />
        <Box>
          <Flex>
            <Text w={"160px"}>자기소개</Text>
            <Textarea
              w={"960px"}
              h={"260px"}
              my={"10px"}
              placeholder={"자개소개를 입력해주세요."}
            />
          </Flex>
        </Box>
        <Divider my={6} />
        <Heading>자격증</Heading>
        <Divider borderWidth="1px" my={6} borderColor={"gray"} />
        <Box>
          <Flex my={"40px"} h={"50px"} lineHeight={"50px"}>
            <Text w={"160px"}>자격증</Text>
            <Input w={"600px"} placeholder={"자격증 이름을 입력해주세요."} />
          </Flex>
          <Flex my={"40px"} h={"50px"} lineHeight={"50px"}>
            <Text w={"160px"}>발행처</Text>
            <Input w={"250px"} placeholder={"발행처를 입력해주세요."} />
            <Select w={"150px"} mx={"5px"} mt={"-5px"}>
              <option disabled>년도</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
              <option>2020</option>
            </Select>
            년 취득
            <Button
              w={"80px"}
              px={30}
              ml={"50px"}
              bgColor={"black"}
              color={"white"}
              fontSize={"sm"}
              fontWeight={"sm"}
            >
              추가
            </Button>
          </Flex>
        </Box>
        <Divider my={"50px"} />
        <Center>
          <Button
            mt={"50px"}
            px={10}
            bgColor={"coral"}
            color={"white"}
            fontWeight={"sm"}
          >
            이력서 저장
          </Button>
        </Center>
      </Box>
    </Box>
  );
}
