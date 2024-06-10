import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

export function StoreEdit() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/store/cate`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`/api/store/${id}`).then((res) => setStore(res.data));
  }, [id]);

  if (!store) {
    return <div>Loading...</div>;
  }

  function handleClickSave() {
    axios
      .put("/api/store/edit", store, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast({
          status: "success",
          description: `${store.id}가게가 수정되었습니다.`,
          position: "top",
        });
        navigate(`/store/${store.id}`);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: `가게가 수정되지 않았습니다. 작성한 내용을 확인해주세요.`,
            position: "top",
          });
        }
      })
      .finally(() => {
        onClose();
      });
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
            <FormLabel>전화 번호</FormLabel>
            <Input
              defaultValue={store.phone}
              onChange={(e) => setStore({ ...store, phone: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>가게 카테고리</FormLabel>
            <Select
              defaultValue={store.cate}
              onChange={(e) =>
                setStore({ ...store, categoryId: e.target.value })
              }
            >
              {categories.map((cate) => (
                <option key={cate.id} value={cate.id}>
                  {cate.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <Button colorScheme={"blue"} onClick={onOpen}>
            저장
          </Button>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalBody>저장하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>취소</Button>
              <Button onClick={handleClickSave} colorScheme={"blue"}>
                확인
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
