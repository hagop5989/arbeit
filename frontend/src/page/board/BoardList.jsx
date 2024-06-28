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
  faComments,
  faEye,
  faHeart as fullHeart,
  faMagnifyingGlass,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-solid-svg-icons/faImages";
import { ViewIcon } from "@chakra-ui/icons";
import { LoginContext } from "../../provider/LoginProvider.jsx";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState({});
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
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
    setSearchKeyword(keywordParam);
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
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        질문 게시판
      </Heading>
      {/* Search and Filter Section */}
      <Flex justifyContent="center" mb={4}>
        <Select
          w="150px"
          value={filterType}
          onChange={handleFilterChange}
          mr={2}
        >
          <option value="작성일순">작성일순</option>
          <option value="조회수순">조회수순</option>
          <option value="좋아요순">좋아요순</option>
          <option value="댓글순">댓글순</option>
        </Select>

        <Box w={"500px"} display={"flex"}>
          <Input
            w="300px"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            placeholder="제목+작성자 검색"
            mr={2}
          />
          <Button colorScheme="blue" onClick={handleSearchClick}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </Button>
        </Box>
      </Flex>

      {/* Board List Table */}
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        {boardList.length === 0 ? (
          <Center p={4}>조회 결과가 없습니다.</Center>
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
                  <FontAwesomeIcon icon={faEye} />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {boardList.map((board) => (
                <Tr
                  key={board.id}
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() => navigate(`/board/${board.id}`)}
                >
                  <Td>{board.id}</Td>
                  <Td>{board.title}</Td>
                  <Td>{board.memberId}</Td>
                  <Td>{board.inserted}</Td>
                  <Td>
                    {board.numberOfComments > 0 && (
                      <Badge colorScheme="green" ml={2}>
                        <Flex alignItems="center">
                          <FontAwesomeIcon icon={faComments} />
                          <Box ml={1}>{board.numberOfComments}</Box>
                        </Flex>
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    {board.numberOfImages > 0 && (
                      <Badge colorScheme="blue" ml={2}>
                        <Flex alignItems="center">
                          <FontAwesomeIcon icon={faImages} />
                          <Box ml={1}>{board.numberOfImages}</Box>
                        </Flex>
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    {board.numberOfLike > 0 && (
                      <Badge colorScheme="red" ml={2}>
                        <Flex alignItems="center">
                          <FontAwesomeIcon icon={fullHeart} />
                          <Box ml={1}>{board.numberOfLike}</Box>
                        </Flex>
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    {board.numberOfView > 0 && (
                      <Badge colorScheme="red" ml={2}>
                        <Flex alignItems="center">
                          <FontAwesomeIcon icon={ViewIcon} />
                          <Box ml={1}>{board.numberOfView}</Box>
                        </Flex>
                      </Badge>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Pagination Section */}
      <Center mt={4}>
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

      <Box mt={5}>
        <Button colorScheme="blue" onClick={handleWriteButtonClick}>
          글쓰기
        </Button>
      </Box>
    </Box>
  );
}
