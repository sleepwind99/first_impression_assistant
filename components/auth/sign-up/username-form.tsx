"use client";

import TextInputField from "@/components/form/textInputField";
import { useState } from "react";
import Image from "next/image";
import checkIcon from "@/public/icons/check.svg";
import closeIcon from "@/public/icons/close.svg";

export type UsernameFormProps = {
  email: string;
  checkExistUsername: (username: string) => Promise<boolean>;
  setUsername: (e: string | null) => void;
};

const UsernameForm = ({
  email,
  setUsername,
  checkExistUsername,
}: UsernameFormProps) => {
  const [value, setValue] = useState<string>(email.split("@")[0]);
  const [isValidate, setIsValidate] = useState<boolean>(false);
  const [isEnable, setIsEnable] = useState<boolean>(true);
  const [feedbackMessage, setFeedBackMessage] = useState<string | undefined>();
  const [feedbackMessageColor, setFeedBackMessageColor] = useState<
    "text-red" | "text-green" | "text-black"
  >("text-black");
  const regExp = /^[0-9a-zA-Z_.]{4,64}$/;

  const validateUsername = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    setUsername(null);
    setIsValidate(false);
    setIsEnable(false);
    setValue(input);

    if (!regExp.test(input)) {
      setFeedBackMessage(
        "아이디는 영문 및 특수문자(._) 포함 4자 이상으로 입력해주세요",
      );
      setFeedBackMessageColor("text-red");
      return;
    }

    setFeedBackMessage(undefined);
    setFeedBackMessageColor("text-black");
    setIsEnable(true);
  };

  const checkEnableUsername = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (!regExp.test(value)) {
      setFeedBackMessage(
        "아이디는 영문 및 특수문자(._)로 4자 이상으로 입력해주세요",
      );
      setFeedBackMessageColor("text-red");
      return;
    }

    const isExist = await checkExistUsername(value);

    if (isExist) {
      setFeedBackMessage("이미 존재하는 아이디입니다");
      setFeedBackMessageColor("text-red");
      return;
    }

    setFeedBackMessage("사용 가능한 아이디입니다");
    setFeedBackMessageColor("text-green");
    setUsername(value);
    setIsValidate(true);
  };

  return (
    <div className="flex flex-row gap-4">
      <TextInputField
        id="username-form"
        label="닉네임"
        defaultValue={value}
        placeholder={"사용하실 아이디를 입력해주세요"}
        feedbackMessage={feedbackMessage}
        feedbackMessageColor={feedbackMessageColor}
        maxLength={64}
        onChange={validateUsername}
        pattern={regExp.source}
        prefix={
          <>
            {(!isEnable || isValidate) && (
              <Image
                src={isEnable ? checkIcon : closeIcon}
                className={isEnable ? "fill-green" : "fill-red"}
                alt={isEnable ? "사용 가능" : "사용 불가능"}
                width={24}
                height={24}
              />
            )}
          </>
        }
        suffix={
          isEnable && !isValidate ? (
            <button
              hidden={isValidate}
              type="submit"
              onClick={checkEnableUsername}
              className="w-full rounded-2xl bg-slate-600 text-base text-white px-6 py-4"
            >
              중복 검사
            </button>
          ) : undefined
        }
      />
    </div>
  );
};

export default UsernameForm;
