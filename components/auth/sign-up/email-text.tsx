import Image from "next/image";
import TextInputField from "@/components/form/textInputField";

export type EmailTextProps = {
  domain: string;
  email: string;
};

const EmailText = ({ domain, email }: EmailTextProps) => {
  return (
    <TextInputField
      id="email"
      type="email"
      label="이메일"
      placeholder=""
      isReadOnly={true}
      defaultValue={email}
      prefix={
        <Image
          alt={domain}
          src={`/icons/domains/${domain}-logo.png`}
          width={32}
          height={32}
        />
      }
    />
  );
};

export default EmailText;
