import Image from "next/image"
import Link from "next/link"
import logoImg from '../../../public/newLogo.svg'

import { useContext } from 'react'

import { AuthContext } from "@/contexts/AuthContext"
import { FiLogOut } from 'react-icons/fi'
import { Sidebar } from "../Sidebar"

export function Header() {
  const { signOut } = useContext(AuthContext)


  return (
    <header className="h-[5rem]">
      <div className="h-full mx-auto px-4 md:px-8 flex justify-between items-center max-w-screen-xl md:w-full">
        <div className="md:hidden flex items-center">
      
        </div>
        <Link href={'/dashboard'} className="cursor-pointer">
          <Image src={logoImg} alt='Image logo' className='w-[100px]' />
        </Link>

        <nav className="md:flex items-center md:space-x-8 space-x-2 hidden">
          <Link href="/category" className="text-white hover:text-red-500 transition-colors duration-700">
            Categoria
          </Link>
          <Link href="/product" className="text-white hover:text-red-500 transition-colors duration-700">
            Produtos
          </Link>
          <Link href="/menu" className="text-white hover:text-red-500 transition-colors duration-700">
            Cardápio
          </Link>
          <Link href="/dashboard" className="text-white hover:text-red-500 transition-colors duration-700">
            Últimos pedidos
          </Link>
          <button className="focus:outline-none" onClick={signOut}>
            <FiLogOut className="text-2xl text-white hover:text-red-500 transition-colors duration-700 transform hover:scale-125" />
          </button>
        </nav>

          <div className="md:hidden fixed top-0 left-0 h-screen z-50">
            <Sidebar children={undefined} />
          </div>
      </div>
    </header>
  );
}