"use client";
import Image from "next/image";
import close from "@/public/icons/close.svg";

type TagProps = {
  title: string;
  className?: string;
  isDelete?: boolean;
  handleDelete?: () => void;
};

const Tag = ({
  title,
  className = "",
  isDelete = false,
  handleDelete,
}: TagProps) => {
  return (
    <>
      <div className="relative">
        <div
          className={`rounded-full border border-gray-300 bg-white pr-[12px] py-[4px] pl-[28px] text-ellipsis overflow-hidden whitespace-nowrap ${className}`}
        >
          {title}
        </div>
        {isDelete && (
          <Image
            src={close}
            alt="Close"
            width={12}
            height={12}
            className="absolute top-1/2 left-[8px] transform -translate-y-1/2 cursor-pointer"
            onClick={handleDelete}
          />
        )}
      </div>
    </>
  );
};

export default Tag;
