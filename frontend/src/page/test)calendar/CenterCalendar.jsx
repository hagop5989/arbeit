import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { eachDayOfInterval, format } from "date-fns";
import {
  CalendarWrapper,
  DayBox,
  DayLabelBox,
  EventBox,
  LeftCalendarContainer,
  MonthYearSelector,
  SmallCalendarContainer,
  TodayDayBox,
} from "./StyledComponents"; // import Calendar from "../Calendar.jsx";
import DatePicker from "react-datepicker";
import Calendar from "./Calendar.jsx";
import axios from "axios"; // npm install react-datepicker

// npm install react-datepicker
// npm install @emotion/react @emotion/styled
// 설치 필요

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
const predefinedColors = [
  "#6A0572", // Deep Purple
  "#044A9F", // Muted Blue
  "#0A8754", // Muted Green
  "#FF8C42", // Warm Orange
  "#B94767", // Deep Pink
  "#4A4E69", // Soft Slate
  "#1B998B", // Teal
  "#D72638", // Soft Red
  "#3E5C76", // Denim Blue
  "#6C757D", // Grey
  "#F4A261", // Muted Peach
  "#2A9D8F", // Muted Teal
  "rgb(214,56,163)",
  "#BCB8B1", // Light Grey
  "#264653", // Dark Blue
];

const CenterCalendar = ({
  month,
  year,
  setMonth,
  setYear,
  events,
  setEvents,
}) => {
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [memo, setMemo] = useState("");

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedColor, setSelectedColor] = useState("#00aaff");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventColors, setEventColors] = useState({});

  // 이벤트 색상을 설정
  useEffect(() => {
    const newEventColors = {};
    events.forEach((event) => {
      if (!eventColors[event.name]) {
        newEventColors[event.name] = selectedColor;
      } else {
        newEventColors[event.name] = eventColors[event.name];
      }
    });
    setEventColors(newEventColors);
  }, [events, selectedColor]);

  // 날짜 클릭 시 일정 추가 모달을 열기
  const handleDateClick = (day) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    setStartDate(date);
    onOpen();
  };

  // 시작 날짜 변경 핸들러
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setShowStartDatePicker(false);
  };

  // 종료 날짜 변경 핸들러
  const handleEndDateChange = (date) => {
    setEndDate(date);
    setShowEndDatePicker(false);
  };

  // 일정 저장 핸들러
  const handleSaveEvent = () => {
    if (endDate < startDate) {
      alert("종료일보다 시작일이 빠를 수 없습니다.");
      return;
    }

    const overlappingEvents = events.filter(
      (event) =>
        startDate <= new Date(event.end) && endDate >= new Date(event.start),
    );

    if (overlappingEvents.length >= 3) {
      alert("일정은 최대 3개까지 추가할 수 있습니다.");
      return;
    }

    if (eventName && startDate && endDate) {
      const newEvent = {
        name: eventName,
        start: startDate,
        end: endDate,
        memo,
        color: selectedColor,
      };
      setEvents([...events, newEvent]); // events 업데이트
      setEventName("");
      setStartDate(new Date());
      setEndDate(new Date());
      setMemo("");
      setSelectedColor("#00aaff");
      onClose();
    }

    handleSubmit();
  };

  // 색상 변경 핸들러
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  // 달력의 날짜를 렌더링
  const renderDays = () => {
    const days = [];
    const eventMap = new Map();
    const eventPositions = new Map(); // 이벤트 위치를 저장할 맵

    // 각 날짜별로 이벤트를 그룹화
    events.forEach((event) => {
      eachDayOfInterval({
        start: new Date(event.start),
        end: new Date(event.end),
      }).forEach((date) => {
        const key = format(date, "yyyy-MM-dd");
        if (!eventMap.has(key)) {
          eventMap.set(key, []);
        }
        eventMap.get(key).push({ ...event, color: event.color });
      });
    });

    // 각 이벤트의 위치를 계산하여 저장
    events.forEach((event) => {
      const start = format(new Date(event.start), "yyyy-MM-dd");
      const end = format(new Date(event.end), "yyyy-MM-dd");

      // 기존 위치를 검사하여 새로운 위치를 계산
      let position = 0;
      while (true) {
        const overlapping = Array.from(eventPositions.entries()).some(
          ([eName, positions]) => {
            if (eName === event.name) return false; // 같은 이벤트는 무시
            return positions.some(([eStart, eEnd, ePos]) => {
              return (
                ((start >= eStart && start <= eEnd) ||
                  (end >= eStart && end <= eEnd) ||
                  (start <= eStart && end >= eEnd)) &&
                ePos === position
              );
            });
          },
        );
        if (!overlapping) break;
        position++;
      }

      if (!eventPositions.has(event.name)) {
        eventPositions.set(event.name, []);
      }
      eventPositions.get(event.name).push([start, end, position]);
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const today = new Date();

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<DayBox key={`empty-${i}`} />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === today.toDateString();
      const dayOfWeek = (firstDayIndex + i - 1) % 7;
      const formattedDate = format(date, "yyyy-MM-dd");
      const eventsForDay = eventMap.get(formattedDate) || [];

      days.push(
        <DayBox
          key={i}
          as={isToday ? TodayDayBox : Box}
          onClick={() => handleDateClick(i)}
          hasEvents={eventsForDay.length > 0}
        >
          <Text
            fontSize="lg"
            color={dayOfWeek === 0 ? "red" : dayOfWeek === 6 ? "blue" : "black"}
          >
            {i}
          </Text>
          {eventsForDay.map((event, index) => {
            const eventPosition = eventPositions
              .get(event.name)
              .find(
                ([eStart, eEnd]) =>
                  eStart <= formattedDate && eEnd >= formattedDate,
              );

            return (
              <EventBox
                key={index}
                isEventStart={
                  format(new Date(event.start), "yyyy-MM-dd") === formattedDate
                }
                isEventEnd={
                  format(new Date(event.end), "yyyy-MM-dd") === formattedDate
                }
                isEventInRange={
                  format(new Date(event.start), "yyyy-MM-dd") !==
                    formattedDate &&
                  format(new Date(event.end), "yyyy-MM-dd") !== formattedDate
                }
                offset={eventPosition[2] * 25}
                bgColor={event.color}
              >
                {format(new Date(event.start), "yyyy-MM-dd") === formattedDate
                  ? event.name
                  : ""}
              </EventBox>
            );
          })}
        </DayBox>,
      );
    }
    return days;
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }

  // 오늘 날짜로 이동
  const handleTodayClick = () => {
    const today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const formatDate = (date) => {
    return format(date, "yyyy-MM-dd");
  };

  function handleSubmit() {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    axios
      .post("/api/calendar/insert", {
        eventName,
        formattedStartDate,
        formattedEndDate,
        memo,
      })
      .then()
      .catch()
      .finally();
  }

  return (
    <ChakraProvider>
      <SmallCalendarContainer>
        <Flex>
          <Button w={"80px"} colorScheme={"blue"} onClick={handleTodayClick}>
            오늘
          </Button>
          <Spacer w={"600px"} />
          <MonthYearSelector>
            <Button onClick={() => setMonth(month === 0 ? 11 : month - 1)}>
              {"<"}
            </Button>

            <Select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </Select>
            <Select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>
                  {`${m + 1}월`}
                </option>
              ))}
            </Select>
            <Button onClick={() => setMonth(month === 11 ? 0 : month + 1)}>
              {">"}
            </Button>
          </MonthYearSelector>
        </Flex>
        <SimpleGrid columns={7} spacing={1} w="full">
          {daysOfWeek.map((day, index) => (
            <DayLabelBox
              key={index}
              color={index === 0 ? "red" : index === 6 ? "blue" : "black"}
            >
              {day}
            </DayLabelBox>
          ))}
        </SimpleGrid>
        <SimpleGrid
          h={"700px"}
          fontWeight={"bold"}
          columns={7}
          spacing={1}
          w="full"
        >
          {renderDays()}
        </SimpleGrid>
      </SmallCalendarContainer>
      <Box mt={"10px"} display="flex" height="80vh">
        <Box width="10%">
          <LeftCalendarContainer>
            <Calendar
              month={month}
              year={year}
              setMonth={setMonth}
              setYear={setYear}
              onDateClick={handleDateClick}
            />
          </LeftCalendarContainer>
        </Box>
        <Box
          width="300px"
          p={4}
          bg="gray.100"
          overflowY="auto"
          borderRadius={"15px"}
        >
          <Text fontSize="20px" fontWeight={"bold"}>
            이달의 일정
          </Text>
          <VStack spacing={4}>
            {events.map((event, index) => (
              <Box
                key={index}
                p={4}
                bg="white"
                borderRadius="md"
                boxShadow="md"
                width="100%"
              >
                <HStack justifyContent="space-between">
                  <Box
                    w={"100%"}
                    textIndent={"8px"}
                    fontWeight={"600"}
                    bgColor={event.color}
                    color={"white"}
                    borderRadius="md"
                    whiteSpace="nowrap" // 줄 바꿈을 막음
                    overflow="hidden" // 넘친 내용을 숨김
                    textOverflow="ellipsis" // 넘친 내용을 "..."으로 표시
                  >
                    {event.name}
                  </Box>
                </HStack>
                <Text borderLeft={`4px solid ${event.color}`} p={1} my={3}>
                  {event.memo}
                </Text>
                <Text
                  bgColor={"gray.100"}
                  borderRadius={"8px"}
                  p={1}
                  fontWeight={"500"}
                  fontSize={"13px"}
                >
                  {format(new Date(event.start), "yyyy-MM-dd")} -{" "}
                  {format(new Date(event.end), "yyyy-MM-dd")}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>일정 추가</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="일정 이름"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <Box width="100%">
                <Text>시작일자</Text>
                <Input
                  value={format(startDate, "yyyy-MM-dd")}
                  readOnly
                  onClick={() => setShowStartDatePicker(true)}
                />
                {showStartDatePicker && (
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="yyyy-MM-dd"
                    inline
                  />
                )}
              </Box>
              <Box width="100%">
                <Text>종료일자</Text>
                <Input
                  value={format(endDate, "yyyy-MM-dd")}
                  readOnly
                  onClick={() => setShowEndDatePicker(true)}
                />
                {showEndDatePicker && (
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="yyyy-MM-dd"
                    inline
                  />
                )}
              </Box>
              <Box width="100%">
                <Text>색상 선택</Text>
                <Box display="flex" flexWrap="wrap">
                  {predefinedColors.map((color, index) => (
                    <Box
                      key={index}
                      width="20px"
                      height="20px"
                      bg={color}
                      m="2px"
                      borderRadius="50%"
                      cursor="pointer"
                      border={
                        selectedColor === color ? "2px solid black" : "none"
                      }
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </Box>
              </Box>
              <Textarea
                placeholder="메모"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveEvent}>
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

const CalendarContainer = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]); // events 상태 정의

  const currentMonthEvents = events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return (
      (eventStart.getMonth() === month && eventStart.getFullYear() === year) ||
      (eventEnd.getMonth() === month && eventEnd.getFullYear() === year) ||
      (eventStart < new Date(year, month + 1, 0) &&
        eventEnd > new Date(year, month, 1))
    );
  });

  return (
    <CalendarWrapper>
      <CenterCalendar
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
        events={currentMonthEvents} // 현재 달의 이벤트만 전달
        setEvents={setEvents} // setEvents 전달
      />
    </CalendarWrapper>
  );
};

export default CalendarContainer;
