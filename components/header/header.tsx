import HeaderLogo from '@/components/header/header-logo';
import { AiOutlineMenu } from 'react-icons/ai';

export function Header() {
  return (
    <header className="z-10 fixed w-screen bg-white top-0 h-16">
      <div className="flex flex-row justify-between w-full px-9 items-center h-full border-b-[0.5px] border-black/70 gap-12">
        <HeaderLogo />
        <AiOutlineMenu className="w-8 h-8" />
      </div>
    </header>
  );
}
