"use client";
import { PostUser } from "@/models/user";
import { ErrorResponse, isErrorResponse } from "@/models/reponse";
import { useEffect, useState } from "react";
import EmailText from "@/components/auth/sign-up/email-text";
import UsernameForm from "@/components/auth/sign-up/username-form";
import TermsAgreementSection from "@/components/auth/sign-up/terms-agreement-section";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  closeModal: () => void;
};

const submit = async (uid: string, user: PostUser) => {
  const body = { uid: uid, ...user };
  console.log(body);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/register`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok && isErrorResponse(data)) {
    throw data as ErrorResponse;
  }

  return response.ok;
};

const checkExistUsername = async (username: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/user/check-username-exist/${username}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();

  if (!response.ok && isErrorResponse(data)) {
    throw data as ErrorResponse;
  }

  return data.data;
};

export default function SignUpModal(props: Props) {
  const { data: session, update } = useSession();
  const router = useRouter();

  // nickname
  const [username, setUsername] = useState<string | null>(null);
  const regExp = /^[0-9a-zA-Z_.]{4,64}$/;

  // terms
  const [service, setService] = useState<boolean>(false);
  const [privacy, setPrivacy] = useState<boolean>(false);
  const [marketing, setMarketing] = useState<boolean>(false);

  const submitButtonHandler = async () => {
    if (!session?.user?.uid) throw Error("알 수 없는 사용자입니다");
    if (!regExp.test(username ?? "") || !service || !privacy) return;

    const submited = await submit(session?.user?.uid, {
      username: username!,
      name: username!,
      isEnableMarketing: marketing,
    });

    if (submited) {
      await update();
      alert("회원 가입 완료!! 🥳");
    }
  };

  return (
    <form>
      <div className="flex flex-col justify-start itmes-stretch gap-6">
        <EmailText
          domain={session?.user?.domain ?? ""}
          email={session?.user?.email ?? ""}
        />
        <UsernameForm
          email={session?.user?.email ?? ""}
          setUsername={setUsername}
          checkExistUsername={checkExistUsername}
        />
        <TermsAgreementSection
          service={service}
          setService={setService}
          privacy={privacy}
          setPrivacy={setPrivacy}
          marketing={marketing}
          setMarketing={setMarketing}
        />
        <button
          type="submit"
          onClick={submitButtonHandler}
          disabled={!regExp.test(username ?? "") || !service || !privacy}
        >
          회원가입
        </button>
      </div>
    </form>
  );
}
