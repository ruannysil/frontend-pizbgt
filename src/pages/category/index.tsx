import { Header } from "@/components/Header";
import { Button2 } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Head from "next/head";
import { FormEvent, useState } from "react";

import { setupAPIClient } from "@/services/api";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { toast } from "react-toastify";

export default function Category() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (name === '') {
      // toast.error('Preencha o campo categoria')
      return;
    }

    setLoading(true);

    const apiClient = setupAPIClient();
    await apiClient.post('/category', {
      name: name
    })

    toast.success('Categoria cadastrada com sucesso!')
    setName('');

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Nova Categoria - Pizzaria Baguette</title>
      </Head>

      <div>
        <Header />

        <main className="m-[4rem auto] flex justify-between flex-col mx-auto my-16 px-4 md:px-8 max-w-screen-md md:w-full">
          <h1 className="text-white font-bold text-3xl flex items-start">
            Cadastra nova categoria
          </h1>
          <form className="flex flex-col mx-auto my-4  w-full" onSubmit={handleRegister}>
            <Input
              type="text"
              placeholder="Digite o nome da categoria"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Button2 type="submit" loading={loading}>
              Cadastrar
            </Button2>
          </form>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {}
  }
})