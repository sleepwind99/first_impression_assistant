"use client";

import { ReactElement } from "react";

export type TextInputFieldProps = {
  id: string;
  type?: string;
  pattern?: string;
  label?: string;
  defaultValue: string;
  placeholder: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  feedbackMessage?: string;
  feedbackMessageColor?: "text-black" | "text-red" | "text-green";
  isReadOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  prefix?: ReactElement;
  suffix?: ReactElement;
};

const TextInputField = ({
  id,
  type = "text",
  pattern,
  label,
  defaultValue,
  placeholder,
  onChange,
  feedbackMessage,
  feedbackMessageColor = "text-black",
  isReadOnly = false,
  minLength,
  maxLength,
  prefix,
  suffix,
}: TextInputFieldProps) => {
  return (
    <div className="w-full flex flex-col text-base gap-2">
      <div className="flex flex-row w-full">
        <p className="text-black flex-grow-0 text-left">{label}</p>
        <p
          className={`${feedbackMessageColor} flex-grow text-right overflow-auto`}
        >
          {feedbackMessage}
        </p>
      </div>
      <div className="flex flex-row gap-4">
        <div
          className={`flex-grow rounded-xl px-6 py-4 gap-6 flex flex-row w-full bg-slate-200`}
        >
          {prefix}
          <input
            id={id}
            readOnly={isReadOnly}
            type={type}
            pattern={pattern}
            placeholder={placeholder}
            onChange={onChange}
            defaultValue={defaultValue}
            minLength={minLength}
            maxLength={maxLength}
            className="flex-grow placeholder:text-slate-600 text-black bg-transparent outline-none"
          />
        </div>
        {suffix && <div className="flex-grow-0 shrink-0">{suffix}</div>}
      </div>
    </div>
  );
};

export default TextInputField;
