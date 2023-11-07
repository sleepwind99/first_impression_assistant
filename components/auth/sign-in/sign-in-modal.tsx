"use client";
import AuthButton from "@/components/auth/sign-in/authButton";

type Props = {
  closeModal: () => void;
};

const SignInModal = (props: Props) => {
  return (
    <div className="flex flex-col justify-start gap-4 items-center">
      <AuthButton value="google" label="구글" />
      {/* <AuthButton value="apple" label="애플" /> */}
      <AuthButton value="naver" label="네이버" />
      <AuthButton value="kakao" label="카카오" />
    </div>
  );
};

export default SignInModal;
