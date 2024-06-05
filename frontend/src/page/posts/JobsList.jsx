import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
  const [jobsList, setJobsList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pageNums = [];
  for (let i = pageInfo.leftPageNum; i <= pageInfo.rightPageNum; i++) {
    pageNums.push(i);
  }

  function handlePageButtonClick(currentPage) {
    setCurrentPage(currentPage);
  }

  function handleSearchClick() {
    navigate(`/boss/jobs/list?type=${searchType}&keyword=${searchKeyword}`);
  }

  // T 문자를 제거하고 날짜만 반환하는 함수
  const formatInsertedDate = (inserted) => {
    if (!inserted) return "";
    return inserted.replace("T", " ");
  };

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");

    const params = {
      bossId: account.id,
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

    axios.get("/api/boss/jobs/list", { params }).then((res) => {
      setJobsList(res.data.jobsList);
      setPageInfo(res.data.pageInfo);
    });
  }, [currentPage, searchParams]);

  return (
    <Center>
      <Box>
        <Box>
          <Heading>알바 공고 목록</Heading>
        </Box>
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>타이틀</Th>
                <Th>가게명</Th>
                <Th>작성자</Th>
                <Th>작성시간</Th>
              </Tr>
            </Thead>
            <Tbody>
              {jobsList.map((jobs) => (
                <Tr
                  key={jobs.id}
                  cursor={"pointer"}
                  _hover={{ bgColor: "gray.200" }}
                  onClick={() => navigate(`/boss/jobs/${jobs.id}`)}
                >
                  <Td>{jobs.id}</Td>
                  <Td>{jobs.title}</Td>
                  <Td>{jobs.storeName}</Td>
                  <Td>{jobs.bossName}</Td>
                  <Td>{formatInsertedDate(jobs.inserted)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Center gap={3} mt={2}>
          <Flex>
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
        <Center>
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
        <Button
          onClick={() => navigate("/boss/jobs/create")}
          colorScheme={"green"}
          w={120}
          my={3}
        >
          이전
        </Button>
      </Box>
    </Center>
  );
}
