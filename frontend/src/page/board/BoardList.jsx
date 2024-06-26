import {
  Badge,
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
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faComments,
  faHeart as fullHeart,
  faMagnifyingGlass,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-solid-svg-icons/faImages";
import { ViewIcon } from "@chakra-ui/icons";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState({});
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterType, setFilterType] = useState("");
  const [selectedFilterDetail, setSelectedFilterDetail] = useState([]);

  const filterBoardList = (board, filterType) => {
    let filterBoard = [...board];

    if (filterType === "작성일순") {
      filterBoard.sort((a, b) => new Date(a.deadline) - new Date(a.deadline));
    }
    if (filterType === "조회수순") {
      filterBoard.sort((a, b) => new Date(a.deadline) - new Date(a.deadline));
    }
    if (filterType === "좋아요순") {
      filterBoard.sort((a, b) => new Date(a.deadline) - new Date(a.deadline));
    }

    return filterBoard;
  };

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

    if (typeParam) {
      setSearchType(typeParam);
    }

    axios
      .get(
        `/api/board/list?type=${typeParam}&keyword=${keywordParam}&page=${pageParam}`,
        { params },
      )
      .then((res) => {
        setBoardList(res.data.boardList);
        setPageInfo(res.data.pageInfo);
      });

    setSearchType(typeParam);
    setSearchKeyword(keywordParam);
  }, [searchParams, filterType, selectedFilterDetail]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handleSearchClick() {
    const typeParam = searchType;
    const keywordParam = searchKeyword;

    const params = new URLSearchParams({
      type: typeParam,
      keyword: keywordParam,
      page: 1,
    });

    navigate(`./?${params.toString()}`);
  }

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    setSearchParams(searchParams);
  }

  function handleFilterChange(e) {
    setFilterType(e.target.value);
    setSelectedFilterDetail([]);

    const params = new URLSearchParams({
      type: searchType,
      keyword: searchKeyword,
      filterType: e.target.value,
      filterDetail: [],
    });
    navigate(`./?${params.toString()}`);
  }

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        자유게시판
      </Heading>

      <Flex justifyContent={"center"} mb={"30px"} mt={"-20px"}>
        <Select
          w="150px"
          value={filterType}
          onChange={handleFilterChange}
          mr={2}
        >
          <option value="작성일순">작성일순</option>
          <option value="조회수순">조회수순</option>
          <option value="좋아요순">좋아요순</option>
        </Select>

        <Input
          w="300px"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="제목+작성자 검색"
          mr={2}
        />
        <Button colorScheme="blue" onClick={handleSearchClick}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </Button>
      </Flex>

      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
        {boardList.length === 0 ? (
          <Center>조회 결과가 없습니다.</Center>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>제목</Th>
                <Th>
                  <FontAwesomeIcon icon={faUserPen} />
                </Th>
                <Th>작성일시</Th>
                <Th>
                  <FontAwesomeIcon icon={faComments} />
                </Th>
                <Th>
                  <FontAwesomeIcon icon={faImages} />
                </Th>
                <Th>
                  <FontAwesomeIcon icon={fullHeart} />
                </Th>
                <Th>
                  <FontAwesomeIcon icon={ViewIcon} />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {boardList.map((board) => (
                <Tr
                  _hover={{ bg: "gray.100" }}
                  cursor="pointer"
                  onClick={() => navigate(`/board/${board.id}`)}
                  key={board.id}
                >
                  <Td>{board.id}</Td>
                  <Td>{board.title}</Td>
                  <Td>{board.memberId}</Td>
                  <Td>{board.inserted}</Td>
                  <Td>
                    {board.numberOfComments > 0 && (
                      <Badge ml={2} colorScheme="green">
                        <Flex alignItems="center">
                          <FontAwesomeIcon icon={faComments} />
                          <Box ml={1}>{board.numberOfComments}</Box>
                        </Flex>
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    {board.numberOfImages > 0 && (
                      <Badge ml={2} colorScheme="blue">
                        <Flex alignItems="center">
                          <FontAwesomeIcon icon={faImages} />
                          <Box ml={1}>{board.numberOfImages}</Box>
                        </Flex>
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    {board.numberOfLike > 0 && (
                      <Badge ml={2} colorScheme="red">
                        <Flex alignItems="center">
                          <FontAwesomeIcon icon={fullHeart} />
                          <Box ml={1}>{board.numberOfLike}</Box>
                        </Flex>
                      </Badge>
                    )}
                  </Td>
                  {/*<Td>
                    {board.numberOfView > 0 && (
                      <Badge ml={2} colorScheme="red">
                        <Flex alignItems="center">
                          <FontAwesomeIcon icon={ViewIcon} />
                          <Box ml={1}>{board.numberOfView}</Box>
                        </Flex>
                      </Badge>
                    )}
                  </Td>*/}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <Center mt={4}>
        <Flex gap={2}>
          {pageInfo.prevPageNumber && (
            <>
              <Button
                onClick={() => handlePageButtonClick(1)}
                leftIcon={<FontAwesomeIcon icon={faAnglesLeft} />}
              />
              <Button
                onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
                leftIcon={<FontAwesomeIcon icon={faAngleLeft} />}
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
                onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
                rightIcon={<FontAwesomeIcon icon={faAngleRight} />}
              />
              <Button
                onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
                rightIcon={<FontAwesomeIcon icon={faAnglesRight} />}
              />
            </>
          )}
        </Flex>
      </Center>
    </Box>
  );
}
