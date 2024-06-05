import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";

export function StoreEdit() {
  const { id } = useParams();
  const [store, setStore] = useState(null);

  useEffect(() => {
    axios.get(`/api/store/${id}`).then((res) => setStore(res.data));
  }, [id]);

  if (!store) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Box mb={10}></Box>
      <Box p={4} maxWidth="600px" mx="auto">
        <Box mb={7}>
          <FormControl>
            <FormLabel>가게이름</FormLabel>
            <Input
              defaultValue={store.name}
              onChange={(e) => setStore({ ...store, name: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Textarea
              defaultValue={store.content}
              onChange={(e) => setStore({ ...store, content: e.target.value })}
            ></Textarea>
          </FormControl>
        </Box>

        <Box mb={7}>
          <FormControl>
            <FormLabel>가게 주소</FormLabel>
            <Input
              defaultValue={store.address}
              onChange={(e) => setStore({ ...store, address: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>가게 카테고리</FormLabel>
            <Select
              defaultValue={store.category}
              onChange={(e) => setStore({ ...store, category: e.target.value })}
            >
              <option value="요식업">요식업</option>
              <option value="미용">미용</option>
              <option value="유통">유통</option>
              <option value="사무직">사무업무</option>
              <option value="생산">생산</option>
              <option value="기타">기타</option>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}
