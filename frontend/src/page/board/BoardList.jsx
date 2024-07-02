import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faCircleInfo,
  faComments,
  faEye,
  faFilter,
  faHeart as fullHeart,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../provider/LoginProvider.jsx";
import { Helmet } from "react-helmet";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState({});
  const [searchType, setSearchType] = useState("all");
  const [inputKeyword, setInputKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterType, setFilterType] = useState("");
  const [selectedFilterDetail, setSelectedFilterDetail] = useState([]);
  const toast = useToast();
  const account = useContext(LoginContext);

  useEffect(() => {
    const typeParam = searchParams.get("type") || "all";
    const keywordParam = searchParams.get("keyword") || "";
    const pageParam = searchParams.get("page") || 1;

    const params = {
      page: pageParam,
      type: typeParam,
      keyword: keywordParam,
      filterType,
      filterDetail: selectedFilterDetail,
    };

    axios
      .get(`/api/board/list`, { params })
      .then((res) => {
        setBoardList(res.data.boardList);
        setPageInfo(res.data.pageInfo);
      })
      .catch((error) => {
        console.error("Error fetching board list:", error);
      });

    setSearchType(typeParam);
  }, [account.id, searchParams, filterType, selectedFilterDetail]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handleSearchClick() {
    const typeParam = searchType;
    const keywordParam = inputKeyword;

    const params = new URLSearchParams({
      type: typeParam,
      keyword: keywordParam,
      page: 1,
    });

    navigate(`./?${params.toString()}`);
  }

  function handlePageButtonClick(pageNumber) {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber);
    setSearchParams(params);
  }

  function handleFilterChange(e) {
    const value = e.target.value;
    setFilterType(value);
    setSelectedFilterDetail([]);

    const params = new URLSearchParams(searchParams);
    params.set("filterType", value);
    params.set("filterDetail", []);
    navigate(`./?${params.toString()}`);
  }

  function handleWriteButtonClick() {
    if (!account || !account.id) {
      toast({
        status: "error",
        description: "로그인하세요",
        position: "top",
      });
    } else {
      navigate("/board/write");
    }
  }

  return (
    <Box p={4} w={"1050px"}>
      <Helmet>
        <title>질문 게시판 - 알바커넥터</title>
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
          알바커넥터의 질문 게시판
        </Text>
        <Flex fontSize={"15px"} gap={2} color={"#343942"}>
          <Box>
            <FontAwesomeIcon icon={faCircleInfo} />
          </Box>
          <Text>궁금하신 내용을 물어보실 수 있어요!</Text>
        </Flex>
      </Box>

      {/* Search and Filter Section */}
      <Flex
        h={"80px"}
        p={3}
        alignItems={"center"}
        borderY={"2px solid #E0E0E0"}
      >
        <Box mt={"5px"}>
          <FontAwesomeIcon icon={faFilter} />
        </Box>
        <Select
          w="115px"
          value={filterType}
          onChange={handleFilterChange}
          mx={2}
        >
          <option value="작성일순">작성일순</option>
          <option value="조회수순">조회수순</option>
          <option value="좋아요순">좋아요순</option>
          <option value="댓글순">댓글순</option>
        </Select>
        <Spacer />
        <Flex>
          <Box display={"flex"}>
            <InputGroup>
              <Input
                w="380px"
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
                placeholder="제목+작성자 검색"
              />
              <InputRightElement width="2.5rem">
                <Button
                  width="2.5rem"
                  colorScheme={"gray"}
                  variant={"outline"}
                  onClick={handleSearchClick}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </Flex>
      </Flex>

      {/* Board List Table */}
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        border={"none"}
      >
        {boardList.length === 0 ? (
          <Center p={4}>조회 결과가 없습니다.</Center>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr borderBottom={"2px solid lightgray"}>
                <Th w={"50px"}>#</Th>
                <Th w={"350px"}>제목</Th>
                <Th w={"100px"}>작성자</Th>
                <Th w={"50px"}>
                  <FontAwesomeIcon icon={faEye} />
                </Th>
                <Th w={"100px"}>작성일시</Th>
              </Tr>
            </Thead>
            <Tbody>
              {boardList.map((board, index) => (
                <Tr
                  key={board.id}
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() => navigate(`/board/${board.id}`)}
                >
                  <Td>{index + 1}</Td>
                  <Td>
                    <Flex alignItems="center" gap={"5px"}>
                      <Text mr={2}>{board.title}</Text>
                      {board.numberOfComments > 0 && (
                        <Badge bgColor={"transparent"} mr={1}>
                          <Flex alignItems="center">
                            <FontAwesomeIcon icon={faComments} />
                            <Box ml={1}>{board.numberOfComments}</Box>
                          </Flex>
                        </Badge>
                      )}
                      {board.numberOfLike > 0 && (
                        <Badge mr={1} bgColor={"transparent"}>
                          <Flex alignItems="center">
                            <FontAwesomeIcon icon={fullHeart} />
                            <Box ml={1}>{board.numberOfLike}</Box>
                          </Flex>
                        </Badge>
                      )}
                    </Flex>
                  </Td>
                  <Td
                    color={board.name === "탈퇴한 유저" ? "gray.400" : "black"}
                  >
                    {board.name}
                  </Td>
                  <Td>{board.numberOfView}</Td>
                  <Td>{board.inserted}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      {account.isLoggedIn() && (
        <Box mt={"10px"} align={"right"}>
          <Button colorScheme={"orange"} onClick={handleWriteButtonClick}>
            글쓰기
          </Button>
        </Box>
      )}

      {/* Pagination Section */}
      <Center mt={8}>
        <Flex gap={2}>
          {pageInfo.prevPageNumber && (
            <>
              <Button
                leftIcon={<FontAwesomeIcon icon={faAnglesLeft} />}
                onClick={() => handlePageButtonClick(1)}
              />
              <Button
                leftIcon={<FontAwesomeIcon icon={faAngleLeft} />}
                onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
              />
            </>
          )}
          {pageNumbers.map((pageNumber) => (
            <Button
              key={pageNumber}
              onClick={() => handlePageButtonClick(pageNumber)}
              colorScheme={
                pageNumber === pageInfo.currentPageNumber ? "blue" : "gray"
              }
            >
              {pageNumber}
            </Button>
          ))}
          {pageInfo.nextPageNumber && (
            <>
              <Button
                rightIcon={<FontAwesomeIcon icon={faAngleRight} />}
                onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
              />
              <Button
                rightIcon={<FontAwesomeIcon icon={faAnglesRight} />}
                onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
              />
            </>
          )}
        </Flex>
      </Center>
    </Box>
  );
}
