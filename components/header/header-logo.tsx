import Link from 'next/link';

const HeaderLogo = () => {
  return (
    <Link
      href="/"
      className="h-full flex flex-col justify-center grow-0 shrink-0"
    >
      <h1 className="text-black text-lg">Dr. AI</h1>
    </Link>
  );
};

export default HeaderLogo;
