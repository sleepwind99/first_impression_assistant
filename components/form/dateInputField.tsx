"use State";

import { dateToYM } from "@/util/date-util";
import { DateType } from "@/model/date";
import { useState } from "react";

type Props = {
  type: DateType;
  date?: Date;
  minDate: Date;
  maxDate: Date;
  readOnly: boolean;
  onError?: (e: string) => void;
  onChange?: (e: Date) => void;
  className?: string;
};

const DateInputField = (props: Props) => {
  const [year, setYear] = useState(
    new Date(props.date ?? new Date()).getFullYear().toString(),
  );
  const [month, setMonth] = useState(
    new Date(props.date ?? new Date()).getMonth().toString(),
  );
  const [date, setDate] = useState(props.date);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "year") {
      const regex = /^(?:\d{0,4})$/;
      if (!regex.test(value)) {
        console.log("=--> value1");
        props.onError && props.onError("4자리 숫자의 연도를 입력해주세요");
        return;
      }
      setYear(value);

      const year = parseInt(value, 10);

      const newDate = new Date(date ?? new Date());
      newDate.setFullYear(year);
      if (newDate.getTime() < props.minDate.getTime()) {
        props.onError &&
          props.onError(`최소 ${dateToYM(props.minDate)} 이후로 입력해주세요`);
        return;
      }
      if (newDate.getTime() > props.maxDate.getTime()) {
        props.onError &&
          props.onError(`최대 ${dateToYM(props.maxDate)}까지 입력가능합니다`);
        return;
      }

      console.log(newDate);

      setDate(newDate);
      props.onChange && props.onChange(newDate);
    } else if (name === "month") {
      const regex = /^(?:\d{0,2})$/;
      if (!regex.test(value)) {
        props.onError && props.onError("2자리 이내로 월을 적어주세요");
        return;
      }

      const month = parseInt(value, 10);
      if (month < 1 || month > 12) {
        props.onError && props.onError("1월 ~ 12월 내로 월을 적어주세요");
        return;
      }
      setMonth(value);

      const newDate = new Date(date ?? new Date());
      newDate.setMonth(month);

      if (newDate.getTime() < props.minDate.getTime()) {
        props.onError &&
          props.onError(`최소 ${dateToYM(props.minDate)} 이후로 입력해주세요`);
        return;
      }
      if (newDate.getTime() > props.maxDate.getTime()) {
        props.onError &&
          props.onError(`최대 ${dateToYM(props.maxDate)}까지 입력가능합니다`);
        return;
      }
      console.log(newDate);

      setDate(newDate);
      props.onChange && props.onChange(newDate);
    }
  };

  return (
    <div className="h-[24px] flex flex-row items-bottom gap-0 w-fit shrink grow-0 m-0">
      <input
        type="number"
        name="year"
        className="text-[15px] h-[24px] font-light outline-none w-fit m-0 text-end"
        placeholder="YYYY"
        value={year}
        maxLength={4}
        min={new Date(props.minDate).getFullYear()}
        max={new Date(props.maxDate).getFullYear()}
        onChange={handleInputChange}
        readOnly={props.readOnly}
      />
      <p className="h-[24px] font-light text-[15px]">.</p>
      <input
        type="number"
        name="month"
        className="h-[24px] font-light text-[15px] outline-none w-[30px] m-0 text-start"
        placeholder="MM"
        value={props.readOnly ? month.padStart(2, "0") : month}
        maxLength={2}
        min={1}
        max={12}
        onChange={handleInputChange}
        readOnly={props.readOnly}
      />
    </div>
  );
};

export default DateInputField;
