import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../provider/LoginProvider.jsx";
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
  faArrowUpRightFromSquare,
  faCircleInfo,
  faFilter,
  faLocationDot,
  faMagnifyingGlass,
  faStar as fullStar,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { differenceInHours, format, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { Helmet } from "react-helmet";

export function JobsList() {
  const account = useContext(LoginContext);
  const [selectedFilterDetail, setSelectedFilterDetail] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");
  const [filterType, setFilterType] = useState("최신등록");
  const [jobsList, setJobsList] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [storeImages, setStoreImages] = useState({});
  const [reload, setReload] = useState(false);

  const pageNums = [];
  const [pageInfo, setPageInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [expandedJobId, setExpandedJobId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get("/api/jobs/categories").then((res) => {
      setCategoryNames(res.data);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type") || "all";
    const keywordParam = params.get("keyword") || "";
    const filterTypeParam = params.get("filterType") || "최신등록";
    const filterDetailParam = params.get("filterDetail") || [];

    const queryParams = {
      page: currentPage,
      type: typeParam,
      keyword: keywordParam,
      filterType: filterTypeParam,
      filterDetail: filterDetailParam,
    };

    setSearchType(typeParam);
    setSearchKeyword(keywordParam);
    setFilterType(filterTypeParam);
    setSelectedFilterDetail(filterDetailParam);

    axios.get("/api/jobs/list", { params: queryParams }).then((res) => {
      setStoreImages(res.data.storeImgMap);
      setJobsList(res.data.jobsList);
      setPageInfo(res.data.pageInfo);
    });
  }, [currentPage, account, reload]);

  // favorite 리스트 받기
  const [favoriteList, setFavoriteList] = useState({});
  useEffect(() => {
    axios
      .get("/api/scrap/list")
      .then((res) => {
        // 배열을 객체로 변환
        const favorites = res.data.reduce((acc, item) => {
          acc[item.jobsId] = item.favorite;
          return acc;
        }, {});
        setFavoriteList(favorites);

        // favorite이 true인 항목의 개수를 계산
        const scrapCount = Object.values(favorites).filter(
          (value) => value,
        ).length;
        account.updateScrapNum(scrapCount);
      })
      .catch()
      .finally();
  }, []);

  // 페이징, 검색 관련
  for (let i = pageInfo.leftPage; i <= pageInfo.rightPage; i++) {
    pageNums.push(i);
  }

  function handlePageButtonClick(currentPage) {
    setCurrentPage(currentPage);
  }

  // 검색을 처리하는 함수
  function handleSearchClick() {
    setReload(!reload);
    setSearchKeyword(inputKeyword);

    const params = new URLSearchParams({
      type: searchType,
      keyword: inputKeyword, // 현재 입력된 검색어로 검색
      page: 1,
      filterType, // 현재 필터 타입 유지
      filterDetail: selectedFilterDetail, // 현재 선택된 상세 필터 유지
    });

    navigate(`/jobs/list?${params.toString()}`);
  }

  // 필터 타입이 변경될 때마다 백엔드로 새로운 데이터를 요청
  function handleFilterChange(e) {
    setReload(!reload);
    setFilterType(e.target.value);
    setSelectedFilterDetail("");
    setInputKeyword("");

    const params = new URLSearchParams({
      type: searchType,
      keyword: searchKeyword,
      page: 1,
      filterType: e.target.value,
      filterDetail: [],
    });

    navigate(`/jobs/list?${params.toString()}`);
  }

  // 상세 필터가 변경될 때마다 백엔드로 새로운 데이터를 요청
  function handleDetailFilterChange(e) {
    setReload(!reload);
    setSelectedFilterDetail(e.target.value);
    setInputKeyword("");

    const params = new URLSearchParams({
      type: searchType,
      keyword: "",
      page: 1,
      filterType,
      filterDetail: e.target.value,
    });

    navigate(`/jobs/list?${params.toString()}`);
  }

  // 시,구,군 기준으로 이후 주소 제거.
  const trimAfterSiGu = (text) => {
    const match = text.match(/(\S+시|\S+구|\S+군)\s/);
    if (match) {
      let slice = text.slice(0, match.index + match[0].length - 1);
      return slice;
    }
    return text;
  };

  return (
    <Box w={"1050px"} pb={10}>
      <Helmet>
        <title>알바 채용공고 - 알바커넥터</title>
      </Helmet>
      <Box
        w={"100%"}
        h={"120px"}
        bg={"orange"}
        pt={"30px"}
        pl={"40px"}
        fontFamily={"SBAggroB"}
        backgroundImage="url('/public/title.jpg')"
        backgroundSize="cover"
      >
        <Text fontSize={"30px"} fontWeight={"800"}>
          알바커넥터의 알바 채용정보
        </Text>
        <Flex fontSize={"15px"} gap={2} color={"#343942"}>
          <Box>
            <FontAwesomeIcon icon={faCircleInfo} />
          </Box>
          <Text>이력서를 등록하면 지원을 할 수 있어요!</Text>
        </Flex>
      </Box>
      <Flex
        justifyContent={"space-between"}
        h={"80px"}
        border={"1px solid #E0E0E0"}
        p={"20px"}
      >
        <Flex gap={1}>
          <Box mt={"5px"}>
            <FontAwesomeIcon icon={faFilter} />
          </Box>
          {/* 첫번째 필터 요소 */}
          <Select w={150} value={filterType} onChange={handleFilterChange}>
            <option value="최신등록">최신등록</option>
            <option value="마감임박">마감임박</option>
            <option value="지역">지역</option>
            <option value="직종">직종</option>
            <option value="근무기간">근무기간</option>
            <option value="근무요일">근무요일</option>
            <option value="근무시간">근무시간</option>
          </Select>

          {/* 첫번째 필터 요소에 따른 두번째 필터 요소 리스트 화 */}
          {filterType === "지역" && (
            <Select
              w={150}
              value={selectedFilterDetail}
              onChange={handleDetailFilterChange}
              placeholder={"선택"}
            >
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
              value={selectedFilterDetail}
              onChange={handleDetailFilterChange}
              placeholder={"선택"}
            >
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
              value={selectedFilterDetail}
              onChange={handleDetailFilterChange}
              placeholder={"선택"}
            >
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
              value={selectedFilterDetail}
              onChange={handleDetailFilterChange}
              placeholder={"선택"}
            >
              {workWeekList.map((week, index) => (
                <option key={index} value={week}>
                  {week}
                </option>
              ))}
            </Select>
          )}
          {filterType === "근무시간" && (
            <Select
              w={250}
              value={selectedFilterDetail}
              onChange={handleDetailFilterChange}
              placeholder={"선택"}
            >
              {workTimeList.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          )}
        </Flex>

        {/* 검색 하는 곳*/}
        <Box w={"500px"} display={"flex"}>
          <Select
            w={"150px"}
            mr={"5px"}
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="text">글</option>
            <option value="nickName">작성자</option>
          </Select>
          <InputGroup>
            <Input
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              placeholder="검색어"
            />
            <InputRightElement width="2.5rem">
              <Button
                onClick={handleSearchClick}
                colorScheme={"gray"}
                variant={"outline"}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Flex>
      <Center>
        {filterType && jobsList.length === 0 && (
          <Center w={"1050px"} h={"40vh"}>
            <Heading>검색하신 결과가 존재하지 않습니다.</Heading>
          </Center>
        )}
        <Flex flexDirection={"column"} h={"full"}>
          <Box flex="1">
            {/* 검색 파라미터 존재하거나 필터가 존재 하는데 jobList 가 0인 경우 */}
            {/* 그리드로 공고 카드 보여주기 */}
            <Grid templateColumns="repeat(1,1fr)">
              {jobsList.map((job) => (
                <GridItem key={job.id}>
                  <JobCard
                    job={job}
                    storeImages={storeImages}
                    favoriteList={favoriteList}
                  />
                </GridItem>
              ))}
            </Grid>

            {/* 페이징 */}
          </Box>
          {jobsList.length != null && jobsList.length > 0 && (
            <Box mt={10}>{Paging()}</Box>
          )}
        </Flex>
      </Center>
    </Box>
  );

  /* 공고 카드 형식 */
  function JobCard({ job, storeImages, favoriteList }) {
    const { addRecentJob } = useContext(LoginContext);
    const [favorite, setFavorite] = useState(favoriteList[job.id] || false);

    /* 스크랩 관련 */
    //favoriteList 로드
    useEffect(() => {
      if (favoriteList[job.id] !== undefined) {
        setFavorite(favoriteList[job.id].isFavorite); // .isFavorite을 사용하여 상태를 설정
      }
    }, [favoriteList, job.id]);

    // favoriteList 변경 시 상태 업데이트
    useEffect(() => {
      if (favoriteList[job.id] !== undefined) {
        setFavorite(favoriteList[job.id]);
      }
    }, [favoriteList, job.id]);

    const updateScrapStatus = (jobId, status) => {
      const scrapData = {
        jobsId: jobId,
        memberId: account.id,
        favorite: status,
        jobsTitle: job.title,
      };

      // 상태가 false에서 true로 바뀌면 POST 요청을 보내고, 그렇지 않으면 PUT 요청을 보냄
      const request = status
        ? axios.post("/api/scrap", scrapData)
        : axios.put("/api/scrap", scrapData);

      request
        .then((response) => {
          console.log("Scrap status updated:", response.data);

          // favoriteList를 업데이트하여 상태 반영
          setFavoriteList((prevList) => {
            const updatedList = { ...prevList, [jobId]: status };

            // favorite이 true인 항목의 개수를 계산
            const scrapCount = Object.values(updatedList).filter(
              (value) => value,
            ).length;
            account.updateScrapNum(scrapCount);

            return updatedList;
          });
        })
        .catch((error) => {
          console.error("There was an error updating the scrap status!", error);
        });
    };

    // 스크랩 하기
    const handleScraping = (e, job) => {
      if (account.id !== "") {
        e.stopPropagation();
        const newStatus = !favorite;
        setFavorite(newStatus);
        updateScrapStatus(job.id, newStatus); // job 대신 job.id와 newStatus를 전달
      } else {
        alert("로그인 후 이용가능합니다.");
      }
    };
    /* 스크랩 관련 끝*/

    // trimmedAddress를 useMemo로 캐싱
    const trimmedAddress = useMemo(
      () => trimAfterSiGu(job.address),
      [job.address],
    );

    // 특정 storeId에 대한 src 값을 가져오는 함수
    const getSrcByStoreId = (storeId) => {
      const storeImageInfo = storeImages[storeId];
      if (storeImageInfo) {
        return storeImageInfo.src;
      }
      return "/public/alba_connector_store_logo.png";
    };

    // 날짜를 MM-DD 형식과 요일로 변환하거나 남은 시간을 추출하는 함수
    const formatDateOrTimeLeft = (date) => {
      const now = new Date();
      const targetDate = new Date(date);

      if (isToday(targetDate)) {
        const hoursLeft = differenceInHours(targetDate, now);
        return `${hoursLeft}시간 후 마감`;
      } else {
        const formattedDate = format(targetDate, "MM-dd");
        const dayOfWeek = format(targetDate, "EEEE", { locale: ko }).slice(
          0,
          1,
        );
        return `${formattedDate} (${dayOfWeek})`;
      }
    };

    function handleSubInfo(jobId) {
      setExpandedJobId((prevJobId) => (prevJobId === jobId ? null : jobId));
    }

    function handleNewWindow(e, job) {
      e.stopPropagation();
      if (job.id) window.open(`/jobs/${job.id}`, "_blank");
    }

    return (
      <Card w={"1050px"} borderY={"1px solid #E5E5E5"} overflow="hidden">
        <Center h={"100%"} p={"5px"} px={"15px"}>
          <Box w={"150px"} h={"60px"}>
            <Image
              w={"100%"}
              h={"100%"}
              p={"8px"}
              src={getSrcByStoreId(job.storeId)}
              border={"1px solid lightgray"}
              borderRadius={"8px"}
              objectFit="contain"
            />
          </Box>

          <Box w={"60%"} ml={"30px"}>
            <CardBody>
              <Flex>
                <Box>
                  <Text
                    w={"500px"}
                    fontSize="md"
                    fontWeight={"600"}
                    letterSpacing={"1px"}
                    whiteSpace="nowrap" // 줄 바꿈을 막음
                    overflow="hidden" // 넘친 내용을 숨김
                    textOverflow="ellipsis" // 넘친 내용을 "..."으로 표시
                    onClick={() => {
                      navigate(`/jobs/${job.id}`);
                      addRecentJob(`/jobs/${job.id}`, job.title); // 최근 본 공고 URL 추가
                    }}
                    _hover={{ textDecoration: "underline" }}
                    cursor={"pointer"}
                  >
                    {job.title}
                  </Text>
                  <Flex
                    my={"2px"}
                    fontSize="14px"
                    fontWeight={"600"}
                    color={"gray.500"}
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    gap={4}
                  >
                    <Flex>
                      <Box mr={"2px"}>
                        <FontAwesomeIcon icon={faStore} />
                      </Box>
                      {job.storeName}
                    </Flex>
                    <Text fontSize="sm" fontWeight={"bold"}>
                      # {job.categoryName}
                    </Text>
                  </Flex>
                </Box>
                <Flex
                  fontSize={"15px"}
                  gap={"10px"}
                  alignItems="center"
                  mr={6}
                  color={"gray"}
                  opacity={"0.6"}
                >
                  <Tooltip
                    label="상세정보"
                    placement="top"
                    aria-label="A tooltip"
                  >
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      onClick={() => handleSubInfo(job.id)}
                      cursor={"pointer"}
                    />
                  </Tooltip>
                  <Tooltip
                    label="새 창에서 보기"
                    placement="top"
                    aria-label="A tooltip"
                  >
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      onClick={(e) => handleNewWindow(e, job)}
                      cursor={"pointer"}
                    />
                  </Tooltip>
                </Flex>
              </Flex>
            </CardBody>
          </Box>

          <Box w={"20%"} fontSize={"14px"}>
            <Text color="gray.600" fontWeight={"bold"}>
              <FontAwesomeIcon icon={faLocationDot} /> {trimmedAddress}
            </Text>
            <Text fontWeight="bold">시급 {job.salary.toLocaleString()} 원</Text>
          </Box>

          <Box w={"11%"}>
            <Box textIndent={"70px"}>
              <Tooltip label="스크랩" placement="top" aria-label="A tooltip">
                <FontAwesomeIcon
                  cursor={"pointer"}
                  onClick={(e) => handleScraping(e, job)}
                  color={"orange"}
                  icon={favorite ? fullStar : emptyStar}
                  fontSize={"15px"}
                />
              </Tooltip>
            </Box>
            <Text
              mt={"5px"}
              textAlign={"center"}
              fontSize={"12px"}
              color={"red.300"}
              fontWeight={"bold"}
            >
              ~{formatDateOrTimeLeft(job.deadline)} 마감
            </Text>
          </Box>
        </Center>
        {expandedJobId === job.id && (
          <Box
            bgColor={"rgba(244,244,244,0.99)"}
            borderTop={"1px solid lightgray"}
            textIndent={"10px"}
            opacity={"0.6"}
            fontSize={"15px"}
          >
            <Box
              h={"100px"}
              my={3}
              mx={"40px"}
              display={"flex"}
              flexDirection={"column"}
              lineHeight={"30px"}
            >
              <Flex justifyContent={"space-between"}>
                <Box gap={"20px"} display={"flex"}>
                  <Text w={"80px"} fontWeight={"bold"}>
                    업직종
                  </Text>
                  <Text>{job.categoryName}</Text>
                </Box>
                <Box gap={"20px"} display={"flex"} mr={"200px"}>
                  <Text w={"60px"} fontWeight={"bold"}>
                    근무지
                  </Text>
                  <Text w={"280px"}>{job.address}</Text>
                </Box>
              </Flex>
              <Flex justifyContent={"space-between"}>
                <Box gap={"20px"} display={"flex"}>
                  <Text w={"80px"} fontWeight={"bold"}>
                    기간/요일
                  </Text>
                  <Text>{job.workPeriod}</Text>
                </Box>
                <Box gap={"20px"} display={"flex"} mr={"200px"}>
                  <Text w={"60px"} fontWeight={"bold"}>
                    마감일
                  </Text>
                  <Text w={"280px"}>
                    ~ {formatDateOrTimeLeft(job.deadline)}
                  </Text>
                </Box>
              </Flex>
              <Box gap={"20px"} display={"flex"}>
                <Text w={"80px"} fontWeight={"bold"}>
                  접수방법
                </Text>
                <Text>온라인지원, 문자지원, 전화지원</Text>
              </Box>
            </Box>
          </Box>
        )}
      </Card>
    );
  }

  /* 페이징 */
  function Paging() {
    return (
      <Center gap={3}>
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
