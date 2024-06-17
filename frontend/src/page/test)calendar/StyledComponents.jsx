import styled from "@emotion/styled";
import { Box, HStack, VStack } from "@chakra-ui/react";

export const CalendarWrapper = styled(Box)`
  display: flex;
`;

export const SmallCalendarContainer = styled(VStack)`
  width: 1000px;
  padding: 8px;
`;

export const LeftCalendarContainer = styled(Box)`
  position: fixed;
  left: 0;
  margin-left: -13px;
  margin-top: 35px;
  padding: 16px;
`;

export const MonthYearSelector = styled(HStack)`
  justify-content: space-between;
  width: 300px;
  align-items: center;
`;

export const DayBox = styled(Box)`
  background-color: ${(props) => props.bg || "white"};
  color: ${(props) => props.color || "black"};
  font-weight: 500;
  height: 115px;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  text-indent: 5px;
  position: relative;
  ${(props) =>
    props.hasEvents &&
    `
    padding-bottom: 25px;
  `}
`;

export const EventBox = styled(Box)`
  background-color: ${(props) => props.bgColor || "#5050ca"};
  color: white;
  margin-left: -4px;
  margin-right: -4px;
  padding: 2px;
  margin-top: 32px; /* 위치를 낮추기 위해 margin-top을 조정 */
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  position: absolute;
  top: ${(props) => props.offset || 0}px; /* 각 이벤트의 위치를 조정 */
  left: 0;
  right: 0;
  height: 20px; /* Height of the event bar */
  line-height: 15px;
  ${(props) =>
    props.isEventStart &&
    `
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  `}
  ${(props) =>
    props.isEventEnd &&
    `
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  `}
    ${(props) =>
    props.isEventInRange &&
    `
    border-radius: 0;
  `}
`;

export const TodayDayBox = styled(Box)`
  background-color: lightgray;
  color: black;
  padding: 8px;
  margin-top: -1.1px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border: 2.5px solid yellowgreen; /* Highlight border for today */
`;

export const DayLabelBox = styled(Box)`
  background-color: white;
  font-size: 13px;
  color: ${(props) => props.color || "black"};
  whitespace: nowrap; // 줄 바꿈을 막음
  overflow: hidden; // 넘친 내용을 숨김
  textoverflow: ellipsis; // 넘친 내용을 "..."으로 표시
  padding: 5px;
  margin: 1px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-weight: bold;
`;
