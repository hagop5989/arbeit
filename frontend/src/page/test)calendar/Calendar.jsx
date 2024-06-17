import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* Calendar.jsx 파일(왼쪽 Calendar 부분)  */

const Calendar = ({ month, year, setMonth, setYear, onDateClick }) => {
  const handleDateClick = (date) => {
    // 중앙 캘린더의 날짜를 변경합니다.
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  };

  return (
    <DatePicker
      selected={new Date(year, month)}
      onChange={handleDateClick}
      inline
      calendarClassName="full-width-calendar"
    />
  );
};

export default Calendar;
