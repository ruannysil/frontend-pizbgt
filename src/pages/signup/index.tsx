

import Head from 'next/head'
import Image from 'next/image'
import { FormEvent, useContext, useState } from 'react'
import logoImg from '../../../public/newLogo.svg'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AuthContext } from '@/contexts/AuthContext'
import { canSSRGuest } from '@/utils/canSSRGuest'
import Link from 'next/link'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'




export default function SignUp() {
  const { signUp } = useContext(AuthContext)

  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();

    if (name === '' || email === '' || password === '') {
      toast.error('Preencha todos os campos')
      return;
    }

    setLoading(true)

    const data = {
      name,
      email,
      password
    }

    await signUp(data)

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Faça seu Cadastro agora!</title>
      </Head>

      <div className='min-h-[100vh] flex items-center justify-center flex-col'>
        <Image src={logoImg} alt='Image logo' className='md:w-[400px] w-[260px]' />

        <div className='mt-10 md:w-[600px] w-[90%] flex items-center justify-center flex-col p-[2rem 1.5rem]'>

          <form className='w-[100%]' onSubmit={handleSignUp}>

            <h1 className='text-white flex items-center justify-center mb-4 md:text-4xl font-bold text-3xl'>Criando sua conta</h1>

            <Input
              placeholder='Digite seu nome'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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

          <Link href={'/'} className='mt-4 text-white hover:text-bgred'>Já possui conta? Faça login!</Link>
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