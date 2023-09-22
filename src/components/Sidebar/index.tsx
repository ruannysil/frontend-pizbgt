'use client'

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useState, useEffect, useContext } from 'react';
import { IconType } from 'react-icons';
import { FiClipboard } from 'react-icons/fi';
import { GiCardExchange, GiHamburgerMenu } from 'react-icons/gi';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { MdOutlineClose } from 'react-icons/md';
import { PiSignOut } from 'react-icons/pi';
import logoImg from '../../../public/newLogo.svg'
import { AuthContext } from "@/contexts/AuthContext"


interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
  onClick?: () => void;
}

const LinkItem: Array<LinkItemProps> = [
  {
    name: 'Categoria',
    icon: BiSolidFoodMenu,
    route: '/category',
  },
  {
    name: 'Produtos',
    icon: GiCardExchange,
    route: '/product',
  },
  {
    name: 'Cardápio',
    icon: FiClipboard,
    route: '/menu',
  },
  {
    name: 'Últimos pedidos',
    icon: FiClipboard,
    route: '/dashboard',
  },
];

export function Sidebar({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useContext(AuthContext)



  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  return (
    <div className="min-h-[100vh] md:w-full md:flex">
      <SideBarContent onClose={() => setIsOpen(false)} isOpen={isOpen} singOut={signOut} />

      <div
        className={`${isOpen ? 'md:w-64' : 'md:w-16'
          } flex md:hidden bg-bgdark700 h-20 w-[100%] md:w-100% max-w-[100%] flex-col items-center justify-center fixed`}
      >
        <MobileNav isOpen={isOpen} onToggleSidebar={toggleSidebar} />
      </div>

      <div className="ml-2 md:ml-2 p-4 md:pt-10 pt-[6rem]">{children}</div>
    </div>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  singOut: () => void;
}

const SideBarContent = ({ onClose, isOpen, singOut, ...rest }: SidebarProps) => {
  const sidebarClasses = isOpen
    ? 'bg-bgdark700 md:flex w-[100%] z-[99] md:transform md:translate-x-0 md:transition-slide-in fixed h-full'
    : 'bg-bgdark700 md:flex hidden';

  return (
    <div className={sidebarClasses}>
      <div className="flex-col md:w-[20rem] transform translate-x-0 transition-slide-in">
        <div className="h-[20] justify-between md:justify-center  items-center mx-8 flex">
          <Link href="/dashboard">
            <div className="cursor-pointer flex items-center justify-center my-4 mb-8">
              <Image
                src={logoImg}
                width={180}
                height={100}
                alt="logo ab gym"
                className="OK"
              />
            </div>
          </Link>
          <button className="block md:block" onClick={onClose}>
            <MdOutlineClose className="text-4xl block text-white  md:hidden" />
          </button>
        </div>

        {LinkItem.map((link) => (
          <NavItem
            icon={link.icon}
            route={link.route}
            key={link.name}
            onClick={link.onClick ? link.onClick : singOut}
          >
            {link.name}
          </NavItem>
        ))}
        <Button icon={PiSignOut} onClick={singOut}>
          Sair
        </Button>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: IconType;
  children: ReactNode;
  route: string;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, children, route, onClick, ...rest }: NavItemProps) => {
  return (
    <>
      <Link
        href={route}
        style={{ textDecoration: 'none', flexDirection: 'row' }}
      >
        <h2
          className="cursor-pointer p-4 mx-4 text-white rounded hover:text-bgred hover:bg-secundaryLight items-center flex"
          {...rest}
        >
          {Icon && <Icon className="mr-4 text-base group-hover:text-bgred" />}
          {children}
        </h2>
      </Link>
    </>
  );
};

interface ButtonProps {
  icon: IconType;
  children: ReactNode;
  onClick: () => void;
}

const Button = ({ icon: Icon, children, onClick, ...rest }: ButtonProps) => {
  return (
    <>
      <button
        className="cursor-pointer p-4 mx-4 text-white rounded hover:text-bgred hover:bg-secundaryLight items-center flex w-[88%]"
        {...rest}
        onClick={onClick}
      >
        {Icon && <Icon className="mr-4 text-base group-hover:text-white" />}
        {children}
      </button>
    </>
  );
}

interface MobileProps {
  isOpen: boolean;
  onToggleSidebar: () => void;
}

const MobileNav = ({ isOpen, onToggleSidebar, ...rest }: MobileProps) => {
  const handleToogleSidebar = () => {
    onToggleSidebar();
  };
  return (
    <div
      className="ml-0 md:ml-20 p-4 md:p-20 h-20 items-center justify-between flex w-full"
      {...rest}
    >
      <button
        onClick={handleToogleSidebar}
        className={`text-white text-4xl flex transition-transform duration-slow ease-in-out ${isOpen
            ? 'md:transform md:translate-x-0 md:transition-slide-in '
            : 'transform translate-x-0 transition-slide-in '
          }`}
      >
        <GiHamburgerMenu />
      </button>
      <div className="cursor-pointer flex items-center justify-center">
        <Image
          src={logoImg}
          width={100}
          height={100}
          alt="logo ab gym"
          className="items-center"
        />
      </div>
    </div>
  );
};

