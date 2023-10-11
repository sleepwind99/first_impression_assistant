import Checkbox from "@/components/form/checkBox";
import Link from "next/link";

type TermsAgreementItemProps = {
  isChecked: boolean;
  onChecked: (e: boolean) => void;
  title: string;
  href?: string;
  description?: string;
};

const TermsAgreementItem = ({
  isChecked,
  onChecked,
  title,
  href,
  description,
}: TermsAgreementItemProps) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-row gap-2">
        <Checkbox id="agree-all" isChecked={isChecked} onChecked={onChecked} />
        <p>{title}</p>
        {href === undefined ? null : (
          <Link
            href={href}
            className="text-xs underline-offset-4 text-slate-600"
          >
            자세히 보기
          </Link>
        )}
      </div>
      <p className="text-xs">{description}</p>
    </div>
  );
};

export type TermsAgreementSection = {
  service: boolean;
  setService: (e: boolean) => void;
  privacy: boolean;
  setPrivacy: (e: boolean) => void;
  marketing: boolean;
  setMarketing: (e: boolean) => void;
};

const TermsAgreementSection = ({
  service,
  setService,
  privacy,
  setPrivacy,
  marketing,
  setMarketing,
}: TermsAgreementSection) => {
  const onCheckedAll = (e: boolean) => {
    setService(e);
    setPrivacy(e);
    setMarketing(e);
  };
  return (
    <div className="flex flex-col items-stretch justify-start gap-2">
      <TermsAgreementItem
        isChecked={service && privacy && marketing}
        onChecked={onCheckedAll}
        title="전체 동의"
      />
      <div className="rounded-2xl border-2 border-slate-600 p-4 flex flex-col items-start justify-start gap-2">
        <TermsAgreementItem
          isChecked={service}
          onChecked={setService}
          title="(필수) 이용약관 동의"
          href="/service-terms"
        />
        <TermsAgreementItem
          isChecked={privacy}
          onChecked={setPrivacy}
          title="(필수) 개인정보 처리방침 동의"
          href="/privacy-polciy"
        />
        <TermsAgreementItem
          isChecked={marketing}
          onChecked={setMarketing}
          title="(선택) 마케팅 수신 동의"
          href="/marketing-push"
          description="다양한 이벤트 및 혜택을 받아볼 수 있습니다."
        />
      </div>
    </div>
  );
};

export default TermsAgreementSection;
