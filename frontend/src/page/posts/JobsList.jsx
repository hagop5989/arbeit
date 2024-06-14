import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

export function JobsList() {
  const account = useContext(LoginContext);
  const [filterType, setFilterType] = useState("최신등록");
  const [jobsList, setJobsList] = useState([]);
  const pageNums = [];
  const [pageInfo, setPageInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");

    const params = {
      memberId: account.id,
      page: currentPage,
      type: typeParam,
      keyword: keywordParam,
    };

    if (typeParam) {
      setSearchType(typeParam);
    }
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }

    axios.get("/api/jobs/list", { params }).then((res) => {
      setJobsList(res.data.jobsList);
      setPageInfo(res.data.pageInfo);
    });
  }, [currentPage, searchParams, account]);

  useEffect(() => {
    let sortJobs = [...jobsList];
    if (filterType === "마감임박") {
      sortJobs.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
  }, []);

  for (let i = pageInfo.leftPageNum; i <= pageInfo.rightPageNum; i++) {
    pageNums.push(i);
  }

  function handlePageButtonClick(currentPage) {
    setCurrentPage(currentPage);
  }

  function handleSearchClick() {
    navigate(`/jobs/list?type=${searchType}&keyword=${searchKeyword}`);
  }

  return (
    <Box>
      <Center>
        필터링
        <Select w={150}>
          <option>최신등록</option>
          <option>마감임박</option>
          <option>지역</option>
          <option>직종</option>
          <option>근무기간</option>
          <option>근무요일</option>
          <option>근무시간</option>
        </Select>
        <Select w={150}>
          <option>시급</option>
          <option>시급</option>
        </Select>
      </Center>
      <Center>
        {/* 그리드로 공고 카드 보여주기 */}
        <Box>
          <Grid templateColumns="repeat(4,1fr)" gap={6}>
            {jobsList.map((job) => (
              <GridItem key={job.id}>
                <JobCard job={job} />
              </GridItem>
            ))}
          </Grid>

          {/* 페이징 */}
          {Paging()}

          <Center>
            {/* 검색 하는 곳*/}
            <Flex my={3} gap={1}>
              <Box>
                <Select
                  w={100}
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="all">전체</option>
                  <option value="text">글</option>
                  <option value="nickName">작성자</option>
                </Select>
              </Box>
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어"
              />
              <Box>
                <Button onClick={handleSearchClick}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Button>
              </Box>
            </Flex>
          </Center>

          {/* 공고 생성 */}
          <Button
            onClick={() => navigate("/jobs/create")}
            colorScheme={"green"}
            w={120}
            my={3}
          >
            공고생성
          </Button>
        </Box>
      </Center>
    </Box>
  );

  /* 공고 카드 형식 */
  function JobCard({ job }) {
    return (
      <Card
        onClick={() => navigate(`/jobs/${job.id}`)}
        w={"300px"}
        h={"230px"}
        cursor={"pointer"}
        borderWidth="1px"
        borderRadius="lg"
        border={"1px solid lightgray"}
        borderTop={"2px solid red"}
        overflow="hidden"
        p="5"
        m="2"
      >
        <Center>
          <Image
            w={"150px"}
            h={"60px"}
            src={
              "https://img11.albamon.kr/trans/150x60/2020-08-21/e31du74k1jai3zj.gif"
            }
            alt={job.title}
            objectFit="cover"
          />
        </Center>
        <CardBody fontSize="sm">
          <Text w={"220px"} h={"22px"} overflow="hidden" mt="2" fontSize="sm">
            {job.title}
          </Text>
          <Center>
            <Text
              w={"250px"}
              h={"50px"}
              overflow="hidden"
              fontWeight="bold"
              mt="2"
              fontSize="medium"
            >
              {job.content}
            </Text>
          </Center>
          <Flex mt="2">
            <Text color="gray.600" fontSize="sm">
              서울 마포구
            </Text>
            <Text color="teal.500" fontWeight="bold" ml={2}>
              {" "}
              시급
            </Text>
            <Text fontWeight="bold" fontSize="sm" ml={1} color="gray.600">
              {job.salary.toLocaleString()} 원
            </Text>
          </Flex>
        </CardBody>
        <CardFooter>
          <Button mt="2" colorScheme="teal" width="full">
            신청하기
          </Button>
        </CardFooter>
      </Card>
    );
  }

  /* 페이징 */
  function Paging() {
    return (
      <Center gap={3} mt={2}>
        <Flex gap={2}>
          {pageInfo.prevPageNum && (
            <>
              <Button onClick={() => handlePageButtonClick(1)}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </Button>
              <Button
                onClick={() => handlePageButtonClick(pageInfo.prevPageNum)}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
            </>
          )}

          {pageNums.map((pageNum) => (
            <Button
              onClick={() => handlePageButtonClick(pageNum)}
              key={pageNum}
              colorScheme={
                pageNum === pageInfo.currentPageNum ? "blue" : "gray"
              }
            >
              {pageNum}
            </Button>
          ))}
          {pageInfo.nextPageNum && (
            <>
              <Button
                onClick={() => handlePageButtonClick(pageInfo.nextPageNum)}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
              <Button
                onClick={() => handlePageButtonClick(pageInfo.lastPageNum)}
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </Button>
            </>
          )}
        </Flex>
      </Center>
    );
  }
}
