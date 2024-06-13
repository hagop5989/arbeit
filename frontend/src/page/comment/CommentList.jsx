import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Table,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!boardId) return;

    axios
      .get(`/api/comment/list/${boardId}`)
      .then((res) => {
        setCommentList(res.data);
      })
      .catch((err) => console.log(err));
  }, [boardId]);

  function handleEdit(id) {}

  return (
    <Box>
      <FormControl>
        <FormLabel>댓글목록</FormLabel>
        <Box>
          <Table>
            <Tbody>
              {commentList.map((comment) => (
                <Tr>
                  <Td>{comment.id}</Td>
                  <Td>{comment.comment}</Td>
                  <Td>{comment.memberId}</Td>
                  <Td>{comment.inserted}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        handleEdit(comment.id);
                      }}
                    ></Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </FormControl>
    </Box>
  );
}
