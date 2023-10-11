"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export type AuthButtonProps = {
  value: string;
  label: string;
};

const AuthButton = ({ label, value }: AuthButtonProps) => {
  const login = () => {
    signIn(value);
  };

  return (
    <button
      onClick={login}
      className="w-1/2 flex flex-row justify-center bg-slate-200 rounded-3xl px-6 py-4"
    >
      <Image
        alt={`${label}로 시작하기`}
        src={`/icons/domains/${value}-logo.png`}
        width={24}
        height={24}
        className="flex-grow-0"
      />
      <span className="flex-grow pr-6">{label}로 시작하기</span>
    </button>
  );
};

export default AuthButton;
