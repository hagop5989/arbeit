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

  useEffect(() => {
    const typeParam = searchParams.get("type") || "all";
    const keywordParam = searchParams.get("keyword") || "";
    const pageParam = searchParams.get("page") || 1;

    axios
      .get(
        `/api/board/list?type=${typeParam}&keyword=${keywordParam}&page=${pageParam}`,
      )
      .then((res) => {
        setBoardList(res.data.boardList);
        setPageInfo(res.data.pageInfo);
      });

    setSearchType(typeParam);
    setSearchKeyword(keywordParam);
  }, [searchParams]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handleSearchClick() {
    setSearchKeyword(searchKeyword);
    const typeParam = searchType;
    const keywordParam = searchKeyword;

    const params = new URLSearchParams({
      type: typeParam,
      keyword: keywordParam,
      page: 1,
    });

    navigate(`./?${params.toString()}`);
    console.log("Search params:", params.toString()); // 콘솔에 출력하여
  }

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    setSearchParams(searchParams);
  }

  return (
    <Box>
      <Box>
        <Heading>게시글 목록</Heading>
      </Box>
      <Box>
        {boardList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
        {boardList.length > 0 && (
          <Table>
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
                  <FontAwesomeIcon icon={ViewIcon} />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {boardList.map((board) => (
                <Tr
                  _hover={{
                    bg: "blue.200",
                  }}
                  cursor={"pointer"}
                  onClick={() => navigate(`/board/${board.id}`)}
                  key={board.id}
                >
                  <Td>{board.id}</Td>
                  <Td>{board.title}</Td>
                  <Td>{board.memberId}</Td>
                  <Td>{board.inserted}</Td>

                  <Td>
                    {board.numberOfComments > 0 && (
                      <Badge ml={2}>
                        <Flex gap={1}>
                          <Box>
                            <FontAwesomeIcon icon={faComments} />
                          </Box>
                          {board.numberOfComments}
                        </Flex>
                      </Badge>
                    )}
                  </Td>

                  <Td>
                    {board.numberOfImages > 0 && (
                      <Badge ml={2}>
                        <Flex gap={1}>
                          <Box>
                            <FontAwesomeIcon icon={faImages} />
                          </Box>
                          {board.numberOfImages}
                        </Flex>
                      </Badge>
                    )}
                  </Td>

                  <Td>
                    {board.numberOfview > 0 && (
                      <Badge ml={2}>
                        <Flex gap={1}>
                          <Box>
                            <FontAwesomeIcon icon={ViewIcon} />
                          </Box>
                          {board.numberOfview}
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
      {/* 검색창 */}
      <Center mb={10}>
        <Flex gap={1}>
          <Box>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="memberId">작성자</option>
            </Select>
          </Box>
          <Box>
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
      </Center>

      <Center>
        <Flex gap={1}>
          {pageInfo.prevPageNumber && (
            <>
              <Button onClick={() => handlePageButtonClick(1)}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </Button>
              <Button
                onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
            </>
          )}
          {pageNumbers.map((pageNumber) => (
            <Button
              onClick={() => handlePageButtonClick(pageNumber)}
              key={pageNumber}
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
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
              <Button
                onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </Button>
            </>
          )}
        </Flex>
      </Center>
    </Box>
  );
}
