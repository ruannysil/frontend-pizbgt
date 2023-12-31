import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { AuthContext } from '@/contexts/AuthContext'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

import logoImg from '../../public/newLogo.svg'

import { canSSRGuest } from '@/utils/canSSRGuest'
import { FormEvent, useContext, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'





export default function Home() {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useContext(AuthContext)


  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    if (email === '' || password === '') {
      toast.error('Preencha todos os campos')
      return;
    }

    setLoading(true);

    const data = {
      email,
      password
    }

    // console.log(data);
    await signIn(data)

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Pizzaria Baguette - Faça seu login</title>
      </Head>

      <div className='min-h-[100vh] flex items-center justify-center flex-col'>
        <Image src={logoImg} alt='Image logo' className='md:w-[400px] w-[260px]' />

        <div className='mt-10 md:w-[600px] w-[90%] flex items-center justify-center flex-col p-[2rem 1.5rem]'>

          <form className='w-[100%]' onSubmit={handleLogin}>
            <Input
              placeholder='Digite seu email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className='relative'>

              <Input
                placeholder='Digite sua senha'
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div onClick={handleClick} className='absolute inset-y-0 right-[19px] h-full w-[1.5rem] flex items-center justify-center text-2xl'>

                {show ? <FaEye color="#fff" /> : <FaEyeSlash color="#fff" />}
              </div>
            </div>
            <Button type='submit' loading={loading}>
              Acessar
            </Button>
          </form>

          <Link href={'/signup'} className='mt-4 text-white hover:text-bgred'>Não possui conta? Cadastre-se</Link>
        </div>
      </div>
    </>
  )
}


export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})