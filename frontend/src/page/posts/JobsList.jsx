import {
  Box,
  Button,
  Card,
  CardBody,
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
  addressList,
  workPeriodList,
  workTimeList,
  workWeekList,
} from "./jobsConst.jsx";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faArrowDownWideShort,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

export function JobsList() {
  const account = useContext(LoginContext);
  const [selectedWorkPeriod, setSelectedWorkPeriod] = useState("");
  const [selectedWorkWeek, setSelectedWorkWeek] = useState("");
  const [selectedWorkTime, setSelectedWorkTime] = useState("");
  const [filterType, setFilterType] = useState("최신등록");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [jobsList, setJobsList] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const pageNums = [];
  const [pageInfo, setPageInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 필터링 함수
  const filterJobsList = (
    jobs,
    filterType,
    selectedRegion,
    selectedCategory,
    selectedWorkPeriod,
    selectedWorkWeek,
    selectedWorkTime,
  ) => {
    let filteredJobs = [...jobs];
    if (filterType === "마감임박") {
      filteredJobs.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (filterType === "최신등록") {
      filteredJobs.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    } else if (filterType === "지역" && selectedRegion) {
      filteredJobs = filteredJobs.filter((job) =>
        job.address.startsWith(selectedRegion),
      );
    } else if (filterType === "직종" && selectedCategory) {
      filteredJobs = filteredJobs.filter(
        (job) => job.categoryName === selectedCategory,
      );
    } else if (filterType === "근무기간" && selectedWorkPeriod) {
      filteredJobs = filteredJobs.filter(
        (job) => job.workPeriod === selectedWorkPeriod,
      );
    } else if (filterType === "근무요일" && selectedWorkWeek) {
      filteredJobs = filteredJobs.filter(
        (job) => job.workWeek === selectedWorkWeek,
      );
    } else if (filterType === "근무시간" && selectedWorkTime) {
      filteredJobs = filteredJobs.filter(
        (job) => job.workTime === selectedWorkTime,
      );
    }
    return filteredJobs;
  };

  // Read
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");

    const params = {
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
      const sortedJobs = filterJobsList(
        res.data.jobsList,
        filterType,
        selectedRegion,
        selectedCategory,
        selectedWorkPeriod,
        selectedWorkWeek,
        selectedWorkTime,
      );

      setJobsList(sortedJobs);
      // categoryName 추출해서 배열에 담기 (중복값 제거)
      const categoryNames = Array.from(
        new Set(res.data.jobsList.map((job) => job.categoryName)),
      );
      setCategoryNames(categoryNames);
      setPageInfo(res.data.pageInfo);
    });
  }, [
    currentPage,
    searchParams,
    account,
    filterType,
    selectedRegion,
    selectedCategory,
    selectedWorkPeriod,
    selectedWorkWeek,
    selectedWorkTime,
  ]);

  // 마감임박 필터링
  useEffect(() => {
    let sortJobs = [...jobsList];
    if (filterType === "마감임박") {
      sortJobs.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
  }, []);

  for (let i = pageInfo.leftPage; i <= pageInfo.rightPage; i++) {
    pageNums.push(i);
  }

  function handlePageButtonClick(currentPage) {
    setCurrentPage(currentPage);
  }

  function handleSearchClick() {
    navigate(`/jobs/list?type=${searchType}&keyword=${searchKeyword}`);
  }

  // 시,구 기준으로 이후 주소 제거.
  const trimAfterSiGu = (text) => {
    const match = text.match(/(\S+시|\S+구)\s/);
    if (match) {
      let slice = text.slice(0, match.index + match[0].length - 1);
      return slice;
    }
    return text;
  };

  function handleFilterChange(e) {
    setFilterType(e.target.value);
    setSelectedRegion("");
    setSelectedCategory("");
    setSelectedWorkPeriod("");
    setSelectedWorkWeek("");
    setSelectedWorkTime("");
  }

  function handleRegionChange(e) {
    setSelectedRegion(e.target.value);
  }

  function handleCategoryChange(e) {
    setSelectedCategory(e.target.value);
  }

  function handleWorkPeriodChange(e) {
    setSelectedWorkPeriod(e.target.value);
  }

  function handleWorkWeekChange(e) {
    setSelectedWorkWeek(e.target.value);
  }

  function handleWorkTimeChange(e) {
    setSelectedWorkTime(e.target.value);
  }

  return (
    <Box border={"1px solid red"}>
      <Flex justifyContent={"space-between"}>
        <Box display={"flex"}>
          <FontAwesomeIcon icon={faArrowDownWideShort} fontSize={"25px"} />
          <Select w={150} value={filterType} onChange={handleFilterChange}>
            <option value="최신등록">최신등록</option>
            <option value="마감임박">마감임박</option>
            <option value="지역">지역</option>
            <option value="직종">직종</option>
            <option value="근무기간">근무기간</option>
            <option value="근무요일">근무요일</option>
            <option value="근무시간">근무시간</option>
          </Select>
          {filterType === "지역" && (
            <Select
              w={150}
              value={selectedRegion}
              onChange={handleRegionChange}
            >
              <option value="" disabled>
                선택
              </option>
              {addressList.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </Select>
          )}
          {filterType === "직종" && (
            <Select
              w={150}
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="" disabled>
                선택
              </option>
              {categoryNames.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          )}
          {filterType === "근무기간" && (
            <Select
              w={150}
              value={selectedWorkPeriod}
              onChange={handleWorkPeriodChange}
            >
              <option value="" disabled>
                선택
              </option>
              {workPeriodList.map((period, index) => (
                <option key={index} value={period}>
                  {period}
                </option>
              ))}
            </Select>
          )}
          {filterType === "근무요일" && (
            <Select
              w={150}
              value={selectedWorkWeek}
              onChange={handleWorkWeekChange}
            >
              <option value="" disabled>
                선택
              </option>
              {workWeekList.map((week, index) => (
                <option key={index} value={week}>
                  {week}
                </option>
              ))}
            </Select>
          )}
          {filterType === "근무시간" && (
            <Select
              w={150}
              value={selectedWorkTime}
              onChange={handleWorkTimeChange}
            >
              <option value="" disabled>
                선택
              </option>
              {workTimeList.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          )}
        </Box>

        {/* 검색 하는 곳*/}
        <Box w={"500px"} display={"flex"}>
          <Select
            w={"150px"}
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="text">글</option>
            <option value="nickName">작성자</option>
          </Select>
          <Input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="검색어"
          />
          <Button onClick={handleSearchClick}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </Button>
        </Box>
      </Flex>
      <Center>
        {/* 그리드로 공고 카드 보여주기 */}
        <Box>
          <Grid templateColumns="repeat(1,1fr)" borderTop={"1px solid gray"}>
            {jobsList.map((job) => (
              <GridItem key={job.id}>
                <JobCard job={job} />
              </GridItem>
            ))}
          </Grid>

          {/* 페이징 */}
          {Paging()}

          {/* 공고 생성 */}
          <Button
            onClick={() => navigate("/jobs/register")}
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
    const { addRecentJob } = useContext(LoginContext);
    // 주소가 시,구 로 끝나는 경우 뒤의 주소 날림 (ex. 서울 강남구)
    const [trimmedAddress, setTrimmedAddress] = useState("");
    useEffect(() => {
      setTrimmedAddress(trimAfterSiGu(job.address));
    }, []);

    return (
      <Card
        onClick={() => {
          navigate(`/jobs/${job.id}`);
          addRecentJob(`/jobs/${job.id}`); // 최근 본 공고 URL 추가
        }}
        _hover={{ bgColor: "gray.100" }}
        w={"1250px"}
        h={"135px"}
        p={5}
        cursor={"pointer"}
        borderRadius="0"
        borderY={"1px solid lightgray"}
        overflow="hidden"
      >
        <Flex alignItems={"center"}>
          <Box w={"15%"}>
            <Image
              w={"150px"}
              h={"60px"}
              src={
                "https://img11.albamon.kr/trans/150x60/2020-08-21/e31du74k1jai3zj.gif"
              }
              alt={job.title}
              border={"1px solid lightgray"}
              borderRadius={"5px"}
              objectFit="cover"
            />
          </Box>
          <Box w={"60%"} ml={"40px"}>
            <CardBody>
              <Text fontSize="xl" fontWeight="bold">
                제목: {job.title}
              </Text>
              <Text overflow="hidden">내용: {job.content}</Text>
            </CardBody>
          </Box>
          <Box w={"20%"}>
            <Text color="gray.600">{trimmedAddress}</Text>
            <Text fontSize="sm">분야 : {job.categoryName}</Text>
            <Text fontWeight="bold">시급 {job.salary.toLocaleString()} 원</Text>
          </Box>
          <Box w={"10%"}>
            <Button borderWidth={"2px"} variant="outline" colorScheme="red">
              지원하기
            </Button>
          </Box>
        </Flex>
      </Card>
    );
  }

  /* 페이징 */
  function Paging() {
    return (
      <Center gap={3} mt={2}>
        <Flex gap={2}>
          {pageInfo.prevPage && (
            <>
              <Button onClick={() => handlePageButtonClick(1)}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </Button>
              <Button onClick={() => handlePageButtonClick(pageInfo.prevPage)}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
            </>
          )}

          {pageNums.map((pageNum) => (
            <Button
              onClick={() => handlePageButtonClick(pageNum)}
              key={pageNum}
              colorScheme={pageNum === pageInfo.currentPage ? "blue" : "gray"}
            >
              {pageNum}
            </Button>
          ))}
          {pageInfo.nextPage && (
            <>
              <Button onClick={() => handlePageButtonClick(pageInfo.nextPage)}>
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
              <Button onClick={() => handlePageButtonClick(pageInfo.lastPage)}>
                <FontAwesomeIcon icon={faAnglesRight} />
              </Button>
            </>
          )}
        </Flex>
      </Center>
    );
  }
}
